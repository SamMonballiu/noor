import { useLocation } from "wouter";
import { routes, type RouteParams } from "../routing";
// @ts-ignore;
import friendlyUrl from "friendly-url-extended";

const url = friendlyUrl;

export function useNavigation() {
  const [, setLocation] = useLocation();
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
  const navigateToAlbum = (artist: string, album: string) => {
    navigateTo(routes.artist, { artist: url(artist), album: url(album) });
  };

  return {
    navigate: {
      to: navigateTo,
      toAlbum: navigateToAlbum,
      toArtist: navigateToArtist,
      getRoute,
    },
  };
}
