import {
  createContext,
  useContext,
  useState,
  type FC,
  type ReactNode,
} from "react";
import type { Metadata } from "../models";

interface TrackContextType {
  track: Metadata | null;
  setTrackData: (data: Metadata) => void;
  volume: number;
  setVolume: (value: number) => void;
}

const TrackContext = createContext<TrackContextType | undefined>(undefined);

export const useTrack = () => {
  const context = useContext(TrackContext);
  if (!context) {
    throw new Error("useTrack must be used within TrackProvider");
  }
  return context;
};

interface TrackProviderProps {
  children: ReactNode;
}

export const TrackProvider: FC<TrackProviderProps> = ({ children }) => {
  const [trackData, setTrackData] = useState<Metadata | null>(null);
  const [volume, setVolume] = useState<number>(0.5);

  return (
    <TrackContext.Provider
      value={{ track: trackData, setTrackData, volume, setVolume }}
    >
      {children}
    </TrackContext.Provider>
  );
};
