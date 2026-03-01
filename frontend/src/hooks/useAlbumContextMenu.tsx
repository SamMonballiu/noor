import { FaList } from "react-icons/fa";
import { MdMusicNote, MdPerson } from "react-icons/md";
import type { ContextHandler } from "../components/ContextMenu/ContextMenu";
import type { AlbumData, Metadata } from "../models";
import { useRouting } from "./useRouting";
import { getMainArtist } from "../models/util";
import { useTrackQueueContext } from "../contexts/TrackQueueContext";

export const useAlbumContextMenu = () => {
  const { route, navigate } = useRouting();
  const queueCtx = useTrackQueueContext();

  const contextMenu: ContextHandler<AlbumData & { tracks: Metadata[] }>[] = [
    {
      label: "Go to artist",
      icon: <MdPerson />,
      onClick: (a) => navigate.toArtist(getMainArtist(a.artists)),
    },
    {
      label: "Go to album",
      icon: <MdMusicNote />,
      disabled: () => route.is.album,
      onClick: (a) => navigate.toAlbum(getMainArtist(a.artists), a.title),
    },
    {
      label: "Add to queue",
      icon: <FaList />,
      onClick: (a) => queueCtx.addItems(a.tracks ?? []),
    },
  ];

  return contextMenu;
};
