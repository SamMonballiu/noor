import type { FC } from "react";
import type { AlbumData, Metadata } from "../../../models";
import { useAlbumContextMenu } from "../../../hooks/useAlbumContextMenu";
import { ContextMenu } from "../../common/ContextMenu/ContextMenu";
import { ImagePreview } from "../../common/ImagePreview/ImagePreview";

interface Props {
  className?: string;
  album: AlbumData & { tracks: Metadata[] };
  disableContextMenu?: boolean;
  onClick?: () => void;
}

export const Album: FC<Props> = ({
  className,
  album,
  disableContextMenu = false,
  onClick,
}) => {
  const albumContextMenu = useAlbumContextMenu();
  return (
    <ContextMenu
      context={album}
      handlers={disableContextMenu ? undefined : albumContextMenu}
      getId={(album) => album.path}
    >
      <ImagePreview className={className} path={album.path} onClick={onClick} />
    </ContextMenu>
  );
};
