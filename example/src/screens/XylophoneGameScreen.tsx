import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Animated,
  useWindowDimensions,
  Platform,
  ScrollView,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { soundManager } from '../components/SoundPlayer';

interface NoteKey {
  note: string;
  nameVi: string;
  color: string;
  heightRatio: number;
  freq: number;
}

const NOTES: NoteKey[] = [
  { note: 'C', nameVi: 'Đồ', color: '#EF4444', heightRatio: 1.0, freq: 261.63 },
  { note: 'D', nameVi: 'Rê', color: '#F97316', heightRatio: 0.93, freq: 293.66 },
  { note: 'E', nameVi: 'Mi', color: '#FBBF24', heightRatio: 0.86, freq: 329.63 },
  { note: 'F', nameVi: 'Pha', color: '#10B981', heightRatio: 0.80, freq: 349.23 },
  { note: 'G', nameVi: 'Son', color: '#06B6D4', heightRatio: 0.74, freq: 392.00 },
  { note: 'A', nameVi: 'La', color: '#3B82F6', heightRatio: 0.68, freq: 440.00 },
  { note: 'B', nameVi: 'Si', color: '#8B5CF6', heightRatio: 0.62, freq: 493.88 },
  { note: 'C2', nameVi: 'Đố', color: '#EC4899', heightRatio: 0.56, freq: 523.25 },
];

interface Song {
  id: string;
  title: string;
  notes: string[];
}

const SONGS: Song[] = [
  {
    id: 'twinkle',
    title: '⭐ Ngôi Sao Nhỏ (Twinkle)',
    notes: ['C', 'C', 'G', 'G', 'A', 'A', 'G', 'F', 'F', 'E', 'E', 'D', 'D', 'C'],
  },
  {
    id: 'butterfly',
    title: '🦋 Kìa Con Bướm Vàng',
    notes: ['C', 'D', 'E', 'C', 'C', 'D', 'E', 'C', 'E', 'F', 'G', 'E', 'F', 'G'],
  },
  {
    id: 'jingle',
    title: '🔔 Chuông Reo Vui',
    notes: ['E', 'E', 'E', 'E', 'E', 'E', 'E', 'G', 'C', 'D', 'E', 'F', 'F', 'F'],
  },
];

const XYLOPHONE_AUDIO_HTML = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="background:transparent;margin:0;padding:0;">
<script>
  var audioCtx = null;

  function initAudio() {
    if (!audioCtx) {
      var AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  // Khởi tạo audio context sớm
  document.addEventListener('DOMContentLoaded', initAudio);
  window.addEventListener('click', initAudio);
  window.addEventListener('touchstart', initAudio);

  window.playXyloNote = function(freq) {
    try {
      var ctx = initAudio();
      if (!ctx) return;
      var now = ctx.currentTime;

      // 1. Âm cơ bản (Triangle wave cho âm sắc gỗ/chuông trong trẻo)
      var osc1 = ctx.createOscillator();
      var gain1 = ctx.createGain();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(freq, now);

      gain1.gain.setValueAtTime(0, now);
      gain1.gain.linearRampToValueAtTime(0.8, now + 0.005);
      gain1.gain.exponentialRampToValueAtTime(0.0001, now + 1.1);

      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 1.1);

      // 2. Họa âm cao (Bậc 3 - tiếng gõ dùi chạm thanh kim loại/gỗ)
      var osc2 = ctx.createOscillator();
      var gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(freq * 3, now);

      gain2.gain.setValueAtTime(0, now);
      gain2.gain.linearRampToValueAtTime(0.35, now + 0.003);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now);
      osc2.stop(now + 0.35);

      // 3. Họa âm quãng 8 (Bậc 2 - độ vang sâu)
      var osc3 = ctx.createOscillator();
      var gain3 = ctx.createGain();
      osc3.type = 'sine';
      osc3.frequency.setValueAtTime(freq * 2, now);

      gain3.gain.setValueAtTime(0, now);
      gain3.gain.linearRampToValueAtTime(0.25, now + 0.005);
      gain3.gain.exponentialRampToValueAtTime(0.0001, now + 0.7);

      osc3.connect(gain3);
      gain3.connect(ctx.destination);
      osc3.start(now);
      osc3.stop(now + 0.7);
    } catch(e) {
      console.log('Audio synth error:', e);
    }
  };
