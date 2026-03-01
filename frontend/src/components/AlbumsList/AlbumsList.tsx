import { useMemo, type FC } from "react";
import styles from "./AlbumsList.module.scss";
import { useAlbumsQuery } from "../../query";
//@ts-ignore
import friendlyUrl from "friendly-url-extended";
import type { AlbumData, AlbumDataWithTracks } from "../../models";
import { getArtistsMap, getMainArtist } from "../../models/util";
import { Artists } from "../Artists/Artists";
import { useRouting } from "../../hooks/useRouting";
import { Album } from "../Album/Album";

interface Props {
  onSelect: (album: AlbumData) => void;
  searchTerm?: string;
}
export const AlbumsList: FC<Props> = ({ onSelect, searchTerm }) => {
  const { route } = useRouting();
  const { data, isLoading } = useAlbumsQuery(
    route.is.allAlbums ? searchTerm : undefined,
  );

  const albumData = useMemo<AlbumDataWithTracks[]>(() => {
    if (isLoading || !data) {
      return [];
    }

    let result: AlbumDataWithTracks[] = [];
    for (const key of Object.keys(data)) {
      const artists = getArtistsMap(data[key]);

      if (
        (route.is.artist &&
          Object.keys(artists).some(
            (x) => friendlyUrl(x) === route.params.artist,
          )) ||
        route.is.allAlbums
      ) {
        result.push({
          title: key,
          artists: artists,
          year: data[key][0].year,
          path: data[key][0].path.split("/").slice(0, -1).join("/"),
          tracks: data[key],
        });
      }
    }

    return result;
  }, [data, isLoading]);

  return (
    <div className={styles.container}>
      {albumData.sort(byArtistThenByYear).map((album) => (
        <AlbumItem
          key={album.title}
          data={album}
          onSelect={() => onSelect(album)}
        />
      ))}
    </div>
  );
};

interface AlbumProps {
  data: AlbumDataWithTracks;
  onSelect: () => void;
}
const AlbumItem: FC<AlbumProps> = ({ data, onSelect }) => {
  return (
    <div className={styles.album}>
      <Album className={styles.cover} onClick={onSelect} album={data} />
      <p className={styles.title}>{data.title}</p>
      <p>
        <Artists {...data} show="onlymain" />
      </p>
      <p>{data.year}</p>
    </div>
  );
};

const byArtistThenByYear = (a: AlbumData, b: AlbumData) => {
  const artistCompare = getMainArtist(a.artists).localeCompare(
    getMainArtist(b.artists),
  );

  return artistCompare === 0 ? (a.year ?? 0) - (b.year ?? 0) : artistCompare;
};
