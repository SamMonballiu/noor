import { useLocation, useRoute } from "wouter";
import {
  routes,
  type ArtistAlbumRouteParams,
  type PlaylistRouteParams,
  type RouteParams,
} from "../routing";
// @ts-ignore;
import friendlyUrl from "friendly-url-extended";
import type { AlbumData } from "../models";
import { getMainArtist } from "../models/util";

const url = friendlyUrl;

export const useRouting = () => {
  const [location, setLocation] = useLocation();
  const getRoute = <T extends RouteParams>(
    route: string,
    params?: T,
    options?: { fullyQualified: boolean },
  ) => {
    if (params !== undefined) {
      route = Object.entries(params).reduce((acc, [key, value]) => {
        return acc.replace(`:${key}`, value);
      }, route);
    }

    if (options?.fullyQualified) {
      return `${window.location.origin}${route}`;
    }

    // Remove last segment if it contains a colon
    const segments = route.split("/");
    if (segments[segments.length - 1]?.includes(":")) {
      segments.pop();
      route = segments.join("/");
    }

    if (route.endsWith("?")) {
      route = route.slice(0, -1);
    }

    return route;
  };

  const navigateTo = <T extends RouteParams>(
    route: string,
    params?: T,
    querystring: string = "",
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

  const navigateToAlbum = (album: AlbumData) => {
    navigateTo(routes.artist, {
      artist: url(getMainArtist(album.artists)),
      album: url(album.title),
    });
  };

  const navigateToPlaylist = (id: string) => {
    navigateTo(routes.playlist, {
      id,
    });
  };

  const [isAlbumsRoute] = useRoute<RouteParams>(routes.allAlbums);
  const [isPlaylistsRoute, playlistRouteParams] = useRoute<PlaylistRouteParams>(
    routes.playlist,
  );

  const [isArtistRoute, artistRouteParams] = useRoute<ArtistAlbumRouteParams>(
    routes.artist,
  );

  const params = {
    album: isArtistRoute ? artistRouteParams.album : undefined,
    artist: isArtistRoute ? artistRouteParams.artist : undefined,
    playlist: isPlaylistsRoute ? playlistRouteParams.id : undefined,
  };

  return {
    navigate: {
      to: navigateTo,
      toAlbum: navigateToAlbum,
      toArtist: navigateToArtist,
      toPlaylist: navigateToPlaylist,
      getRoute,
    },
    route: {
      is: {
        allAlbums: isAlbumsRoute,
        playlists: isPlaylistsRoute,
        artist: isArtistRoute,
        album: isArtistRoute && artistRouteParams.album !== undefined,
      },
      path: location,
      params,
    },
  };
};
