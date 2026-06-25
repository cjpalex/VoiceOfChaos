import { useState, useEffect, useRef, useCallback } from 'react';

export function useAudioPlayer(chapters, onChapterComplete, initialIndex = 0, seeks = {}) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isPlaying, setIsPlaying] = useState(false);
  const [seek, setSeek] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [buffered, setBuffered] = useState(0);
  const [durations, setDurations] = useState({});

  const audioRef = useRef(null);
  const rafRef = useRef(null);
  const seekingRef = useRef(false);
  const onCompleteRef = useRef(onChapterComplete);
  const seeksRef = useRef(seeks);

  useEffect(() => { onCompleteRef.current = onChapterComplete; }, [onChapterComplete]);
  useEffect(() => { seeksRef.current = seeks; }, [seeks]);

  const chapter = chapters[currentIndex];

  const recordDuration = useCallback((id, secs) => {
    if (!secs || isNaN(secs)) return;
    setDurations(prev => prev[id] === secs ? prev : { ...prev, [id]: secs });
  }, []);

  const stopRaf = useCallback(() => {
    if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
  }, []);

  const startRaf = useCallback(() => {
    stopRaf();
    const tick = () => {
      const audio = audioRef.current;
      if (audio && !seekingRef.current) {
        setSeek(audio.currentTime);
        if (audio.buffered.length > 0 && audio.duration) {
          setBuffered(Math.round(
            (audio.buffered.end(audio.buffered.length - 1) / audio.duration) * 100
          ));
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [stopRaf]);

  const loadChapter = useCallback((index, autoplay = false, restoreSeek = true) => {
    stopRaf();

    const prev = audioRef.current;
    if (prev) { prev.pause(); prev.src = ''; }

    setSeek(0);
    setDuration(0);
    setBuffered(0);
    setIsLoading(autoplay);

    const ch = chapters[index];
    const audio = new Audio();
    audioRef.current = audio;

    const stale = () => audioRef.current !== audio;

    audio.addEventListener('loadedmetadata', () => {
      if (stale()) return;
      const d = audio.duration;
      setDuration(d);
      recordDuration(ch.id, d);
      if (restoreSeek) {
        const saved = seeksRef.current[ch.id] ?? 0;
        if (saved > 0 && saved < d - 5) { audio.currentTime = saved; setSeek(saved); }
      }
    });

    audio.addEventListener('playing', () => {
      if (stale()) return;
      setIsPlaying(true);
      setIsLoading(false);
      startRaf();
    });

    audio.addEventListener('pause', () => {
      if (stale()) return;
      setIsPlaying(false);
      stopRaf();
    });

    audio.addEventListener('waiting', () => {
      if (stale()) return;
      setIsLoading(true);
    });

    audio.addEventListener('ended', () => {
      if (stale()) return;
      stopRaf();
      setSeek(0);
      setIsPlaying(false);
      onCompleteRef.current?.(ch.id);
      if (index < chapters.length - 1) {
        const next = index + 1;
        setCurrentIndex(next);
        loadChapter(next, true, false);
      }
    });

    audio.addEventListener('error', () => {
      if (stale()) return;
      console.warn('Audio error:', audio.error?.code, audio.error?.message);
      setIsLoading(false);
      setIsPlaying(false);
    });

    audio.preload = 'none';
    audio.src = ch.audio;

    if (autoplay) {
      audio.play().catch(err => {
        if (stale()) return;
        console.warn('Play failed:', err);
        setIsPlaying(false);
        setIsLoading(false);
      });
    }
  }, [chapters, startRaf, stopRaf, recordDuration]);

  useEffect(() => {
    loadChapter(initialIndex);
    return () => {
      stopRaf();
      const audio = audioRef.current;
      if (audio) { audio.pause(); audio.src = ''; audioRef.current = null; }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || isLoading) return;
    if (!audio.paused) {
      audio.pause();
    } else {
      if (audio.readyState < 3) setIsLoading(true);
      audio.play().catch(err => {
        console.warn('Play failed:', err);
        setIsPlaying(false);
        setIsLoading(false);
      });
    }
  }, [isLoading]);

  const seekTo = useCallback((seconds) => {
    const audio = audioRef.current;
    if (!audio) return;
    seekingRef.current = true;
    audio.currentTime = seconds;
    setSeek(seconds);
    setTimeout(() => { seekingRef.current = false; }, 100);
  }, []);

  const goTo = useCallback((index) => {
    const playing = audioRef.current ? !audioRef.current.paused : false;
    setCurrentIndex(index);
    loadChapter(index, playing);
  }, [loadChapter]);

  const prev = useCallback(() => {
    if (seek > 3) { seekTo(0); }
    else if (currentIndex > 0) { goTo(currentIndex - 1); }
  }, [currentIndex, seek, goTo, seekTo]);

  const next = useCallback(() => {
    if (currentIndex < chapters.length - 1) { goTo(currentIndex + 1); }
  }, [currentIndex, chapters.length, goTo]);

  return { chapter, currentIndex, isPlaying, isLoading, seek, duration, buffered, durations, togglePlay, seekTo, prev, next, goTo };
}
