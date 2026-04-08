import React, { useMemo, useState, type FC } from "react";
//@ts-ignore
import friendlyUrl from "friendly-url-extended";
import { useAlbumsQuery } from "../../../query";
import type { AlbumDataWithTracks, Metadata } from "../../../models";
import styles from "./AlbumTrackList.module.scss";
import { Artists } from "../../common/Artists/Artists";
import { getArtistsMap } from "../../../models/util";
import { useRouting } from "../../../hooks/useRouting";
import { Track } from "../../common/Track/Track";
import {
  ContextMenu,
  type ContextHandler,
} from "../../common/ContextMenu/ContextMenu";
import { Album } from "../Album/Album";

interface Props {
  onPlay: (track: Metadata, tracks: Metadata[]) => void;
  trackContextMenu?: ContextHandler<Metadata>[];
}

export const AlbumTrackList: FC<Props> = ({ onPlay, trackContextMenu }) => {
  const { route, navigate } = useRouting();
  const { data, isLoading } = useAlbumsQuery();

  const [selectedTrackIndex, setSelectedTrackIndex] = useState<number | null>(
    null,
  );

  const album = useMemo<AlbumDataWithTracks>(() => {
    const empty = {
      title: "",
      artists: {},
      tracks: [],
      path: "",
    };
    if (isLoading || !data) {
      return empty;
    }

    for (const key of Object.keys(data)) {
      if (friendlyUrl(key) === route.params.album) {
        return {
          tracks: data[key],
          title: key,
          artists: getArtistsMap(data[key]),
          path: data[key][0].albumPath,
        };
      }
    }

    return empty;
  }, [isLoading, data]);

  return (
    <div className={styles.container}>
      <section className={styles.top}>
        {album.path && <Album album={album} className={styles.cover} />}
        <section className={styles.details}>
          <h1>{album.title}</h1>
          <h4>
            <Artists {...album} onClick={navigate.toArtist} />
          </h4>
          <h5>
            {album.tracks[0]?.year} - {album.tracks.length} songs
          </h5>
        </section>
      </section>
      <TrackList
        tracks={album.tracks.sort(byNumber)}
        trackContextMenu={trackContextMenu}
        trackFn={(t, idx) => (
          <Track
            {...t}
            className={selectedTrackIndex === idx ? styles.selected : undefined}
            onDoubleClick={() => onPlay(t, album.tracks)}
            onClick={() => setSelectedTrackIndex(idx)}
            isSelected={selectedTrackIndex === idx}
            showArtist={Object.keys(album.artists).length > 1}
            showNumber
          />
        )}
      />
    </div>
  );
};

const byNumber = (a: Metadata, b: Metadata) =>
  (a.number ?? 0) - (b.number ?? 0);

// TODO Move to own component
interface TrackListProps {
  tracks: Metadata[];
  trackContextMenu?: ContextHandler<Metadata>[];
  trackFn: (t: Metadata, idx: number) => React.ReactNode;
}

export const TrackList: FC<TrackListProps> = ({
  tracks,
  trackContextMenu,
  trackFn,
}) => {
  return (
    <section className={styles.tracks}>
      {tracks.map((t, idx) => (
        <ContextMenu
          context={t}
          handlers={trackContextMenu}
          getId={(t) => t.path}
        >
          <React.Fragment key={t.path}>{trackFn(t, idx)}</React.Fragment>
        </ContextMenu>
      ))}
    </section>
  );
};
