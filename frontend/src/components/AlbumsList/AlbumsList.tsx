import { useMemo, type FC } from "react";
import styles from "./AlbumsList.module.scss";
import { ImagePreview } from "../ImagePreview/ImagePreview";
import { useAlbumsQuery } from "../../query";
//@ts-ignore
import friendlyUrl from "friendly-url-extended";
import type { AlbumData } from "../../models";
import { getArtistsMap, getMainArtist } from "../../models/util";
import { Artists } from "../Artists/Artists";
import { useRoutes } from "../../hooks/useRoutes";

interface Props {
  onSelect: (artistName: string, albumName: string) => void;
}
export const AlbumsList: FC<Props> = ({ onSelect }) => {
  const { data, isLoading } = useAlbumsQuery();
  const { route } = useRoutes();

  const albumData = useMemo<AlbumData[]>(() => {
    if (isLoading || !data) {
      return [];
    }

    let result: AlbumData[] = [];
    for (const key of Object.keys(data)) {
      const artists = getArtistsMap(data[key]);

      if (
        (route.is.artist &&
          Object.keys(artists).some(
            (x) => friendlyUrl(x) === route.params.artist
          )) ||
        route.is.allAlbums
      ) {
        result.push({
          title: key,
          artists: artists,
          year: data[key][0].year,
          path: data[key][0].path.split("/").slice(0, -1).join("/"),
        });
      }
    }

    return result;
  }, [data, isLoading]);

  return (
    <div className={styles.container}>
      {albumData.sort(byArtistThenByYear).map((album) => (
        <Album
          key={album.title}
          data={album}
          onSelect={() => onSelect(getMainArtist(album.artists), album.title)}
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
    <div className={styles.album}>
      <ImagePreview
        path={data.path}
        className={styles.cover}
        onClick={onSelect}
      />
      {/* <div className={styles.cover}>&nbsp;</div> */}
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
    getMainArtist(b.artists)
  );

  return artistCompare === 0 ? (a.year ?? 0) - (b.year ?? 0) : artistCompare;
};
