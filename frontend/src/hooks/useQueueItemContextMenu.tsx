import { FaLayerGroup, FaList, FaTimes } from "react-icons/fa";
import type { ContextHandler } from "../components/common/ContextMenu/ContextMenu";
import { useTrackQueueContext } from "../contexts/TrackQueueContext";
import type { Metadata } from "../models";

export const useQueueItemContextMenu = () => {
  const ctx = useTrackQueueContext();

  const contextMenu: ContextHandler<Metadata>[] = [
    {
      label: "Remove track from queue",
      icon: <FaTimes />,
      onClick: (t) => ctx.removeItem(t),
    },
    {
      label: "Remove album from queue",
      icon: <FaLayerGroup />,
      onClick: (t) => ctx.removeItems((trk) => trk.albumPath === t.albumPath),
    },
  ];

  return contextMenu;
};
