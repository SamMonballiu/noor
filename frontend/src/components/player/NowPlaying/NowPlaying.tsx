import { type FC } from "react";
import styles from "./NowPlaying.module.scss";
import { ImagePreview } from "../../common/ImagePreview/ImagePreview";
import { useTrackQueueContext } from "../../../contexts/TrackQueueContext";

interface Props {
  onClick?: () => void;
}
export const NowPlaying: FC<Props> = ({ onClick }) => {
  const { activeItem: track } = useTrackQueueContext();

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
