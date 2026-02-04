import {
  createContext,
  useContext,
  useState,
  type FC,
  type ReactNode,
} from "react";

interface TrackData {
  trackName: string;
  artistName: string;
  albumName: string;
  imageUrl: string;
}

interface TrackContextType extends TrackData {
  setTrackData: (data: TrackData) => void;
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
  const [trackData, setTrackData] = useState<TrackData>({
    trackName: "In Your Palace",
    artistName: "The Cribs",
    albumName: "24/7 Rock Star Shit",
    imageUrl: "http://raspberrypi:4004/cribs.jpg",
  });

  return (
    <TrackContext.Provider value={{ ...trackData, setTrackData }}>
      {children}
    </TrackContext.Provider>
  );
};
