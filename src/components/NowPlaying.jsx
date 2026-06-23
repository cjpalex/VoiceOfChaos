import { ChapterCircle } from './ChapterCircle';
import { PlayerControls } from './PlayerControls';
import { ProgressBar } from './ProgressBar';
import styles from './NowPlaying.module.css';

export function NowPlaying({
  chapter,
  groupBg,
  localChapterNumber,
  chapterProgress,
  isPlaying,
  isLoading,
  seek,
  duration,
  buffered,
  hasPrev,
  hasNext,
  onToggle,
  onPrev,
  onNext,
  onSeek,
  onOpenList,
  onCircleClick,
}) {
  return (
    <div className={styles.container}>
      <div className={styles.bg} />
      <div
        className={styles.bgBleed}
        style={groupBg ? {
          backgroundImage: `url(${groupBg})`,
          opacity: 1,
          filter: 'none',
        } : undefined}
      />

      <header className={styles.header}>
        <div className={styles.imperialEye}>
          <span>☩</span>
        </div>
        <h1 className={styles.appTitle}>Voice of Chaos</h1>
        <button className={styles.listBtn} onClick={onOpenList} aria-label="Chapter list">
          <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
          </svg>
        </button>
      </header>

      <main className={styles.main}>
        <ChapterCircle
          chapterNumber={localChapterNumber ?? 1}
          progress={chapterProgress}
          isPlaying={isPlaying}
          onClick={onCircleClick}
        />

        <div className={styles.meta}>
          {chapter?.era && <p className={styles.era}>{chapter.era}</p>}
          <h2 className={styles.title}>{chapter?.title ?? 'Loading...'}</h2>
          {isLoading
            ? <p className={styles.buffering}>Buffering…</p>
            : chapter?.description && <p className={styles.description}>{chapter.description}</p>
          }
        </div>
      </main>

      <footer className={styles.footer}>
        <ProgressBar seek={seek} duration={duration} buffered={buffered} onSeek={onSeek} />
        <PlayerControls
          isPlaying={isPlaying}
          isLoading={isLoading}
          onToggle={onToggle}
          onPrev={onPrev}
          onNext={onNext}
          hasPrev={hasPrev}
          hasNext={hasNext}
        />
      </footer>

      {/* Corner ornaments */}
      <div className="corner-ornament tl" />
      <div className="corner-ornament tr" />
      <div className="corner-ornament bl" />
      <div className="corner-ornament br" />
    </div>
  );
}
