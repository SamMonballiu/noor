import { type FC } from "react";
import { FaList, FaVolumeUp } from "react-icons/fa";
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
  const { volume } = useTrack();
  return (
    <section className={styles.options}>
      <FaVolumeUp />
      <input
        type="range"
        min={0}
        max={1}
        step={0.05}
        value={volume}
        onChange={(e) => onVolumeChanged(parseFloat(e.target.value))}
      />
      <FaList onClick={onToggleQueue} />
    </section>
  );
};
