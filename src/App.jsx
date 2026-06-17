import { useState, useEffect, useRef } from 'react';
import { chapters } from './data/chapters';
import { useAudioPlayer } from './hooks/useAudioPlayer';
import { useListenProgress } from './hooks/useListenProgress';
import { NowPlaying } from './components/NowPlaying';
import { ChapterList } from './components/ChapterList';

export default function App() {
  const [showList, setShowList] = useState(false);
  const { progress, saveProgress, markComplete } = useListenProgress();

  const {
    chapter,
    currentIndex,
    isPlaying,
    isLoading,
    seek,
    duration,
    durations,
    togglePlay,
    seekTo,
    prev,
    next,
    goTo,
  } = useAudioPlayer(chapters, markComplete);

  // Refs so the save-on-pause effect doesn't re-fire on every seek tick
  const seekRef = useRef(seek);
  const durationRef = useRef(duration);
  const chapterRef = useRef(chapter);
  useEffect(() => { seekRef.current = seek; }, [seek]);
  useEffect(() => { durationRef.current = duration; }, [duration]);
  useEffect(() => { chapterRef.current = chapter; }, [chapter]);

  // Save progress when playback pauses
  useEffect(() => {
    if (!isPlaying) {
      const s = seekRef.current;
      const d = durationRef.current;
      const ch = chapterRef.current;
      if (ch && d > 0 && s > 5) saveProgress(ch.id, (s / d) * 100);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying]);

  // Live fill for the current chapter; fall back to stored value when not loaded yet
  const liveProgress = duration > 0 ? (seek / duration) * 100 : (progress[chapter?.id] ?? 0);
  const allProgress = { ...progress, [chapter?.id]: Math.max(progress[chapter?.id] ?? 0, liveProgress) };

  const handleSelectChapter = (index) => {
    goTo(index);
    setShowList(false);
  };

  return (
    <>
      <NowPlaying
        chapter={chapter}
        chapterProgress={allProgress[chapter?.id] ?? 0}
        isPlaying={isPlaying}
        isLoading={isLoading}
        seek={seek}
        duration={duration}
        hasPrev={currentIndex > 0 || seek > 3}
        hasNext={currentIndex < chapters.length - 1}
        onToggle={togglePlay}
        onPrev={prev}
        onNext={next}
        onSeek={seekTo}
        onOpenList={() => setShowList(true)}
      />

      {showList && (
        <ChapterList
          chapters={chapters}
          currentIndex={currentIndex}
          isPlaying={isPlaying}
          durations={durations}
          progress={allProgress}
          onSelect={handleSelectChapter}
          onClose={() => setShowList(false)}
        />
      )}
    </>
  );
}
