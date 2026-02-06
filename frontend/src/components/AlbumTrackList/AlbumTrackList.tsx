import { useMemo, type FC } from "react";
import { useRoutes } from "../../hooks/useRoutes";
//@ts-ignore
import friendlyUrl from "friendly-url-extended";
import { useAlbumsQuery } from "../../query";
import type { AlbumData, Metadata } from "../../models";
import { ImagePreview } from "../ImagePreview/ImagePreview";
import styles from "./AlbumTrackList.module.scss";

export const AlbumTrackList: FC = () => {
  const { route } = useRoutes();
  const { data, isLoading } = useAlbumsQuery();

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
        {album.tracks.map((t) => (
          <Track key={t.number} {...t} />
        ))}
      </section>
    </div>
  );
};

const Track: FC<Metadata> = ({ number, title, artists }) => {
  return (
    <div className={styles.track}>
      <span className={styles.number}>{number}</span>
      <div>
        <div className={styles.title}>{title}</div>
        <span className={styles.artists}>{artists?.join(",")}</span>
      </div>
    </div>
  );
};
