import type { FC } from "react";
import { usePlaylistsMetadataQuery } from "../../../query";
import styles from "./PlaylistList.module.scss";
import type { PlaylistMetadata } from "../../../models";

interface Props {
  onSelect: (id: string) => void;
}

export const PlaylistList: FC<Props> = ({ onSelect }) => {
  const { data } = usePlaylistsMetadataQuery();

  return (
    <section className={styles.container}>
      <h1>Playlists</h1>
      <div className={styles.playlists}>
        {data?.map((x) => (
          <PlaylistEntry key={x.id} data={x} onSelect={() => onSelect(x.id)} />
        ))}
      </div>
    </section>
  );
};

interface PlaylistEntryProps {
  data: PlaylistMetadata;
  onSelect: () => void;
}

const PlaylistEntry: FC<PlaylistEntryProps> = ({ data, onSelect }) => {
  return (
    <div className={styles.playlist}>
      <section onClick={onSelect}>
        <div className={styles.cover}>&nbsp;</div>
        <h2>{data.name}</h2>
        <h3>{data.itemsCount} tracks</h3>
      </section>
    </div>
  );
};
