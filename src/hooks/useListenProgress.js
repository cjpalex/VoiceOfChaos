import { useState, useCallback } from 'react';

const PROGRESS_KEY = 'voc_progress';
const SEEKS_KEY    = 'voc_seeks';

function load(key) {
  try { return JSON.parse(localStorage.getItem(key) || '{}'); }
  catch { return {}; }
}

function persist(key, obj) {
  try { localStorage.setItem(key, JSON.stringify(obj)); } catch {}
}

export function useListenProgress() {
  const [progress, setProgress] = useState(() => load(PROGRESS_KEY));
  const [seeks,    setSeeks]    = useState(() => load(SEEKS_KEY));

  const saveProgress = useCallback((id, percent) => {
    setProgress(prev => {
      const clamped = Math.min(99, Math.max(0, percent));
      if (clamped <= (prev[id] ?? 0)) return prev;
      const next = { ...prev, [id]: clamped };
      persist(PROGRESS_KEY, next);
      return next;
    });
  }, []);

  const saveSeek = useCallback((id, seconds) => {
    setSeeks(prev => {
      const next = { ...prev, [id]: seconds };
      persist(SEEKS_KEY, next);
      return next;
    });
  }, []);

  const clearSeek = useCallback((id) => {
    setSeeks(prev => {
      if (!(id in prev)) return prev;
      const next = { ...prev };
      delete next[id];
      persist(SEEKS_KEY, next);
      return next;
    });
  }, []);

  const markComplete = useCallback((id) => {
    setProgress(prev => {
      const next = { ...prev, [id]: 100 };
      persist(PROGRESS_KEY, next);
      return next;
    });
    clearSeek(id);
  }, [clearSeek]);

  const resetProgress = useCallback((id) => {
    setProgress(prev => {
      const next = { ...prev, [id]: 0 };
      persist(PROGRESS_KEY, next);
      return next;
    });
    clearSeek(id);
  }, [clearSeek]);

  return { progress, seeks, saveProgress, saveSeek, clearSeek, markComplete, resetProgress };
}
