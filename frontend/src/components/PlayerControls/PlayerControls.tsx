import { type FC } from "react";
import { FaPause, FaPlay, FaStepBackward, FaStepForward } from "react-icons/fa";
import styles from "./PlayerControls.module.scss";

interface PlayerControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onPrevious: () => void;
  onNext: () => void;
}

export const PlayerControls: FC<PlayerControlsProps> = ({
  isPlaying,
  onPlayPause,
  onPrevious,
  onNext,
}) => {
  return (
    <section className={styles.controls}>
      <FaStepBackward onClick={onPrevious} />
      {isPlaying ? (
        <FaPause className={styles.mainBtn} onClick={onPlayPause} />
      ) : (
        <FaPlay className={styles.mainBtn} onClick={onPlayPause} />
      )}
      <FaStepForward onClick={onNext} />
    </section>
  );
};
