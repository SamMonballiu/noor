import { type FC } from "react";
import { FaList, FaVolumeUp } from "react-icons/fa";
import styles from "./PlayerOptions.module.scss";

interface PlayerOptionsProps {
  onToggleQueue: () => void;
  onVolumeChanged: (value: number) => void;
}

export const PlayerOptions: FC<PlayerOptionsProps> = ({
  onToggleQueue,
  onVolumeChanged,
}) => {
  return (
    <section className={styles.options}>
      <FaVolumeUp />
      <input
        type="range"
        min={0}
        max={1}
        step={0.05}
        onChange={(e) => onVolumeChanged(parseFloat(e.target.value))}
      />
      <FaList onClick={onToggleQueue} />
    </section>
  );
};