</script>
</body>
</html>
`;

export const XylophoneGameScreen: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { width } = useWindowDimensions();
  const webViewRef = useRef<WebView>(null);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [currentNoteIndex, setCurrentNoteIndex] = useState(0);
  const [mode, setMode] = useState<'free' | 'song'>('free');
  const [score, setScore] = useState(0);
  const [recordedNotes, setRecordedNotes] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState(false);

  // Animations for keys
  const animScales = useRef(NOTES.map(() => new Animated.Value(1))).current;

  useEffect(() => {
    soundManager.speak('Chào mừng bé đến với đàn sắc màu Xylophone!', 'vi');
  }, []);

  const playNote = (noteKey: NoteKey, index: number) => {
    // 1. Animate key tap
    Animated.sequence([
      Animated.timing(animScales[index], { toValue: 0.92, duration: 60, useNativeDriver: true }),
      Animated.spring(animScales[index], { toValue: 1, friction: 3, useNativeDriver: true }),
    ]).start();

    // 2. Phát Âm Thanh Nhạc Cụ Xylophone Chuẩn Tần Số (Không dùng tiếng người đọc)
    if (webViewRef.current) {
      const jsCode = `window.playXyloNote(${noteKey.freq}); true;`;
      webViewRef.current.injectJavaScript(jsCode);
    }

    if (isRecording) {
      setRecordedNotes((prev) => [...prev, noteKey.note]);
    }

    // 3. Xử lý chế độ tập đánh theo bài
    if (mode === 'song' && selectedSong) {
      const targetNote = selectedSong.notes[currentNoteIndex];
      if (noteKey.note === targetNote) {
        setScore((prev) => prev + 10);
        if (currentNoteIndex + 1 >= selectedSong.notes.length) {
          soundManager.speak('Tuyệt vời! Bé đã hoàn thành bản nhạc!', 'vi');
          setCurrentNoteIndex(0);
        } else {
          setCurrentNoteIndex((prev) => prev + 1);
        }
      }
    }
  };

  const playRecorded = async () => {
    if (recordedNotes.length === 0) {
      soundManager.speak('Bé hãy gõ các phím đàn để thu âm nhé', 'vi');
      return;
    }
    soundManager.speak('Bắt đầu phát lại bản nhạc của bé', 'vi');
    for (let i = 0; i < recordedNotes.length; i++) {
      const noteStr = recordedNotes[i];
      const keyIdx = NOTES.findIndex((n) => n.note === noteStr);
      if (keyIdx !== -1) {
        setTimeout(() => {
          playNote(NOTES[keyIdx], keyIdx);
        }, i * 380);
      }
    }
  };

  const WebViewAny = WebView as any;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />

      {/* HIDDEN WEB AUDIO SYNTHESIZER FOR ZERO-LATENCY XYLOPHONE TONES */}
      <View style={styles.hiddenAudioContainer} pointerEvents="none">
        <WebViewAny
          ref={webViewRef}
          originWhitelist={['*']}
          source={{ html: XYLOPHONE_AUDIO_HTML }}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          mediaPlaybackRequiresUserAction={false}
          allowsInlineMediaPlayback={true}
          mixedContentMode="always"
          style={styles.hiddenWebView}
        />
      </View>

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.7}>
          <Text style={styles.closeBtnText}>✕</Text>
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>🎹 Đàn Xylophone 7 Sắc</Text>
          <Text style={styles.subtitleText}>
            {mode === 'free' ? 'Gõ phím đàn tự do hoặc thu âm' : `Tập bài: ${selectedSong?.title}`}
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.modeBtn, mode === 'song' && styles.modeBtnActive]}
          onPress={() => {
            if (mode === 'free') {
              setMode('song');
              setSelectedSong(SONGS[0]);
              setCurrentNoteIndex(0);
              soundManager.speak('Chế độ tập đánh theo nốt bài hát!', 'vi');
            } else {
              setMode('free');
              setSelectedSong(null);
            }
          }}
          activeOpacity={0.8}
        >
          <Text style={styles.modeBtnText}>{mode === 'free' ? '🎵 Tập Bài' : '🎹 Tự Do'}</Text>
        </TouchableOpacity>
      </View>

      {/* SONG SELECTOR OR RECORDING BAR */}
      {mode === 'song' ? (
        <View style={styles.songBar}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.songList}>
            {SONGS.map((song) => (
              <TouchableOpacity
                key={song.id}
                style={[styles.songCard, selectedSong?.id === song.id && styles.songCardActive]}
                onPress={() => {
                  setSelectedSong(song);
                  setCurrentNoteIndex(0);
                }}
              >
                <Text style={[styles.songTitle, selectedSong?.id === song.id && styles.songTitleActive]}>
                  {song.title}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* TARGET NOTE HINT */}
          {selectedSong && (
            <View style={styles.targetNoteContainer}>
              <Text style={styles.targetLabel}>Nốt tiếp theo: </Text>
              <View style={styles.targetBadge}>
                <Text style={styles.targetBadgeText}>
                  {NOTES.find((n) => n.note === selectedSong.notes[currentNoteIndex])?.nameVi || selectedSong.notes[currentNoteIndex]}
                </Text>
              </View>
              <Text style={styles.scoreText}>⭐ {score} điểm</Text>
            </View>
          )}
        </View>
      ) : (
        <View style={styles.recordBar}>
          <TouchableOpacity
            style={[styles.recBtn, isRecording && styles.recBtnActive]}
            onPress={() => {
              if (!isRecording) {
                setRecordedNotes([]);
                setIsRecording(true);
                soundManager.speak('Bắt đầu thu âm', 'vi');
              } else {
                setIsRecording(false);
                soundManager.speak('Đã lưu bài nhạc của bé', 'vi');
              }
            }}
          >
            <Text style={styles.recBtnText}>{isRecording ? '⏹ Dừng Thu' : '🔴 Thu Âm'}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.playBtn} onPress={playRecorded}>
            <Text style={styles.playBtnText}>▶️ Phát Lại ({recordedNotes.length})</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* XYLOPHONE BOARD */}
      <View style={styles.xylophoneFrame}>
        <View style={styles.topBarRail} />
        <View style={styles.bottomBarRail} />

        <View style={styles.keysContainer}>
          {NOTES.map((item, index) => {
            const isTarget =
              mode === 'song' &&
              selectedSong &&
              selectedSong.notes[currentNoteIndex] === item.note;

            return (
              <Animated.View
                key={item.note}
                style={[
                  styles.keyWrapper,
                  {
                    height: `${item.heightRatio * 100}%`,
                    transform: [{ scale: animScales[index] }],
                  },
                ]}
              >
                <TouchableOpacity
                  style={[
                    styles.keyButton,
                    { backgroundColor: item.color },
                    isTarget && styles.targetKeyHighlight,
                  ]}
                  activeOpacity={0.85}
                  onPress={() => playNote(item, index)}
                >
                  <View style={styles.screwTop} />
                  <Text style={styles.noteNameVi}>{item.nameVi}</Text>
                  <Text style={styles.noteNameEn}>{item.note}</Text>
                  {isTarget && (
                    <View style={styles.targetIndicator}>
                      <Text style={styles.targetStar}>👇</Text>
                    </View>
                  )}
                  <View style={styles.screwBottom} />
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  hiddenAudioContainer: {
    width: 2,
    height: 2,
    opacity: 0.01,
    position: 'absolute',
    bottom: 0,
    right: 0,
    zIndex: -1,
  },
  hiddenWebView: {
    width: 2,
    height: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 8 : 8,
    paddingBottom: 12,
  },
  closeBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtnText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '800',
  },
  titleContainer: {
    alignItems: 'center',
  },
  titleText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#F8FAFC',
  },
  subtitleText: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  modeBtn: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  modeBtnActive: {
    backgroundColor: '#10B981',
  },
  modeBtnText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 12,
  },
  songBar: {
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  songList: {
    gap: 8,
    paddingVertical: 4,
  },
  songCard: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  songCardActive: {
    backgroundColor: '#6366F1',
    borderColor: '#A5B4FC',
  },
  songTitle: {
    color: '#CBD5E1',
    fontSize: 12,
    fontWeight: '700',
  },
  songTitleActive: {
    color: '#FFF',
  },
  targetNoteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    gap: 8,
  },
  targetLabel: {
    color: '#E2E8F0',
    fontSize: 14,
    fontWeight: '600',
  },
  targetBadge: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 12,
  },
  targetBadgeText: {
    color: '#FFF',
    fontWeight: '900',
    fontSize: 16,
  },
  scoreText: {
    color: '#FDE047',
    fontSize: 14,
    fontWeight: '800',
    marginLeft: 10,
  },
  recordBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginVertical: 6,
  },
  recBtn: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderColor: '#EF4444',
    borderWidth: 1.5,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  recBtnActive: {
    backgroundColor: '#EF4444',
  },
  recBtnText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 13,
  },
  playBtn: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    borderColor: '#3B82F6',
    borderWidth: 1.5,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  playBtnText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 13,
  },
  xylophoneFrame: {
    flex: 1,
    marginHorizontal: 12,
    marginVertical: 10,
    backgroundColor: '#1E293B',
    borderRadius: 24,
    padding: 12,
    position: 'relative',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#334155',
  },
  topBarRail: {
    position: 'absolute',
    left: 20,
    right: 20,
    top: '20%',
    height: 12,
    backgroundColor: '#475569',
    borderRadius: 6,
  },
  bottomBarRail: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: '20%',
    height: 12,
    backgroundColor: '#475569',
    borderRadius: 6,
  },
  keysContainer: {
    flexDirection: 'row',
    height: '92%',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  keyWrapper: {
    flex: 1,
    marginHorizontal: 3,
    justifyContent: 'center',
  },
  keyButton: {
    flex: 1,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 5,
    elevation: 6,
  },
  targetKeyHighlight: {
    borderWidth: 3,
    borderColor: '#FFFFFF',
    transform: [{ scale: 1.04 }],
  },
  screwTop: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#1E293B',
    opacity: 0.7,
  },
  screwBottom: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#1E293B',
    opacity: 0.7,
  },
  noteNameVi: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  noteNameEn: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 12,
    fontWeight: '700',
  },
  targetIndicator: {
    position: 'absolute',
    top: -24,
  },
  targetStar: {
    fontSize: 20,
  },
});

export default XylophoneGameScreen;
