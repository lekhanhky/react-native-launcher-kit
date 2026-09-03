import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, NativeModules, Platform } from 'react-native';
import { WebView } from 'react-native-webview';

const { SoundPlayerModule } = NativeModules;

// Global Event Listener cho Âm thanh (Fallback Web / iOS)
type SoundListener = (soundUrl: string, textToSpeak?: string) => void;
const soundListeners: Set<SoundListener> = new Set();
let preloadListeners: Array<(urls: string[]) => void> = [];

export const soundManager = {
  play(url?: string, textToSpeak?: string) {
    if (!url && !textToSpeak) return;

    // 1. ƯU TIÊN 1: NATIVE ANDROID HARDWARE MEDIA PLAYER (0ms, Native Audio, Không bị chặn autoplay)
    if (Platform.OS === 'android' && SoundPlayerModule) {
      if (url) {
        SoundPlayerModule.play(url).catch(() => {});
      } else if (textToSpeak) {
        SoundPlayerModule.speak(textToSpeak, 'vi').catch(() => {});
      }
      return;
    }

    // 2. ƯU TIÊN 2: Listener Fallback cho WebView
    soundListeners.forEach((listener) => listener(url || '', textToSpeak));
  },
  speak(text: string, lang: 'vi' | 'en' = 'vi') {
    if (Platform.OS === 'android' && SoundPlayerModule) {
      SoundPlayerModule.speak(text, lang).catch(() => {});
    }
  },
  playSuccess() {
    this.speak('Chính xác! Hoan hô bé', 'vi');
  },
  playError() {
    this.speak('Thử lại nào', 'vi');
  },
  stop() {
    if (Platform.OS === 'android' && SoundPlayerModule) {
      SoundPlayerModule.stop().catch(() => {});
    }
  },
  preload(urls: string[]) {
    if (Platform.OS === 'android' && SoundPlayerModule) {
      SoundPlayerModule.cacheSounds(urls).catch(() => {});
    }
    preloadListeners.forEach((listener) => listener(urls));
  },
  subscribe(listener: SoundListener) {
    soundListeners.add(listener);
    return () => {
      soundListeners.delete(listener);
    };
  },
};

const HTML_AUDIO_PLAYER = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="background: transparent; margin: 0; padding: 0;">
  <script>
    var currentAudio = null;
    var audioCtx = null;
    var audioCache = {};

    function getAudioContext() {
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

    function preloadUrls(urls) {
      if (!Array.isArray(urls)) return;
      urls.forEach(function(url) {
        if (!url || audioCache[url]) return;
        try {
          var a = new Audio();
          a.preload = 'auto';
          a.src = url;
          audioCache[url] = a;
        } catch(e) {}
      });
    }

    function playAudio(url) {
      if (!url) return;
      try {
        getAudioContext();

        if (currentAudio) {
          try {
            currentAudio.pause();
            currentAudio.currentTime = 0;
          } catch(e){}
        }

        if (audioCache[url]) {
          currentAudio = audioCache[url];
          currentAudio.currentTime = 0;
        } else {
          currentAudio = new Audio();
          currentAudio.src = url;
          audioCache[url] = currentAudio;
        }

        var playPromise = currentAudio.play();
        if (playPromise !== undefined) {
          playPromise.catch(function(error) {
            console.log('Audio catch:', error);
          });
        }
      } catch (e) {
        console.log('Audio error:', e);
      }
    }

    function speakText(text, lang) {
      try {
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
          var utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = lang || 'vi-VN';
          utterance.rate = 0.95;
          window.speechSynthesis.speak(utterance);
        }
      } catch (e) {}
    }
  </script>
</body>
</html>
`;

export const SoundPlayer: React.FC = () => {
  const webViewRef = useRef<WebView>(null);
  const [isReady, setIsReady] = useState(false);

  const executeAudioScript = (url?: string, text?: string) => {
    if (!webViewRef.current) return;
    if (url) {
      const escapedUrl = JSON.stringify(url);
      const jsCode = `playAudio(${escapedUrl}); true;`;
      webViewRef.current.injectJavaScript(jsCode);
    } else if (text) {
      const escapedText = JSON.stringify(text);
      const jsCode = `speakText(${escapedText}, 'vi-VN'); true;`;
      webViewRef.current.injectJavaScript(jsCode);
    }
  };

  const executePreloadScript = (urls: string[]) => {
    if (!webViewRef.current || !urls || urls.length === 0) return;
    const escaped = JSON.stringify(urls);
    const jsCode = `preloadUrls(${escaped}); true;`;
    webViewRef.current.injectJavaScript(jsCode);
  };

  useEffect(() => {
    const handlePreload = (urls: string[]) => executePreloadScript(urls);
    preloadListeners.push(handlePreload);

    const unsubscribe = soundManager.subscribe((url, textToSpeak) => {
      executeAudioScript(url, textToSpeak);
    });

    return () => {
      preloadListeners = preloadListeners.filter((l) => l !== handlePreload);
      unsubscribe();
    };
  }, [isReady]);

  const WebViewAny = WebView as any;

  return (
    <View style={styles.hiddenContainer} pointerEvents="none">
      <WebViewAny
        ref={webViewRef}
        originWhitelist={['*']}
        source={{ html: HTML_AUDIO_PLAYER }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        mediaPlaybackRequiresUserAction={false}
        allowsInlineMediaPlayback={true}
        mixedContentMode="always"
        onLoadEnd={() => setIsReady(true)}
        style={styles.hiddenWebView}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  hiddenContainer: {
    width: 20,
    height: 20,
    opacity: 0.05,
    position: 'absolute',
    bottom: 0,
    right: 0,
    zIndex: -1,
  },
  hiddenWebView: {
    width: 20,
    height: 20,
  },
});
