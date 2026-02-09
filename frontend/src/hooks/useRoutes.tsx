import { useRoute } from "wouter";
import {
  routes,
  type ArtistAlbumRouteParams,
  type RouteParams,
} from "../routing";

export const useRoutes = () => {
  const [isAlbumsRoute] = useRoute<RouteParams>(routes.allAlbums);

  const [isArtistRoute, artistRouteParams] = useRoute<ArtistAlbumRouteParams>(
    routes.artist,
  );

  const params = {
    album: isArtistRoute ? artistRouteParams.album : undefined,
    artist: isArtistRoute ? artistRouteParams.artist : undefined,
  };

  return {
    route: {
      is: {
        allAlbums: isAlbumsRoute,
        artist: isArtistRoute,
        album: isArtistRoute && artistRouteParams.album !== undefined,
      },
      params,
    },
  };
};
