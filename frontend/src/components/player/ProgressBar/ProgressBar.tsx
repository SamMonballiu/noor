import { useRef, type FC } from "react";
import styles from "./ProgressBar.module.scss";

interface ProgressBarProps {
  value: number;
  onSeek: (position: number) => void;
}

export const ProgressBar: FC<ProgressBarProps> = ({ value, onSeek }) => {
  const ref = useRef<HTMLProgressElement | null>(null);

  const handleClick = (e: React.MouseEvent) => {
    const position = e.clientX / (ref.current?.clientWidth ?? 1);
    onSeek(position);
  };

  return (
    <section className={styles.progress}>
      <progress ref={ref} value={value} onClick={handleClick} />
    </section>
  );
};
