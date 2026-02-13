import { type FC } from "react";
import { FaList, FaVolumeMute, FaVolumeUp } from "react-icons/fa";
import styles from "./PlayerOptions.module.scss";
import { useTrack } from "../../contexts/TrackContext";

interface PlayerOptionsProps {
  onToggleQueue: () => void;
  onVolumeChanged: (value: number) => void;
}

export const PlayerOptions: FC<PlayerOptionsProps> = ({
  onToggleQueue,
  onVolumeChanged,
}) => {
  const { volume, isMuted, toggleMuted } = useTrack();
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
      <FaList onClick={onToggleQueue} />
    </section>
  );
};
