import { useState, type FC } from "react";
import styles from "./MainPage.module.scss";
import { Controls } from "./components/Controls/Controls";
import { Spotlight } from "./components/Spotlight/Spotlight";
import { useTrack } from "./contexts/TrackContext";
import { AlbumsList } from "./components/AlbumsList/AlbumsList";
import { Redirect, Route, Switch } from "wouter";
import { routes } from "./routing";
import { AlbumTrackList } from "./components/AlbumTrackList/AlbumTrackList";
import { useAudioPlayer } from "./hooks/useAudioPlayer";
//@ts-ignore
import friendlyUrl from "friendly-url-extended";
import { MdMusicNote, MdPerson } from "react-icons/md";
import cx from "classnames";
import type { Metadata } from "./models";
import { useRouting } from "./hooks/useRouting";

type Mode = "content" | "spotlight";

export const MainPage: FC = () => {
  const { track, setTrackData } = useTrack();
  const [showQueue, setShowQueue] = useState(false);
  const [mode, setMode] = useState<Mode>("content");

  const { play, togglePlayPause, seek, isPlaying, progress, setVolume } =
    useAudioPlayer();

  const handlePlay = (track: Metadata, tracks: Metadata[]) => {
    setTrackData(track);
    setMode("spotlight");
    play(track, () => {
      const next = tracks[track.number!];
      if (next) {
        handlePlay(next, tracks);
      }
    });
  };

  const handleToggleQueue = () => setShowQueue(!showQueue);

  const { route, navigate } = useRouting();

  return (
    <div className={styles.container}>
      <section className={styles.top}>
        <div
          className={cx({ [styles.active]: route.is.allAlbums })}
          onClick={() => {
            setMode("content");
            navigate.to(routes.allAlbums);
          }}
        >
          <MdMusicNote />
        </div>
        <div>
          <MdPerson style={{ opacity: 0.25 }} />
        </div>
      </section>

      <section className={styles.main}>
        <section
          className={cx(styles.items, {
            [styles.hidden]: mode === "spotlight",
          })}
        >
          <Switch>
            <Route path={routes.allAlbums}>
              <AlbumsList
                onSelect={(mainArtist, albumName) =>
                  navigate.toAlbum(mainArtist, albumName)
                }
              />
            </Route>
            <Route path="/">
              <Redirect to="/albums" />
            </Route>
          </Switch>
          <Switch>
            <Route path={routes.artist}>
              {route.params.album ? (
                <AlbumTrackList onPlay={handlePlay} />
              ) : (
                <AlbumsList
                  onSelect={(mainArtist, albumName) =>
                    navigate.toAlbum(mainArtist, albumName)
                  }
                />
              )}
            </Route>
          </Switch>
        </section>

        {mode === "spotlight" && track ? (
          <Spotlight
            track={track!}
            onClose={() => setMode("content")}
            onAlbumClick={() => {
              setMode("content");
              navigate.to(routes.allAlbums, {
                album: friendlyUrl(track.album),
              });
            }}
            onArtistClick={(artist) => {
              setMode("content");
              navigate.toArtist(artist);
            }}
          />
        ) : null}

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
        onClickPlaying={() => setMode("spotlight")}
        onVolumeChanged={setVolume}
      />
    </div>
  );
};
