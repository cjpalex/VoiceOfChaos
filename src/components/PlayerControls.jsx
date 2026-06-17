import styles from './PlayerControls.module.css';

function PrevIcon() {
  return <img src="/prev_next.png" width="20" height="20" alt="" />;
}

function NextIcon() {
  return <img src="/prev_next.png" width="20" height="20" alt="" style={{ transform: 'scaleX(-1)' }} />;
}

function PlayIcon() {
  return <img src="/play.png" width="30" height="30" alt="" style={{ position: 'relative', left: 4, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.6))' }} />;
}

function PauseIcon() {
  return <img src="/pause.png" width="30" height="30" alt="" />;
}

function LoadingSpinner() {
  return (
    <svg viewBox="0 0 24 24" fill="none" width="40" height="40" className={styles.spinner}>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeDasharray="31.4" strokeDashoffset="10" strokeLinecap="round" />
    </svg>
  );
}

export function PlayerControls({ isPlaying, isLoading, onToggle, onPrev, onNext, hasPrev, hasNext }) {
  return (
    <div className={styles.controls}>
      <button
        className={styles.skip}
        onClick={onPrev}
        disabled={!hasPrev}
        aria-label="Previous chapter"
      >
        <PrevIcon />
      </button>

      <button
        className={styles.playPause}
        onClick={onToggle}
        disabled={isLoading}
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        {isLoading ? <LoadingSpinner /> : isPlaying ? <PauseIcon /> : <PlayIcon />}
      </button>

      <button
        className={styles.skip}
        onClick={onNext}
        disabled={!hasNext}
        aria-label="Next chapter"
      >
        <NextIcon />
      </button>
    </div>
  );
}
