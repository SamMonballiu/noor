import {
  createContext,
  useContext,
  useMemo,
  useState,
  type FC,
  type ReactNode,
} from "react";
import type { Metadata as TrackData } from "../models";

interface ProviderProps {
  children: ReactNode;
}

interface TrackQueueContextType {
  items: TrackData[];
  addItem: (item: TrackData) => void;
  addItems: (items: TrackData[]) => void;
  setItems: (items: TrackData[]) => void;
  activeItem: TrackData | null;
  setActiveItem: (item: TrackData | null) => void;
  has: (t: TrackData) => boolean;
  go: {
    previous: (() => void) | undefined;
    next: (() => void) | undefined;
  };
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

  return (
    <TrackQueueContext.Provider
      value={{
        items,
        addItem,
        addItems,
        setItems,
        activeItem,
        setActiveItem,
        go: memo.go,
        has: memo.has,
      }}
    >
      {children}
    </TrackQueueContext.Provider>
  );
};
