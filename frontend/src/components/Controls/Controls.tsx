import { type FC } from "react";
import styles from "./Controls.module.scss";
import { NowPlaying } from "../NowPlaying/NowPlaying";
import { PlayerControls } from "../PlayerControls/PlayerControls";
import { PlayerOptions } from "../PlayerOptions/PlayerOptions";
import { ProgressBar } from "../ProgressBar/ProgressBar";

interface ControlsProps {
  isPlaying: boolean;
  progress: number;
  onPlayPause: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onSeek: (position: number) => void;
  onToggleQueue: () => void;
  onClickPlaying: () => void;
  onVolumeChanged: (value: number) => void;
}

export const Controls: FC<ControlsProps> = ({
  isPlaying,
  progress,
  onPlayPause,
  onPrevious,
  onNext,
  onSeek,
  onToggleQueue,
  onClickPlaying,
  onVolumeChanged,
}) => {
  return (
    <section className={styles.bottom}>
      <ProgressBar value={progress} onSeek={onSeek} />

      <section className={styles.btm}>
        <NowPlaying onClick={onClickPlaying} />

        <PlayerControls
          isPlaying={isPlaying}
          onPlayPause={onPlayPause}
          onPrevious={onPrevious}
          onNext={onNext}
        />

        <PlayerOptions
          onToggleQueue={onToggleQueue}
          onVolumeChanged={onVolumeChanged}
        />
      </section>
    </section>
  );
};
