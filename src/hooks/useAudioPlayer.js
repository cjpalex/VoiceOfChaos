import { useState, useEffect, useRef, useCallback } from 'react';
import { Howl } from 'howler';

export function useAudioPlayer(chapters, onChapterComplete, initialIndex = 0) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isPlaying, setIsPlaying] = useState(false);
  const [seek, setSeek] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [durations, setDurations] = useState({});

  const howlRef = useRef(null);
  const rafRef = useRef(null);
  const seekingRef = useRef(false);
  const onCompleteRef = useRef(onChapterComplete);
  useEffect(() => { onCompleteRef.current = onChapterComplete; }, [onChapterComplete]);

  const chapter = chapters[currentIndex];

  const recordDuration = useCallback((id, secs) => {
    if (!secs || isNaN(secs)) return;
    setDurations((prev) => (prev[id] === secs ? prev : { ...prev, [id]: secs }));
  }, []);

  const stopRaf = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const startRaf = useCallback(() => {
    stopRaf();
    const tick = () => {
      if (howlRef.current && !seekingRef.current) {
        const s = howlRef.current.seek();
        if (typeof s === 'number') setSeek(s);
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [stopRaf]);

  const loadChapter = useCallback(
    (index, autoplay = false) => {
      stopRaf();
      if (howlRef.current) {
        howlRef.current.unload();
        howlRef.current = null;
      }
      setSeek(0);
      setDuration(0);
      setIsLoading(true);

      const ch = chapters[index];
      const howl = new Howl({
        src: [ch.audio],
        html5: true,
        onload() {
          const d = howl.duration();
          setDuration(d);
          recordDuration(ch.id, d);
          setIsLoading(false);
          if (autoplay) {
            howl.play();
            setIsPlaying(true);
            startRaf();
          }
        },
        onplay() {
          setIsPlaying(true);
          startRaf();
        },
        onpause() {
          setIsPlaying(false);
          stopRaf();
        },
        onstop() {
          setIsPlaying(false);
          stopRaf();
          setSeek(0);
        },
        onend() {
          stopRaf();
          setSeek(0);
          onCompleteRef.current?.(ch.id);
          if (index < chapters.length - 1) {
            const next = index + 1;
            setCurrentIndex(next);
            loadChapter(next, true);
          } else {
            setIsPlaying(false);
          }
        },
        onloaderror(id, err) {
          console.warn('Audio load error:', err);
          setIsLoading(false);
          setIsPlaying(false);
        },
      });

      howlRef.current = howl;
    },
    [chapters, startRaf, stopRaf, recordDuration]
  );

  // Load initial chapter on mount
  useEffect(() => {
    loadChapter(initialIndex);
    return () => {
      stopRaf();
      if (howlRef.current) howlRef.current.unload();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Background metadata-only pass: fetch durations for all chapters
  // Uses native Audio with preload="metadata" — downloads only a few KB per file
  useEffect(() => {
    const els = [];
    for (const ch of chapters) {
      const el = new Audio();
      el.preload = 'metadata';
      el.onloadedmetadata = () => {
        recordDuration(ch.id, el.duration);
        el.src = '';
      };
      el.src = ch.audio;
      els.push(el);
    }
    return () => {
      for (const el of els) {
        el.onloadedmetadata = null;
        el.src = '';
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const togglePlay = useCallback(() => {
    if (!howlRef.current) return;
    if (isPlaying) {
      howlRef.current.pause();
    } else {
      howlRef.current.play();
    }
  }, [isPlaying]);

  const seekTo = useCallback((seconds) => {
    if (!howlRef.current) return;
    seekingRef.current = true;
    howlRef.current.seek(seconds);
    setSeek(seconds);
    setTimeout(() => {
      seekingRef.current = false;
    }, 100);
  }, []);

  const goTo = useCallback(
    (index) => {
      const playing = isPlaying;
      setCurrentIndex(index);
      loadChapter(index, playing);
    },
    [isPlaying, loadChapter]
  );

  const prev = useCallback(() => {
    if (seek > 3 && howlRef.current) {
      seekTo(0);
    } else if (currentIndex > 0) {
      goTo(currentIndex - 1);
    }
  }, [currentIndex, seek, goTo, seekTo]);

  const next = useCallback(() => {
    if (currentIndex < chapters.length - 1) {
      goTo(currentIndex + 1);
    }
  }, [currentIndex, chapters.length, goTo]);

  return {
    chapter,
    currentIndex,
    isPlaying,
    isLoading,
    seek,
    duration,
    durations,
    togglePlay,
    seekTo,
    prev,
    next,
    goTo,
  };
}
