import { useMemo, useState, type FC } from "react";
import { useRoutes } from "../../hooks/useRoutes";
//@ts-ignore
import friendlyUrl from "friendly-url-extended";
import { useAlbumsQuery } from "../../query";
import type { AlbumData, Metadata } from "../../models";
import { ImagePreview } from "../ImagePreview/ImagePreview";
import styles from "./AlbumTrackList.module.scss";
import cx from "classnames";
import { FaPlay } from "react-icons/fa";

interface Props {
  onPlay: (track: Metadata, tracks: Metadata[]) => void;
}

export const AlbumTrackList: FC<Props> = ({ onPlay }) => {
  const { route } = useRoutes();
  const { data, isLoading } = useAlbumsQuery();

  const [selectedTrackIndex, setSelectedTrackIndex] = useState<number | null>(
    null,
  );

  const album = useMemo<AlbumData & { tracks: Metadata[] }>(() => {
    const empty = {
      title: "",
      artists: [],
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
          artists: data[key]
            .flatMap((t) => t.artists ?? [])
            .reduce((acc, val) => {
              if (!acc.includes(val)) acc.push(val);
              return acc;
            }, [] as string[]),
          path: data[key][0].albumPath,
        };
      }
    }

    return empty;
  }, [isLoading, data]);

  return (
    <div className={styles.container}>
      <section className={styles.top}>
        {album.path && (
          <ImagePreview className={styles.cover} path={album.path} />
        )}
        <section className={styles.details}>
          <h1>{album.title}</h1>
          <h4>{album.artists.join(", ")}</h4>
          <h5>
            {album.tracks[0]?.year} - {album.tracks.length} songs
          </h5>
        </section>
      </section>
      <section className={styles.tracks}>
        {album.tracks.map((t, idx) => (
          <Track
            key={t.number}
            {...t}
            onPlay={() => onPlay(t, album.tracks)}
            onSelect={() => setSelectedTrackIndex(idx)}
            isSelected={selectedTrackIndex === idx}
            showArtist={album.artists.length > 1}
          />
        ))}
      </section>
    </div>
  );
};

type TrackProps = Metadata & {
  onPlay: () => void;
  onSelect: () => void;
  isSelected: boolean;
  showArtist: boolean;
};

const Track: FC<TrackProps> = ({
  number,
  title,
  artists,
  onPlay,
  onSelect,
  isSelected,
  showArtist,
}) => {
  return (
    <div
      className={cx(styles.track, { [styles.selected]: isSelected })}
      onClick={isSelected ? onPlay : onSelect}
    >
      <div className={styles.number}>
        {isSelected ? <FaPlay /> : <span>{number}</span>}
      </div>
      <div>
        <div className={styles.title}>{title}</div>
        {showArtist ? (
          <span className={styles.artists}>{artists?.join(",")}</span>
        ) : null}
      </div>
    </div>
  );
};
