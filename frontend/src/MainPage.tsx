import { useState, type FC } from "react";
import styles from "./MainPage.module.scss";
import { Controls } from "./components/Controls/Controls";
import { Spotlight } from "./components/Spotlight/Spotlight";
import { useTrack } from "./contexts/TrackContext";
import { AlbumsList } from "./components/AlbumsList/AlbumsList";
import { Route, Switch } from "wouter";
import { routes } from "./routing";
import { useRoutes } from "./hooks/useRoutes";
import { AlbumTrackList } from "./components/AlbumTrackList/AlbumTrackList";
import { useNavigation } from "./hooks/useNavigation";
//@ts-ignore
import friendlyUrl from "friendly-url-extended";

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

  const { route } = useRoutes();
  const { navigate } = useNavigation();

  return (
    <div className={styles.container}>
      <section className={styles.main}>
        <section className={styles.items}>
          <Switch>
            <Route path={routes.albums}>
              {route.params.album ? (
                <AlbumTrackList />
              ) : (
                <AlbumsList
                  onSelect={(albumName) =>
                    navigate.to(routes.albums, {
                      album: friendlyUrl(albumName),
                    })
                  }
                />
              )}
            </Route>
          </Switch>
        </section>
        {/* <Spotlight
          imageUrl={imageUrl}
          trackName={trackName}
          albumName={albumName}
          artistName={artistName}
        /> */}
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
