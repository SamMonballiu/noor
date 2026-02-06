import { useState, type FC } from "react";
import styles from "./AlbumsList.module.scss";
import { ImagePreview } from "../ImagePreview/ImagePreview";
import { useAlbumsQuery } from "../../query";
//@ts-ignore
import friendlyUrl from "friendly-url-extended";
import type { AlbumData } from "../../models";

interface Props {
  onSelect: (albumName: string) => void;
}
export const AlbumsList: FC<Props> = ({ onSelect }) => {
  const [albumData, setAlbumData] = useState<AlbumData[]>([]);

  useAlbumsQuery((data) => {
    for (const key of Object.keys(data)) {
      const artists = data[key].reduce((acc, val) => {
        for (const artist of val.artists ?? []) {
          if (!acc.includes(artist)) acc.push(artist);
        }
        return acc;
      }, []);

      albumData.push({
        title: key,
        artists,
        year: data[key][0].year,
        path: data[key][0].path.split("/").slice(0, -1).join("/"),
      });
    }

    setAlbumData(albumData);
  });

  return (
    <div className={styles.container}>
      {albumData.sort(byArtist).map((album) => (
        <Album
          key={album.title}
          data={album}
          onSelect={() => onSelect(album.title)}
        />
      ))}
    </div>
  );
};

interface AlbumProps {
  data: AlbumData;
  onSelect: () => void;
}
const Album: FC<AlbumProps> = ({ data, onSelect }) => {
  return (
    <div className={styles.album} onClick={onSelect}>
      <ImagePreview path={data.path} className={styles.cover} />
      <p className={styles.title}>{data.title}</p>
      <p>{data.artists.join(", ")}</p>
      <p>{data.year}</p>
    </div>
  );
};

const byArtist = (a: AlbumData, b: AlbumData) => {
  return a.artists[0].localeCompare(b.artists[0]);
};
