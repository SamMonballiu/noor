import { useEffect, useState, type FC } from "react";
import styles from "./MainPage.module.scss";
import { Spotlight } from "./components/Spotlight/Spotlight";
import { AlbumsList } from "./components/AlbumsList/AlbumsList";
import { Redirect, Route, Switch } from "wouter";
import { routes, isValidArtistRoute } from "./routing";
import { AlbumTrackList } from "./components/AlbumTrackList/AlbumTrackList";
//@ts-ignore
import friendlyUrl from "friendly-url-extended";
import { MdMusicNote, MdPerson } from "react-icons/md";
import cx from "classnames";
import type { AlbumDataWithTracks, Metadata } from "./models";
import { useRouting } from "./hooks/useRouting";
import { NowPlaying } from "./components/NowPlaying/NowPlaying";
import { PlayerControls } from "./components/PlayerControls/PlayerControls";
import { Volume } from "./components/Volume/Volume";
import { Queue } from "./components/Queue/Queue";
import { useTrackQueueContext } from "./contexts/TrackQueueContext";
import { FaList } from "react-icons/fa";
import { useTrackContextMenu } from "./hooks/useTrackContextMenu";
import { Input } from "./components/Input/Input";
import { TrackProgressBar } from "./components/TrackProgressBar/TrackProgressBar";

type Mode = "content" | "spotlight";

export const MainPage: FC = () => {
  const [showQueue, setShowQueue] = useState(false);
  const [mode, setMode] = useState<Mode>("content");
  const {
    activeItem,
    items,
    setActiveItem,
    setItems,
    go,
    addItems,
    audioPlayer,
    setVolume,
    isPlaying,
  } = useTrackQueueContext();
  const [searchTerm, setSearchTerm] = useState("");

  const { play, togglePlayPause, seek } = audioPlayer;

  const trackContextMenu = useTrackContextMenu();

  const handlePlay = (track: Metadata, tracks: Metadata[]) => {
    setActiveItem(track);
    setItems(tracks);
    play(track);
  };

  useEffect(() => {
    if (activeItem) {
      handlePlay(activeItem, items);
    }
  }, [activeItem]);

  const handleToggleQueue = () => setShowQueue(!showQueue);

  const { route, navigate } = useRouting();

  function handleQueueSearchResults(albums: AlbumDataWithTracks[]): void {
    const tracks = albums.flatMap((x) => x.tracks);
    addItems(tracks);
  }

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
              <section className={styles.input}>
                <Input value={searchTerm} onChange={setSearchTerm} />
              </section>
              <AlbumsList
                onSelect={navigate.toAlbum}
                searchTerm={searchTerm}
                onQueueSearchResults={handleQueueSearchResults}
              />
            </Route>
            <Route path="/">
              <Redirect to="/albums" />
            </Route>
          </Switch>
          <Switch>
            {isValidArtistRoute(route.path) ? (
              <Route path={routes.artist}>
                {route.params.album ? (
                  <AlbumTrackList
                    onPlay={handlePlay}
                    trackContextMenu={trackContextMenu}
                  />
                ) : (
                  <AlbumsList onSelect={navigate.toAlbum} />
                )}
              </Route>
            ) : null}
          </Switch>
        </section>

        {mode === "spotlight" && activeItem ? (
          <Spotlight
            track={activeItem!}
            onClose={() => setMode("content")}
            onAlbumClick={() => {
              setMode("content");
              navigate.to(routes.allAlbums, {
                album: friendlyUrl(activeItem.album),
              });
            }}
            onArtistClick={(artist) => {
              setMode("content");
              navigate.toArtist(artist);
            }}
          />
        ) : null}

        <section className={styles.queueButton}>
          <div
            style={{ opacity: showQueue ? 1 : 0.25, cursor: "pointer" }}
            onClick={handleToggleQueue}
          >
            <FaList />
          </div>
        </section>

        {showQueue && (
          <section className={styles.queue}>
            <Queue onDoubleClickTrack={handlePlay} />
          </section>
        )}
      </section>

      <section className={styles.bottom}>
        <TrackProgressBar onSeek={seek} />

        <section className={styles.controls}>
          <NowPlaying onClick={() => setMode("spotlight")} />

          <PlayerControls
            isPlaying={isPlaying}
            onPlayPause={togglePlayPause}
            onPrevious={go.previous}
            onNext={go.next}
          />

          <Volume onVolumeChanged={setVolume} />
        </section>
      </section>
    </div>
  );
};
