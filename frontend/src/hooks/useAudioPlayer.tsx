import { useRef, useState, useCallback, useEffect } from "react";
import { Howl } from "howler";
import type { Metadata } from "../models";
import { useTrack } from "../contexts/TrackContext";

export const useAudioPlayer = () => {
  const howlRef = useRef<Howl | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const {
    volume: trackVolume,
    setVolume: setTrackVolume,
    isMuted: isTrackMuted,
  } = useTrack();

  // Update progress periodically while playing
  useEffect(() => {
    let interval: number | undefined;

    if (isPlaying && howlRef.current) {
      interval = window.setInterval(() => {
        if (howlRef.current) {
          const seek = howlRef.current.seek() as number;
          const dur = howlRef.current.duration();
          // TODO Make track progress an external thing
          setProgress(dur > 0 ? seek / dur : 0);
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying]);

  useEffect(() => {
    howlRef.current?.mute(isTrackMuted);
  }, [isTrackMuted]);

  const play = useCallback(
    (track: Metadata, onEnded?: () => void) => {
      // Clean up previous instance
      if (howlRef.current) {
        howlRef.current.unload();
      }

      const url = `${
        import.meta.env.VITE_DEVPREFIX
      }/api/audio?path=${encodeURIComponent(track.path)}`;

      howlRef.current = new Howl({
        src: [url],
        html5: true, // Important: enables streaming & seeking for large files
        format: [track.path.endsWith(".ogg") ? "ogg" : "mp3"],
        onload: () => {
          setDuration(howlRef.current?.duration() ?? 0);
        },
        onplay: () => setIsPlaying(true),
        onpause: () => setIsPlaying(false),
        onstop: () => setIsPlaying(false),
        onend: () => {
          setIsPlaying(false);
          setProgress(0);
          onEnded?.();
        },
      });

      howlRef.current.volume(trackVolume);
      howlRef.current.play();
    },
    [trackVolume],
  );

  const togglePlayPause = useCallback(() => {
    if (!howlRef.current) return;

    if (isPlaying) {
      howlRef.current.pause();
    } else {
      howlRef.current.play();
    }
  }, [isPlaying]);

  const seek = useCallback((position: number) => {
    if (!howlRef.current) return;
    howlRef.current.seek(position * howlRef.current.duration());
  }, []);

  const setVolume = useCallback(
    (volume: number) => {
      howlRef.current?.volume(volume); // 0.0 to 1.0
      setTrackVolume(volume);
    },
    [setTrackVolume],
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (howlRef.current) {
        howlRef.current.unload();
      }
    };
  }, []);

  return {
    play,
    togglePlayPause,
    seek,
    setVolume,
    isPlaying,
    progress,
    duration,
  };
};
