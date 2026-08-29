package com.rnlauncherkit

import android.media.AudioAttributes
import android.media.AudioManager
import android.media.MediaPlayer
import android.media.ToneGenerator
import android.net.Uri
import android.os.Handler
import android.os.Looper
import android.speech.tts.TextToSpeech
import android.util.Log
import com.facebook.react.bridge.*
import java.io.File
import java.io.FileOutputStream
import java.net.HttpURLConnection
import java.net.URL
import java.security.MessageDigest
import java.util.*
import java.util.concurrent.Executors

class SoundPlayerModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext), TextToSpeech.OnInitListener {

    private var mediaPlayer: MediaPlayer? = null
    private var tts: TextToSpeech? = null
    private var isTtsReady = false
    private var toneGenerator: ToneGenerator? = null
    private val mainHandler = Handler(Looper.getMainLooper())
    private val downloadExecutor = Executors.newFixedThreadPool(4)

    // Thư mục lưu file âm thanh trên bộ nhớ cài đặt của máy
    private val soundsDir: File
        get() {
            val dir = File(reactContext.filesDir, "sounds")
            if (!dir.exists()) {
                dir.mkdirs()
            }
            return dir
        }

    init {
        try {
            tts = TextToSpeech(reactContext, this)
            toneGenerator = ToneGenerator(AudioManager.STREAM_MUSIC, 80)
            soundsDir // Khởi tạo thư mục /data/data/.../files/sounds
        } catch (e: Exception) {
            Log.e("SoundPlayerModule", "Init error: ${e.message}")
        }
    }

    override fun getName(): String = "SoundPlayerModule"

    override fun onInit(status: Int) {
        if (status == TextToSpeech.SUCCESS) {
            isTtsReady = true
            tts?.language = Locale("vi", "VN")
        }
    }

    /**
     * Tạo tên file mã hóa MD5 duy nhất cho URL
     */
    private fun getCachedFileName(url: String): String {
        return try {
            val md = MessageDigest.getInstance("MD5")
            val bytes = md.digest(url.toByteArray())
            val sb = StringBuilder()
            for (b in bytes) {
                sb.append(String.format("%02x", b))
            }
            val ext = if (url.contains(".mp3")) ".mp3" else if (url.contains(".ogg")) ".ogg" else ".wav"
            sb.toString() + ext
        } catch (e: Exception) {
            url.hashCode().toString() + ".mp3"
        }
    }

    private fun getLocalFileForUrl(url: String): File {
        return File(soundsDir, getCachedFileName(url))
    }

    /**
     * Phát âm thanh: Tự động kiểm tra file trên máy trước (0s delay), nếu chưa có mới stream online
     */
    @ReactMethod
    fun play(url: String?, promise: Promise?) {
        if (url.isNullOrEmpty()) {
            promise?.resolve(false)
            return
        }

        mainHandler.post {
            try {
                // Haptic Pop beep 0ms ngay khi chạm tay
                try {
                    toneGenerator?.startTone(ToneGenerator.TONE_PROP_BEEP, 40)
                } catch (e: Exception) {}

                // Dừng player cũ nếu đang phát
                mediaPlayer?.let {
                    try {
                        if (it.isPlaying) it.stop()
                        it.release()
                    } catch (e: Exception) {}
                }

                val localFile = getLocalFileForUrl(url)
                val mp = MediaPlayer().apply {
                    setAudioAttributes(
                        AudioAttributes.Builder()
                            .setContentType(AudioAttributes.CONTENT_TYPE_MUSIC)
                            .setUsage(AudioAttributes.USAGE_MEDIA)
                            .build()
                    )

                    if (localFile.exists() && localFile.length() > 0) {
                        // 1. PHÁT TRỰC TIẾP TỪ BỘ NHỚ LOCAL TRÊN MÁY (0s độ trễ)
                        Log.d("SoundPlayerModule", "Playing from LOCAL storage: ${localFile.absolutePath}")
                        setDataSource(localFile.absolutePath)
                    } else {
                        // 2. Chưa có trên máy -> phát tạm online và tải ngầm lưu vào máy
                        Log.d("SoundPlayerModule", "Streaming online & downloading to local: $url")
                        setDataSource(reactContext, Uri.parse(url))
                        downloadSoundToLocal(url, null)
                    }

                    setOnPreparedListener { player ->
                        try {
                            player.setVolume(1.0f, 1.0f)
                            player.start()
                            promise?.resolve(true)
                        } catch (e: Exception) {
                            promise?.resolve(false)
                        }
                    }
                    setOnErrorListener { _, what, extra ->
                        Log.e("SoundPlayerModule", "MediaPlayer error: what=$what, extra=$extra")
                        promise?.resolve(false)
                        true
                    }
                    setOnCompletionListener { player ->
                        try {
                            player.release()
                        } catch (e: Exception) {}
                        if (mediaPlayer === player) {
                            mediaPlayer = null
                        }
                    }
                }
                mediaPlayer = mp
                mp.prepareAsync()
            } catch (e: Exception) {
                Log.e("SoundPlayerModule", "Play exception: ${e.message}")
                promise?.resolve(false)
            }
        }
    }

