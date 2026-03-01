import { useEffect, type FC } from "react";
import { useTrackQueueContext } from "../../contexts/TrackQueueContext";
import styles from "./Queue.module.scss";
import { Track } from "../Track/Track";
import type { Metadata } from "../../models";
import { useTrack } from "../../contexts/TrackContext";
import cx from "classnames";
import { useQueueItemContextMenu } from "../../hooks/useQueueItemContextMenu";
import { ContextMenu } from "../ContextMenu/ContextMenu";

interface Props {
  onDoubleClickTrack: (track: Metadata, queue: Metadata[]) => void;
}

export const Queue: FC<Props> = ({ onDoubleClickTrack }) => {
  const { items } = useTrackQueueContext();
  const { track } = useTrack();

  const contextMenu = useQueueItemContextMenu();

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
    <div className={styles.queue}>
      <h3>Queue</h3>
      <div className={styles.tracks}>
        {items.length > 0 ? (
          <div>
            {items.map((item, idx) => {
              const isPlaying = item.path === track?.path;
              return (
                <div key={item.path} id={`${item.album}-${item.number}`}>
                  <ContextMenu
                    context={item}
                    handlers={contextMenu}
                    getId={(item) => item.path}
                  >
                    <Track
                      {...item}
                      showArtist
                      showCover
                      showNumber
                      number={idx + 1}
                      onDoubleClick={() => onDoubleClickTrack(item, items)}
                      className={cx(styles.track, {
                        [styles.playing]: isPlaying,
                      })}
                    />
                  </ContextMenu>
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
};
