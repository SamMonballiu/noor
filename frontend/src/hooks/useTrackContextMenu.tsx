import { FaList } from "react-icons/fa";
import type { ContextHandler } from "../components/ContextMenu/ContextMenu";
import { useTrackQueueContext } from "../contexts/TrackQueueContext";
import type { Metadata } from "../models";

export const useTrackContextMenu = () => {
  const ctx = useTrackQueueContext();

  const contextMenu: ContextHandler<Metadata>[] = [
    {
      label: "Add to queue",
      icon: <FaList />,
      disabled: (t) => ctx.items.length > 0 && ctx.has(t),
      onClick: (t) => ctx.addItem(t),
    },
  ];

  return contextMenu;
};
