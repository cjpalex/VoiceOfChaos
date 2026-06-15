import styles from './PlayerControls.module.css';

function PrevIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
      <path d="M6 6h2v12H6zm3.5 6 8.5 6V6z" />
    </svg>
  );
}

function NextIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
      <path d="M6 18l8.5-6L6 6v12zm2.5-6 5.5 3.9V8.1L8.5 12zm7 6h2V6h-2v12z" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="40" height="40">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="40" height="40">
      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
    </svg>
  );
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
