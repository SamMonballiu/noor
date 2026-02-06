import { useState, type FC } from "react";
import styles from "./MainPage.module.scss";
import { Controls } from "./components/Controls/Controls";
import { Spotlight } from "./components/Spotlight/Spotlight";
import { useTrack } from "./contexts/TrackContext";
import { AlbumsList } from "./components/AlbumsList/AlbumsList";
import { Redirect, Route, Switch } from "wouter";
import { routes } from "./routing";
import { useRoutes } from "./hooks/useRoutes";
import { AlbumTrackList } from "./components/AlbumTrackList/AlbumTrackList";
import { useNavigation } from "./hooks/useNavigation";
import { useAudioPlayer } from "./hooks/useAudioPlayer";
//@ts-ignore
import friendlyUrl from "friendly-url-extended";
import { MdMusicNote, MdPerson } from "react-icons/md";
import cx from "classnames";

export const MainPage: FC = () => {
  const { track, setTrackData } = useTrack();
  const [showQueue, setShowQueue] = useState(false);

  const { play, togglePlayPause, seek, isPlaying, progress } = useAudioPlayer();

  const handlePlay = (track: Parameters<typeof setTrackData>[0]) => {
    setTrackData(track);
    play(track);
  };

  const handleToggleQueue = () => setShowQueue(!showQueue);

  const { route } = useRoutes();
  const { navigate } = useNavigation();

  return (
    <div className={styles.container}>
      <section className={styles.top}>
        <div className={cx({ [styles.active]: route.is.album })}>
          <MdMusicNote
            onClick={() => navigate.to(routes.albums, { album: "" })}
          />
        </div>
        <div>
          <MdPerson style={{ opacity: 0.25 }} />
        </div>
      </section>
      <section className={styles.main}>
        <section className={styles.items}>
          <Switch>
            <Route path={routes.albums}>
              {route.params.album ? (
                <AlbumTrackList onPlay={handlePlay} />
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
            <Route path="/">
              <Redirect to="/albums" />
            </Route>
          </Switch>
        </section>

        {/* TODO */}
        {false && track ? <Spotlight track={track!} /> : null}

        {showQueue && <section className={styles.queue}>queue</section>}
      </section>

      <Controls
        isPlaying={isPlaying}
        progress={progress}
        onPlayPause={togglePlayPause}
        onPrevious={() => console.log("Previous")}
        onNext={() => console.log("Next")}
        onSeek={seek}
        onToggleQueue={handleToggleQueue}
      />
    </div>
  );
};
