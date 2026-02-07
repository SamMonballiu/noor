import { type FC } from "react";
import styles from "./Spotlight.module.scss";
import type { Metadata } from "../../models";
import { useAlbumCoverQuery } from "../../query";
import { FaTimesCircle } from "react-icons/fa";

interface SpotlightProps {
  track: Metadata;
  onClose?: () => void;
  onAlbumClick: (album: string) => void;
}

export const Spotlight: FC<SpotlightProps> = ({
  track,
  onClose,
  onAlbumClick,
}) => {
  const { data: cover } = useAlbumCoverQuery(track.albumPath);

  return (
    <section className={styles.spotlight}>
      <FaTimesCircle className={styles.closeIcon} onClick={onClose} />
      <img src={cover} className={styles.background} />
      <div className={styles.content}>
        <img
          className={styles.cover}
          src={cover}
          onClick={() => onAlbumClick(track.album!)}
        />
        <div className={styles.info}>
          <span className={styles.track}>{track.title}</span>
          <span className={styles.album}>{track.album}</span>
          <span className={styles.artist}>{track.artists?.join(", ")}</span>
        </div>
      </div>
    </section>
  );
};
