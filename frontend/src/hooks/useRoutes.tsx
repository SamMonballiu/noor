import { useRoute } from "wouter";
import { routes, type AlbumRouteParams } from "../routing";

export const useRoutes = () => {
  const [isAlbumRoute, albumRouteParams] = useRoute<AlbumRouteParams>(
    routes.albums,
  );

  const params = {
    album: isAlbumRoute ? albumRouteParams?.album : undefined,
  };

  return {
    route: {
      is: {
        album: isAlbumRoute,
      },
      params,
    },
  };
};
