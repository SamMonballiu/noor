import { useLocation } from "wouter";
import type { RouteParams } from "../routing";

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

  return {
    navigate: {
      to: navigateTo,
      getRoute,
    },
  };
}
