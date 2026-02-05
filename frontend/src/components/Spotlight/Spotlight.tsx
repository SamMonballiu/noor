import { type FC } from "react";
import styles from "./Spotlight.module.scss";

interface SpotlightProps {
  imageUrl: string;
  trackName: string;
  albumName: string;
  artistName: string;
}

export const Spotlight: FC<SpotlightProps> = ({
  imageUrl,
  trackName,
  albumName,
  artistName,
}) => {
  return (
    <section className={styles.spotlight}>
      <div>
        <img src={imageUrl} />
        <img src={imageUrl} className={styles.background} />
        <div className={styles.info}>
          <span className={styles.track}>{trackName}</span>
          <span className={styles.album}>{albumName}</span>
          <span className={styles.artist}>{artistName}</span>
        </div>
      </div>
    </section>
  );
};
