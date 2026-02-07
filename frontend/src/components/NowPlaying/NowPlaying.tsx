import { type FC } from "react";
import styles from "./NowPlaying.module.scss";
import { useTrack } from "../../contexts/TrackContext";
import { ImagePreview } from "../ImagePreview/ImagePreview";

interface Props {
  onClick?: () => void;
}
export const NowPlaying: FC<Props> = ({ onClick }) => {
  const { track } = useTrack();

  return (
    <section className={styles.playing}>
      {track ? (
        <>
          <div onClick={onClick}>
            <ImagePreview className={styles.cover} path={track.albumPath} />
          </div>
          <div className={styles.info}>
            <span className={styles.track}>{track.title}</span>
            <span className={styles.artist}>{track.artists?.join(", ")}</span>
          </div>
        </>
      ) : null}
    </section>
  );
};
