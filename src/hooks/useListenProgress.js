import { useState, useCallback } from 'react';

const KEY = 'voc_progress';

function load() {
  try { return JSON.parse(localStorage.getItem(KEY) || '{}'); }
  catch { return {}; }
}

export function useListenProgress() {
  const [progress, setProgress] = useState(load);

  const saveProgress = useCallback((id, percent) => {
    setProgress(prev => {
      const clamped = Math.min(99, Math.max(0, percent)); // 99 max — only markComplete sets 100
      if (clamped <= (prev[id] ?? 0)) return prev;
      const next = { ...prev, [id]: clamped };
      try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const markComplete = useCallback((id) => {
    setProgress(prev => {
      const next = { ...prev, [id]: 100 };
      try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  return { progress, saveProgress, markComplete };
}
