import { useLocation, useRoute } from "wouter";
import {
  routes,
  type ArtistAlbumRouteParams,
  type RouteParams,
} from "../routing";
// @ts-ignore;
import friendlyUrl from "friendly-url-extended";

const url = friendlyUrl;

export const useRouting = () => {
  const [, setLocation] = useLocation();
  const getRoute = <T extends RouteParams>(
    route: string,
    params?: T,
    options?: { fullyQualified: boolean }
  ) => {
    if (params !== undefined) {
      route = Object.entries(params).reduce((acc, [key, value]) => {
        return acc.replace(`:${key}`, value);
      }, route);
    }

    if (options?.fullyQualified) {
      return `${window.location.origin}${route}`;
    }

    if (route.endsWith("?")) {
      route = route.slice(0, -1);
    }
    return route;
  };

  const navigateTo = <T extends RouteParams>(
    route: string,
    params?: T,
    querystring: string = ""
  ) => {
    if (params !== undefined) {
      route = Object.entries(params).reduce((acc, [key, value]) => {
        return acc.replace(`:${key}`, value);
      }, route);
    }

    setLocation(getRoute(route, params) + querystring);
  };

  const navigateToArtist = (artist: string) => {
    navigateTo(routes.artist, { artist: url(artist), album: "" });
  };
  const navigateToAlbum = (artist: string, album: string) => {
    navigateTo(routes.artist, { artist: url(artist), album: url(album) });
  };

  const [isAlbumsRoute] = useRoute<RouteParams>(routes.allAlbums);

  const [isArtistRoute, artistRouteParams] = useRoute<ArtistAlbumRouteParams>(
    routes.artist
  );

  const params = {
    album: isArtistRoute ? artistRouteParams.album : undefined,
    artist: isArtistRoute ? artistRouteParams.artist : undefined,
  };

  return {
    navigate: {
      to: navigateTo,
      toAlbum: navigateToAlbum,
      toArtist: navigateToArtist,
      getRoute,
    },
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
