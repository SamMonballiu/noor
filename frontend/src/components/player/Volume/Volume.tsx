import { type FC } from "react";
import { FaVolumeMute, FaVolumeUp } from "react-icons/fa";
import styles from "./Volume.module.scss";
import { useTrackQueueContext } from "../../../contexts/TrackQueueContext";

interface Props {
  onVolumeChanged: (value: number) => void;
}

export const Volume: FC<Props> = ({ onVolumeChanged }) => {
  const { volume, isMuted, toggleMuted } = useTrackQueueContext();
  const VolumeIcon = isMuted ? FaVolumeMute : FaVolumeUp;

  return (
    <section className={styles.options}>
      <VolumeIcon onClick={toggleMuted} />
      <input
        type="range"
        min={0}
        max={1}
        step={0.05}
        value={isMuted ? 0 : volume}
        onChange={(e) => onVolumeChanged(parseFloat(e.target.value))}
      />
    </section>
  );
};
