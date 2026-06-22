import { useRef, useCallback } from 'react';
import styles from './ProgressBar.module.css';

function fmt(s) {
  if (!s || isNaN(s)) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

export function ProgressBar({ seek, duration, buffered = 0, onSeek }) {
  const barRef = useRef(null);
  const draggingRef = useRef(false);

  const getPosition = useCallback(
    (clientX) => {
      const rect = barRef.current.getBoundingClientRect();
      const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      return pct * (duration || 0);
    },
    [duration]
  );

  const handlePointerDown = useCallback(
    (e) => {
      if (!duration) return;
      e.preventDefault();
      draggingRef.current = true;
      barRef.current.setPointerCapture(e.pointerId);
      onSeek(getPosition(e.clientX));
    },
    [duration, getPosition, onSeek]
  );

  const handlePointerMove = useCallback(
    (e) => {
      if (!draggingRef.current || !duration) return;
      e.preventDefault();
      onSeek(getPosition(e.clientX));
    },
    [duration, getPosition, onSeek]
  );

  const handlePointerUp = useCallback(() => {
    draggingRef.current = false;
  }, []);

  const pct = duration ? Math.min(100, Math.max(0, (seek / duration) * 100)) : 0;

  return (
    <div className={styles.wrapper}>
      <span className={styles.time}>{fmt(seek)}</span>
      <div
        className={styles.track}
        ref={barRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        role="slider"
        aria-label="Seek"
        aria-valuemin={0}
        aria-valuemax={duration || 0}
        aria-valuenow={seek}
        tabIndex={0}
      >
        <div className={styles.buffer} style={{ width: `${buffered}%` }} />
        <div className={styles.fill} style={{ width: `${pct}%` }} />
        <div className={styles.thumb} style={{ left: `${pct}%` }} />
      </div>
      <span className={styles.time}>{fmt(duration)}</span>
    </div>
  );
}
