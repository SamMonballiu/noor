import { type FC } from "react";
import styles from "./NowPlaying.module.scss";
import { useTrack } from "../../contexts/TrackContext";
import { ImagePreview } from "../ImagePreview/ImagePreview";

export const NowPlaying: FC = () => {
  const { track } = useTrack();

  return (
    <section className={styles.playing}>
      {track ? (
        <>
          <ImagePreview className={styles.cover} path={track.albumPath} />
          <div className={styles.info}>
            <span className={styles.track}>{track.title}</span>
            <span className={styles.artist}>{track.artists?.join(", ")}</span>
          </div>
        </>
      ) : null}
    </section>
  );
};
