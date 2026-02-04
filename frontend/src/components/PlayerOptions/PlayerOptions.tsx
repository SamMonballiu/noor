import { type FC } from "react";
import { FaList, FaVolumeUp } from "react-icons/fa";
import styles from "./PlayerOptions.module.scss";

interface PlayerOptionsProps {
  onToggleQueue: () => void;
}

export const PlayerOptions: FC<PlayerOptionsProps> = ({ onToggleQueue }) => {
  return (
    <section className={styles.options}>
      <FaVolumeUp />
      <input type="range" />
      <FaList onClick={onToggleQueue} />
    </section>
  );
};
