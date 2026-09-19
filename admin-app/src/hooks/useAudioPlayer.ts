import { useState, useEffect, useRef } from 'react';
import { Audio } from 'expo-av';

export const useAudioPlayer = () => {
  const [playingUrl, setPlayingUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const soundRef = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    return () => {
      // Unload sound when unmounting
      if (soundRef.current) {
        soundRef.current.unloadAsync().catch(() => {});
      }
    };
  }, []);

  const playSound = async (url: string) => {
    try {
      if (!url) return;

      // If already playing the same url, stop it
      if (playingUrl === url && soundRef.current) {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
        soundRef.current = null;
        setPlayingUrl(null);
        return;
      }

      setIsLoading(true);

      // If another sound was playing, unload it
      if (soundRef.current) {
        await soundRef.current.stopAsync().catch(() => {});
        await soundRef.current.unloadAsync().catch(() => {});
        soundRef.current = null;
      }

      // Configure audio mode
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
      });

      const { sound } = await Audio.Sound.createAsync(
        { uri: url },
        { shouldPlay: true }
      );

      soundRef.current = sound;
      setPlayingUrl(url);
      setIsLoading(false);

      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          setPlayingUrl(null);
        }
      });
    } catch (error) {
      console.warn('Audio playback error:', error);
      setIsLoading(false);
      setPlayingUrl(null);
    }
  };

  const stopSound = async () => {
    if (soundRef.current) {
      await soundRef.current.stopAsync().catch(() => {});
      await soundRef.current.unloadAsync().catch(() => {});
      soundRef.current = null;
    }
    setPlayingUrl(null);
  };

  return {
    playingUrl,
    isLoading,
    playSound,
    stopSound,
  };
};
