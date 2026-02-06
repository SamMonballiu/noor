import { useState, type FC } from "react";
import styles from "./MainPage.module.scss";
import { Controls } from "./components/Controls/Controls";
import { Spotlight } from "./components/Spotlight/Spotlight";
import { useTrack } from "./contexts/TrackContext";
import { AlbumsList } from "./components/AlbumsList/AlbumsList";

export const MainPage: FC = () => {
  const { trackName, artistName, albumName, imageUrl } = useTrack();
  const [progress, setProgress] = useState(0.505);
  const [showQueue, setShowQueue] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);

  const handlePlayPause = () => setIsPlaying(!isPlaying);
  const handlePrevious = () => console.log("Previous");
  const handleNext = () => console.log("Next");
  const handleSeek = (position: number) => setProgress(position);
  const handleToggleQueue = () => setShowQueue(!showQueue);

  return (
    <div className={styles.container}>
      <section className={styles.main}>
        <section className={styles.items}>
          <AlbumsList />
        </section>
        <Spotlight
          imageUrl={imageUrl}
          trackName={trackName}
          albumName={albumName}
          artistName={artistName}
        />
        {showQueue && <section className={styles.queue}>queue</section>}
      </section>

      <Controls
        isPlaying={isPlaying}
        progress={progress}
        onPlayPause={handlePlayPause}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onSeek={handleSeek}
        onToggleQueue={handleToggleQueue}
      />
    </div>
  );
};
