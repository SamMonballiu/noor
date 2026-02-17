import { useEffect, type FC } from "react";
import { useTrackQueueContext } from "../../contexts/TrackQueueContext";
import styles from "./Queue.module.scss";
import { Track } from "../Track/Track";
import type { Metadata } from "../../models";
import { useTrack } from "../../contexts/TrackContext";

interface Props {
  onDoubleClickTrack: (track: Metadata, queue: Metadata[]) => void;
}

export const Queue: FC<Props> = ({ onDoubleClickTrack }) => {
  const { items } = useTrackQueueContext();
  const { track } = useTrack();

  useEffect(() => {
    if (track?.path) {
      const playingElement = document.getElementById(
        `${track.album}-${track.number}`,
      );
      playingElement?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [track?.path]);

  return (
    <section>
      <div className={styles.queue}>
        <h3>Queue</h3>
        <div className={styles.tracks}>
          {items.length > 0 ? (
            <div>
              {items.map((item) => {
                const isPlaying = item.path === track?.path;
                return (
                  <div key={item.path} id={`${item.album}-${item.number}`}>
                    <Track
                      {...item}
                      showArtist
                      showCover
                      onDoubleClick={() => onDoubleClickTrack(item, items)}
                      className={isPlaying ? styles.playing : undefined}
                    />
                  </div>
                );
              })}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
};
