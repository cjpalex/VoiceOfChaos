import { useState, useEffect, useRef, useCallback } from 'react';
import { Howl } from 'howler';

export function useAudioPlayer(chapters, onChapterComplete, initialIndex = 0, seeks = {}) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isPlaying, setIsPlaying] = useState(false);
  const [seek, setSeek] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [buffered, setBuffered] = useState(0);
  const [durations, setDurations] = useState({});

  const howlRef = useRef(null);
  const rafRef = useRef(null);
  const seekingRef = useRef(false);
  const playRequestRef = useRef(false);
  const lastSeekRef = useRef(0);
  const bufferCleanupRef = useRef(null);
  const onCompleteRef = useRef(onChapterComplete);
  const seeksRef = useRef(seeks);
  useEffect(() => { onCompleteRef.current = onChapterComplete; }, [onChapterComplete]);
  useEffect(() => { seeksRef.current = seeks; }, [seeks]);

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
        if (typeof s === 'number') { setSeek(s); lastSeekRef.current = s; }
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [stopRaf]);

  const loadChapter = useCallback(
    (index, autoplay = false, restoreSeek = true) => {
      stopRaf();
      if (bufferCleanupRef.current) {
        bufferCleanupRef.current();
        bufferCleanupRef.current = null;
      }
      if (howlRef.current) {
        howlRef.current.unload();
        howlRef.current = null;
      }
      setSeek(0);
      setDuration(0);
      setBuffered(0);
      setIsLoading(true);
      playRequestRef.current = false;
      lastSeekRef.current = 0;

      const ch = chapters[index];
      const howl = new Howl({
        src: [ch.audio],
        html5: true,
        onload() {
          const d = howl.duration();
          setDuration(d);
          recordDuration(ch.id, d);
          setIsLoading(false);

          // Track buffer progress via the underlying HTML5 audio node
          const node = howl._sounds?.[0]?._node;
          if (node) {
            const readBuffered = () => {
              if (node.buffered?.length > 0 && node.duration) {
                const pct = Math.round((node.buffered.end(node.buffered.length - 1) / node.duration) * 100);
                setBuffered(pct);
              }
            };
            readBuffered();
            node.addEventListener('progress', readBuffered);
            bufferCleanupRef.current = () => node.removeEventListener('progress', readBuffered);
          }

          // Restore saved timestamp (not on auto-advance, not if within 5s of end)
          const savedSeek = restoreSeek ? (seeksRef.current[ch.id] ?? 0) : 0;
          if (savedSeek > 0 && savedSeek < d - 5) {
            howl.seek(savedSeek);
            setSeek(savedSeek);
            lastSeekRef.current = savedSeek;
          }

          if (autoplay) {
            howl.play();
          }
        },
        onplay() {
          playRequestRef.current = false;
          setIsPlaying(true);
          // iOS can silently reset the audio position while paused (screen lock,
          // backgrounding). Detect a >2 s drift from our last known position and
          // seek back so playback resumes from where the user left off.
          const currentPos = howl.seek();
          if (typeof currentPos === 'number' && lastSeekRef.current > 5 && Math.abs(currentPos - lastSeekRef.current) > 2) {
            howl.seek(lastSeekRef.current);
            setSeek(lastSeekRef.current);
          }
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
            loadChapter(next, true, false); // auto-advance: don't restore seek
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
    const howl = howlRef.current;
    if (!howl || isLoading) return;
    if (howl.playing()) {
      playRequestRef.current = false;
      howl.pause();
    } else if (!playRequestRef.current) {
      playRequestRef.current = true;
      howl.play();
    }
  }, [isLoading]);

  const seekTo = useCallback((seconds) => {
    if (!howlRef.current) return;
    seekingRef.current = true;
    howlRef.current.seek(seconds);
    setSeek(seconds);
    lastSeekRef.current = seconds;
    setTimeout(() => { seekingRef.current = false; }, 100);
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
    buffered,
    durations,
    togglePlay,
    seekTo,
    prev,
    next,
    goTo,
  };
}
