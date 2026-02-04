import { type FC } from "react";
import styles from "./NowPlaying.module.scss";
import { useTrack } from "../../contexts/TrackContext";

export const NowPlaying: FC = () => {
  const { imageUrl, trackName, artistName } = useTrack();
  return (
    <section className={styles.playing}>
      <img className={styles.cover} src={imageUrl} />
      <div className={styles.info}>
        <span className={styles.track}>{trackName}</span>
        <span className={styles.artist}>{artistName}</span>
      </div>
    </section>
  );
};
