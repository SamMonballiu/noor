import { type FC } from "react";
import styles from "./Spotlight.module.scss";
import type { Metadata } from "../../models";
import { useAlbumCoverQuery } from "../../query";

interface SpotlightProps {
  track: Metadata;
}

export const Spotlight: FC<SpotlightProps> = ({ track }) => {
  const { data: cover } = useAlbumCoverQuery(track.albumPath);

  return (
    <section className={styles.spotlight}>
      <div>
        <img src={cover} />
        <img src={cover} className={styles.background} />
        <div className={styles.info}>
          <span className={styles.track}>{track.title}</span>
          <span className={styles.album}>{track.album}</span>
          <span className={styles.artist}>{track.artists?.join(", ")}</span>
        </div>
      </div>
    </section>
  );
};
