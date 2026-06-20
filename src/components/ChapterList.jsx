import { useEffect, useMemo, useRef, useState } from 'react';
import { getGroupKey, GROUP_ARTWORK } from '../data/chapters';
import { ChapterCircle } from './ChapterCircle';
import styles from './ChapterList.module.css';

function fmt(s) {
  if (!s || isNaN(s)) return '--:--';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

// For the top-level list: [{ section, groups: [{ key, name, chapters[] }] }]
function buildSections(chapters) {
  const sectionMap = new Map();
  for (const ch of chapters) {
    const sec = ch.section;
    const key = getGroupKey(ch);
    if (!sectionMap.has(sec)) sectionMap.set(sec, new Map());
    const gMap = sectionMap.get(sec);
    if (!gMap.has(key)) gMap.set(key, []);
    gMap.get(key).push(ch);
  }
  return Array.from(sectionMap.entries()).map(([section, gMap]) => ({
    section,
    groups: Array.from(gMap.entries()).map(([key, chs]) => ({ key, chapters: chs })),
  }));
}

// For Imperium drill-down: sub-group by era
function byEra(chapters) {
  const map = new Map();
  for (const ch of chapters) {
    if (!map.has(ch.era)) map.set(ch.era, []);
    map.get(ch.era).push(ch);
  }
  return Array.from(map.entries()).map(([era, chs]) => ({ era, chapters: chs }));
}

function completionOf(chs, progress) {
  const done = chs.filter(ch => (progress[ch.id] ?? 0) >= 100).length;
  return { done, total: chs.length, pct: chs.length ? Math.round((done / chs.length) * 100) : 0 };
}

const CLOSE_ICON = (
  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
  </svg>
);

const BACK_ICON = (
  <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
    <path d="M19 11H7.83l4.88-4.88c.39-.39.39-1.03 0-1.42-.39-.39-1.02-.39-1.41 0l-6.59 6.59c-.39.39-.39 1.02 0 1.41l6.59 6.59c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L7.83 13H19c.55 0 1-.45 1-1s-.45-1-1-1z"/>
  </svg>
);

const CHEVRON = (
  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
  </svg>
);

// ─── Episode list (used in drill-down view) ───────────────────────────────────

function EpisodeList({ groupChapters, chapters, currentIndex, isPlaying, durations, progress, onSelect }) {
  const showEraHeaders = groupChapters[0]?.section === 'The Imperium';
  const groups = showEraHeaders
    ? byEra(groupChapters)
    : [{ era: null, chapters: groupChapters }];

  return (
    <>
      {groups.map(({ era, chapters: eraChs }) => (
        <section key={era ?? 'all'}>
          {era && (
            <div className={styles.eraHeader}>
              <span className={styles.eraLine} />
              <span className={styles.eraLabel}>{era}</span>
              <span className={styles.eraLine} />
            </div>
          )}
          {eraChs.map((ch) => {
            const globalIndex = chapters.indexOf(ch);
            const localNum = groupChapters.indexOf(ch) + 1;
            const isActive = globalIndex === currentIndex;
            return (
              <button
                key={ch.id}
                className={`${styles.item} ${isActive ? styles.active : ''}`}
                onClick={() => onSelect(globalIndex)}
              >
                <div className={styles.thumbWrapper}>
                  <ChapterCircle
                    chapterNumber={localNum}
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
    </>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function ChapterList({ visible = true, chapters, currentIndex, isPlaying, durations = {}, progress = {}, onSelect, onClose }) {
  const [activeGroup, setActiveGroup] = useState(null);
  const [lastVisitedGroup, setLastVisitedGroup] = useState(null);
  const sections = useMemo(() => buildSections(chapters), [chapters]);
  const currentGroupKey = chapters[currentIndex] ? getGroupKey(chapters[currentIndex]) : null;
  const topListRef = useRef(null);
  const savedScrollTop = useRef(0);

  useEffect(() => {
    if (activeGroup === null && topListRef.current) {
      topListRef.current.scrollTop = savedScrollTop.current;
    }
  }, [activeGroup]);

  const handleSelect = (index) => {
    onSelect(index);
  };

  // ── Drill-down view ─────────────────────────────────────────────────────────
  if (activeGroup !== null) {
    const groupChapters = chapters.filter(ch => getGroupKey(ch) === activeGroup);

    return (
      <div className={styles.overlay} style={!visible ? { display: 'none' } : undefined}>
        <div className={styles.panel}>
          <header className={styles.header}>
            <button className={styles.closeBtn} onClick={() => { setLastVisitedGroup(activeGroup); setActiveGroup(null); }} aria-label="Back to list">
              {BACK_ICON}
            </button>
            <h2 className={styles.groupHeading}>{activeGroup}</h2>
            <button className={styles.closeBtnX} onClick={onClose} aria-label="Close">
              {CLOSE_ICON}
            </button>
          </header>

          <div className={styles.divider} />

          <div className={styles.list}>
            <EpisodeList
              groupChapters={groupChapters}
              chapters={chapters}
              currentIndex={currentIndex}
              isPlaying={isPlaying}
              durations={durations}
              progress={progress}
              onSelect={handleSelect}
            />
          </div>

          <div className={styles.footer}>
            <span>{groupChapters.length} episode{groupChapters.length !== 1 ? 's' : ''}</span>
          </div>

          <div className="corner-ornament tl" />
          <div className="corner-ornament tr" />
          <div className="corner-ornament bl" />
          <div className="corner-ornament br" />
        </div>
      </div>
    );
  }

  // ── Top-level group list ────────────────────────────────────────────────────
  return (
    <div className={styles.overlay} style={!visible ? { display: 'none' } : undefined}>
      <div className={styles.panel}>
        <header className={styles.header}>
          <h2 className={styles.heading}>
            <span className={styles.headingOrnament}>✦</span>
            Chapters
            <span className={styles.headingOrnament}>✦</span>
          </h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close chapter list">
            {BACK_ICON}
          </button>
        </header>

        <div className={styles.divider} />

        <div className={styles.list} ref={topListRef}>
          {sections.map(({ section, groups }) => (
            <div key={section}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionLine} />
                <span className={styles.sectionLabel}>{section}</span>
                <span className={styles.sectionLine} />
              </div>

              {groups.map(({ key, chapters: gChs }) => {
                const { done, total, pct } = completionOf(gChs, progress);
                const isCurrentGroup = key === currentGroupKey;
                return (
                  <button
                    key={key}
                    className={`${styles.groupItem} ${isCurrentGroup ? styles.groupActive : ''} ${key === lastVisitedGroup ? styles.groupLastVisited : ''} ${GROUP_ARTWORK[key] ? styles.groupHasArtwork : ''}`}
                    style={GROUP_ARTWORK[key] ? {
                      backgroundImage: `url(${GROUP_ARTWORK[key]})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    } : undefined}
                    onClick={() => {
                      savedScrollTop.current = topListRef.current?.scrollTop ?? 0;
                      setActiveGroup(key);
                    }}
                  >
                    <div className={styles.groupRow}>
                      <span className={styles.groupName}>{key}</span>
                      <div className={styles.groupRight}>
                        {isCurrentGroup && (
                          <div className={styles.groupPlayingDots}>
                            <span /><span /><span />
                          </div>
                        )}
                        <span className={styles.groupCount}>{total} ep.</span>
                        <span className={styles.groupChevron}>{CHEVRON}</span>
                      </div>
                    </div>
                    {done > 0 && (
                      <span className={styles.groupDoneLabel}>{done}/{total} listened</span>
                    )}
                    <div className={styles.groupProgressBar}>
                      <div className={styles.groupProgressFill} style={{ width: `${pct}%` }} />
                    </div>
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        <div className={styles.footer}>
          <span>{chapters.length} total episodes</span>
        </div>

        <div className="corner-ornament tl" />
        <div className="corner-ornament tr" />
        <div className="corner-ornament bl" />
        <div className="corner-ornament br" />
      </div>
    </div>
  );
}
