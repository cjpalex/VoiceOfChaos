import { useState, useCallback } from 'react';

const PROGRESS_KEY = 'voc_progress';

function loadProgress() {
  try { return JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}'); }
  catch { return {}; }
}

export function useListenProgress() {
  const [progress, setProgress] = useState(loadProgress);

  const saveProgress = useCallback((id, percent) => {
    setProgress(prev => {
      const clamped = Math.min(99, Math.max(0, percent));
      if (clamped <= (prev[id] ?? 0)) return prev;
      const next = { ...prev, [id]: clamped };
      try { localStorage.setItem(PROGRESS_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const markComplete = useCallback((id) => {
    setProgress(prev => {
      const next = { ...prev, [id]: 100 };
      try { localStorage.setItem(PROGRESS_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const resetProgress = useCallback((id) => {
    setProgress(prev => {
      const next = { ...prev, [id]: 0 };
      try { localStorage.setItem(PROGRESS_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  return { progress, saveProgress, markComplete, resetProgress };
}
