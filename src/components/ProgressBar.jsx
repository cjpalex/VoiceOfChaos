import { useRef, useCallback } from 'react';
import styles from './ProgressBar.module.css';

function fmt(s) {
  if (!s || isNaN(s)) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

export function ProgressBar({ seek, duration, onSeek }) {
  const barRef = useRef(null);

  const getPosition = useCallback(
    (clientX) => {
      const rect = barRef.current.getBoundingClientRect();
      const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      return pct * (duration || 0);
    },
    [duration]
  );

  const handleClick = useCallback(
    (e) => {
      if (!duration) return;
      onSeek(getPosition(e.clientX));
    },
    [duration, getPosition, onSeek]
  );

  const handleTouchStart = useCallback(
    (e) => {
      if (!duration) return;
      onSeek(getPosition(e.touches[0].clientX));
    },
    [duration, getPosition, onSeek]
  );

  const pct = duration ? (seek / duration) * 100 : 0;

  return (
    <div className={styles.wrapper}>
      <span className={styles.time}>{fmt(seek)}</span>
      <div
        className={styles.track}
        ref={barRef}
        onClick={handleClick}
        onTouchStart={handleTouchStart}
        role="slider"
        aria-label="Seek"
        aria-valuemin={0}
        aria-valuemax={duration || 0}
        aria-valuenow={seek}
        tabIndex={0}
      >
        <div className={styles.fill} style={{ width: `${pct}%` }} />
        <div className={styles.thumb} style={{ left: `${pct}%` }} />
      </div>
      <span className={styles.time}>{fmt(duration)}</span>
    </div>
  );
}
