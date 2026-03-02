import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type FC,
  type ReactNode,
} from "react";
import type { Metadata as TrackData } from "../models";
import { useAudioPlayer, type AudioPlayer } from "../hooks/useAudioPlayer";

interface ProviderProps {
  children: ReactNode;
}

interface TrackQueueContextType {
  items: TrackData[];
  addItem: (item: TrackData) => void;
  addItems: (items: TrackData[]) => void;
  removeItem: (item: TrackData) => void;
  removeItems: (predicate: (item: TrackData) => boolean) => void;
  setItems: (items: TrackData[]) => void;
  activeItem: TrackData | null;
  setActiveItem: (item: TrackData | null) => void;
  isActiveItem: (item: TrackData) => boolean;
  has: (t: TrackData) => boolean;
  go: {
    previous: (() => void) | undefined;
    next: (() => void) | undefined;
  };
  volume: number;
  setVolume: (value: number) => void;
  isMuted: boolean;
  toggleMuted: () => void;
  audioPlayer: AudioPlayer;
}

const TrackQueueContext = createContext<TrackQueueContextType | undefined>(
  undefined,
);

export const useTrackQueueContext = () => {
  const context = useContext(TrackQueueContext);
  if (!context) {
    throw new Error(
      "useTrackQueueContext must be used within TrackQueueProvider",
    );
  }
  return context;
};

export const TrackQueueProvider: FC<ProviderProps> = ({ children }) => {
  const [volume, setVolume] = useState<number>(0.5);
  const [isMuted, setIsMuted] = useState(true);

  const audioPlayer = useAudioPlayer(volume, setVolume, isMuted);

  const toggleMuted = () => setIsMuted((prev) => !prev);
  useEffect(() => {
    setIsMuted(volume === 0);
  }, [volume]);

  const [items, setItems] = useState<TrackData[]>([]);
  const [activeItem, setActiveItem] = useState<TrackData | null>(null);

  const memo = useMemo(() => {
    const activeTrack = items.find((x) => x.path === activeItem?.path);
    const activeTrackIdx = activeTrack ? items.indexOf(activeTrack) : -1;

    return {
      activeTrackIdx,
      go: {
        previous:
          activeTrackIdx > 0
            ? () => {
                const prevItem = items[activeTrackIdx - 1];
                setActiveItem(prevItem);
              }
            : undefined,
        next:
          activeTrackIdx < items.length - 1
            ? () => {
                const nextItem = items[activeTrackIdx + 1];
                setActiveItem(nextItem);
              }
            : undefined,
      },
      has: (t: TrackData) => items.some((i) => i.path === t.path),
    };
  }, [activeItem, items]);

  const addItem = (item: TrackData) => setItems([...items, item]);
  const addItems = (toAdd: TrackData[]) => setItems([...items, ...toAdd]);

  const removeItem = (item: TrackData) => {
    if (isActiveItem(item)) {
      memo.go.next?.();
    }
    setItems(items.filter((i) => i.path !== item.path));
  };

  const removeItems = (predicate: (item: TrackData) => boolean) => {
    if (activeItem) {
      // get index of currently active item
      const activeItemIdx = activeItem ? -1 : items.indexOf(activeItem!);

      // starting at index of currently active item, get index of the first item that does NOT meet the predicate
      for (let i = activeItemIdx; i < items.length; i++) {
        if (!predicate(items[i])) {
          // make that item the active item
          setActiveItem(items[i]);
          break;
        }
      }
    }

    const toRemove = items.filter(predicate);
    setItems(items.filter((i) => !toRemove.includes(i)));
  };
  const isActiveItem = (item: TrackData) => activeItem?.path === item.path;

  return (
    <TrackQueueContext.Provider
      value={{
        items,
        addItem,
        addItems,
        removeItem,
        removeItems,
        setItems,
        activeItem,
        setActiveItem,
        isActiveItem,
        go: memo.go,
        has: memo.has,
        volume,
        setVolume,
        isMuted,
        toggleMuted,
        audioPlayer,
      }}
    >
      {children}
    </TrackQueueContext.Provider>
  );
};
