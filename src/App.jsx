import { useState } from 'react';
import { chapters } from './data/chapters';
import { useAudioPlayer } from './hooks/useAudioPlayer';
import { NowPlaying } from './components/NowPlaying';
import { ChapterList } from './components/ChapterList';

export default function App() {
  const [showList, setShowList] = useState(false);

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
  } = useAudioPlayer(chapters);

  const handleSelectChapter = (index) => {
    goTo(index);
    setShowList(false);
  };

  return (
    <>
      <NowPlaying
        chapter={chapter}
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
          onSelect={handleSelectChapter}
          onClose={() => setShowList(false)}
        />
      )}
    </>
  );
}
