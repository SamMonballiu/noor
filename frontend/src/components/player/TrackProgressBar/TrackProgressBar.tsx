import { type FC, useState, useEffect } from "react";
import { useTrackQueueContext } from "../../../contexts/TrackQueueContext";
import { ProgressBar } from "../ProgressBar/ProgressBar";

interface Props {
  onSeek: (position: number) => void;
}

export const TrackProgressBar: FC<Props> = ({ onSeek }) => {
  const { audioPlayer } = useTrackQueueContext();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const unsubscribe = audioPlayer.onProgressChanged.subscribe(setProgress);
    return unsubscribe;
  }, [audioPlayer]);

  return <ProgressBar value={progress} onSeek={onSeek} />;
};
