import type { FC } from "react";
import { useSinglePlaylistQuery } from "../../query";
import { Track } from "../Track/Track";
import styles from "./SinglePlaylist.module.scss";
import { TrackList } from "../AlbumTrackList/AlbumTrackList";
import type { Metadata } from "../../models";

interface Props {
  id: string;
  onQueue: (tracks: Metadata[]) => void;
}

export const SinglePlaylist: FC<Props> = ({ id, onQueue }) => {
  const { data, isLoading } = useSinglePlaylistQuery(id);

  return isLoading ? null : (
    <div className={styles.container}>
      <section className={styles.header}>
        <h1>{data?.name}</h1>
        <h2>{data?.items.length} tracks</h2>
      </section>
      <button onClick={() => onQueue(data?.items ?? [])}>
        Play this playlist
      </button>
      <section>
        <TrackList
          tracks={data?.items ?? []}
          trackFn={(tr, idx) => (
            <Track
              {...tr}
              key={idx}
              titleFallback={tr.path}
              number={idx + 1}
              showArtist
              showNumber
              showCover
            />
          )}
        />
      </section>
    </div>
  );
};