    /**
     * Tải file âm thanh về bộ nhớ máy (Kiểm tra nếu có rồi thì bỏ qua không tải lại)
     */
    private fun downloadSoundToLocal(url: String, callback: ((Boolean) -> Unit)?) {
        downloadExecutor.execute {
            val localFile = getLocalFileForUrl(url)
            if (localFile.exists() && localFile.length() > 0) {
                // Đã có sẵn -> không cần tải lại
                callback?.invoke(true)
                return@execute
            }

            var input: java.io.InputStream? = null
            var output: FileOutputStream? = null
            var conn: HttpURLConnection? = null
            val tempFile = File(soundsDir, "${localFile.name}.tmp")

            try {
                val connUrl = URL(url)
                conn = (connUrl.openConnection() as HttpURLConnection).apply {
                    connectTimeout = 8000
                    readTimeout = 15000
                    instanceFollowRedirects = true
                    setRequestProperty("User-Agent", "Mozilla/5.0 RNLauncherKit")
                }
                conn.connect()

                if (conn.responseCode == HttpURLConnection.HTTP_OK) {
                    input = conn.inputStream
                    output = FileOutputStream(tempFile)
                    val buffer = ByteArray(4096)
                    var bytesRead: Int
                    while (input.read(buffer).also { bytesRead = it } != -1) {
                        output.write(buffer, 0, bytesRead)
                    }
                    output.flush()
                    tempFile.renameTo(localFile)
                    Log.d("SoundPlayerModule", "Saved sound to LOCAL: ${localFile.absolutePath} (${localFile.length()} bytes)")
                    callback?.invoke(true)
                } else {
                    callback?.invoke(false)
                }
            } catch (e: Exception) {
                Log.e("SoundPlayerModule", "Download error: ${e.message}")
                try { tempFile.delete() } catch (ex: Exception) {}
                callback?.invoke(false)
            } finally {
                try { input?.close() } catch (e: Exception) {}
                try { output?.close() } catch (e: Exception) {}
                try { conn?.disconnect() } catch (e: Exception) {}
            }
        }
    }

    /**
     * React Native API: Tải và lưu trước toàn bộ file âm thanh vào thư mục cài đặt
     */
    @ReactMethod
    fun cacheSounds(urls: ReadableArray, promise: Promise?) {
        val total = urls.size()
        if (total == 0) {
            promise?.resolve(0)
            return
        }

        var completed = 0
        var cachedCount = 0

        for (i in 0 until total) {
            val url = urls.getString(i)
            if (url != null) {
                val local = getLocalFileForUrl(url)
                if (local.exists() && local.length() > 0) {
                    completed++
                    cachedCount++
                    if (completed == total) {
                        promise?.resolve(cachedCount)
                    }
                } else {
                    downloadSoundToLocal(url) { success ->
                        mainHandler.post {
                            completed++
                            if (success) cachedCount++
                            if (completed == total) {
                                promise?.resolve(cachedCount)
                            }
                        }
                    }
                }
            } else {
                completed++
                if (completed == total) {
                    promise?.resolve(cachedCount)
                }
            }
        }
    }

    /**
     * React Native API: Kiểm tra xem 1 file URL đã có trong máy chưa
     */
    @ReactMethod
    fun isSoundCached(url: String?, promise: Promise?) {
        if (url == null) {
            promise?.resolve(false)
            return
        }
        val file = getLocalFileForUrl(url)
        promise?.resolve(file.exists() && file.length() > 0)
    }

    /**
     * React Native API: Lấy đường dẫn file:/// cục bộ
     */
    @ReactMethod
    fun getLocalCachePath(url: String?, promise: Promise?) {
        if (url == null) {
            promise?.resolve(null)
            return
        }
        val file = getLocalFileForUrl(url)
        if (file.exists() && file.length() > 0) {
            promise?.resolve("file://${file.absolutePath}")
        } else {
            promise?.resolve(null)
        }
    }

    @ReactMethod
    fun speak(text: String?, lang: String?, promise: Promise?) {
        if (text.isNullOrEmpty()) {
            promise?.resolve(false)
            return
        }

        mainHandler.post {
            try {
                if (isTtsReady && tts != null) {
                    val locale = if (lang == "en") Locale.US else Locale("vi", "VN")
                    tts?.language = locale
                    tts?.speak(text, TextToSpeech.QUEUE_FLUSH, null, "KIDS_TTS_${System.currentTimeMillis()}")
                    promise?.resolve(true)
                } else {
                    promise?.resolve(false)
                }
            } catch (e: Exception) {
                Log.e("SoundPlayerModule", "TTS error: ${e.message}")
                promise?.resolve(false)
            }
        }
    }

    @ReactMethod
    fun stop(promise: Promise?) {
        mainHandler.post {
            try {
                mediaPlayer?.let {
                    if (it.isPlaying) it.stop()
                    it.release()
                }
                mediaPlayer = null
                tts?.stop()
                promise?.resolve(true)
            } catch (e: Exception) {
                promise?.resolve(false)
            }
        }
    }

    override fun invalidate() {
        super.invalidate()
        try {
            mediaPlayer?.release()
            mediaPlayer = null
            tts?.shutdown()
            tts = null
            toneGenerator?.release()
            toneGenerator = null
        } catch (e: Exception) {}
    }
}
