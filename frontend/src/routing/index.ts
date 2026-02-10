import type { DefaultParams } from "wouter";

export interface RouteMap {
  home: string;
  allAlbums: string;
  artist: string;
}

export const routes: RouteMap = {
  home: "/",
  allAlbums: "/albums",
  artist: "/:artist/:album?",
};

export const reservedPaths = ["albums"];

export const isValidArtistRoute = (path: string): boolean => {
  // valid: /artist/album, /artist
  // invalid: /albums, /artist/album/extra
  const match = path.match(/^\/([^/]+)(\/(.+))?$/);
  if (!match) return false;
  const [, artist] = match;
  return !reservedPaths.includes(artist);
};

export interface RouteParams extends DefaultParams {}

export interface ArtistAlbumRouteParams extends RouteParams {
  artist: string;
  album?: string;
}
