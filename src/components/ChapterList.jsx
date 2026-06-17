import { useMemo } from 'react';
import { ChapterCircle } from './ChapterCircle';
import styles from './ChapterList.module.css';

function fmt(s) {
  if (!s || isNaN(s)) return '--:--';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

// Returns array of { era, chapters[] } in insertion order
function groupByEra(chapters) {
  const map = new Map();
  for (const ch of chapters) {
    if (!map.has(ch.era)) map.set(ch.era, []);
    map.get(ch.era).push(ch);
  }
  return Array.from(map.entries()).map(([era, chapters]) => ({ era, chapters }));
}

export function ChapterList({ chapters, currentIndex, isPlaying, durations = {}, progress = {}, onSelect, onClose }) {
  const groups = useMemo(() => groupByEra(chapters), [chapters]);

  return (
    <div className={styles.overlay}>
      <div className={styles.panel}>
        <header className={styles.header}>
          <h2 className={styles.heading}>
            <span className={styles.headingOrnament}>✦</span>
            Chapters
            <span className={styles.headingOrnament}>✦</span>
          </h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close chapter list">
            <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
              <path d="M19 11H7.83l4.88-4.88c.39-.39.39-1.03 0-1.42-.39-.39-1.02-.39-1.41 0l-6.59 6.59c-.39.39-.39 1.02 0 1.41l6.59 6.59c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L7.83 13H19c.55 0 1-.45 1-1s-.45-1-1-1z"/>
            </svg>
          </button>
        </header>

        <div className={styles.divider} />

        <div className={styles.list}>
          {groups.map(({ era, chapters: eraChapters }) => (
            <section key={era}>
              <div className={styles.eraHeader}>
                <span className={styles.eraLine} />
                <span className={styles.eraLabel}>{era}</span>
                <span className={styles.eraLine} />
              </div>

              {eraChapters.map((ch) => {
                const globalIndex = chapters.indexOf(ch);
                const isActive = globalIndex === currentIndex;
                return (
                  <button
                    key={ch.id}
                    className={`${styles.item} ${isActive ? styles.active : ''}`}
                    onClick={() => onSelect(globalIndex)}
                  >
                    <div className={styles.thumbWrapper}>
                      <ChapterCircle
                        chapterNumber={ch.id}
                        progress={progress[ch.id] ?? 0}
                        size="small"
                        isPlaying={isActive && isPlaying}
                      />
                      {isActive && isPlaying && (
                        <div className={styles.playingIndicator}>
                          <span /><span /><span />
                        </div>
                      )}
                    </div>

                    <div className={styles.info}>
                      <span className={styles.itemNumber}>
                        {isActive && !isPlaying ? '⏸ ' : ''}
                        {String(ch.id).padStart(2, '0')}
                      </span>
                      <span className={styles.itemTitle}>{ch.title}</span>
                      <span className={styles.itemDuration}>{fmt(durations[ch.id])}</span>
                    </div>
                  </button>
                );
              })}
            </section>
          ))}
        </div>

        <div className={styles.footer}>
          <span>{chapters.length} chapters</span>
        </div>

        <div className="corner-ornament tl" />
        <div className="corner-ornament tr" />
        <div className="corner-ornament bl" />
        <div className="corner-ornament br" />
      </div>
    </div>
  );
}
