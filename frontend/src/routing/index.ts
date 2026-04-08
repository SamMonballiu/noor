import type { DefaultParams } from "wouter";

export interface RouteMap {
  home: string;
  allAlbums: string;
  playlist: string;
  artist: string;
}

export const routes: RouteMap = {
  home: "/",
  allAlbums: "/albums",
  playlist: "/playlists/:id?",
  artist: "/:artist/:album?",
};

export const reservedPaths = ["albums", "playlists"];

export const isValidArtistRoute = (path: string): boolean => {
  // valid: /artist/album, /artist, /artist/
  // invalid: /albums, /artist/album/extra
  const match = path.match(/^\/([^/]+)(\/(.+))?\/?$/);
  if (!match) return false;
  const [, artist] = match;
  return !reservedPaths.includes(artist);
};

export interface RouteParams extends DefaultParams {}

export interface ArtistAlbumRouteParams extends RouteParams {
  artist: string;
  album?: string;
}

export interface PlaylistRouteParams extends RouteParams {
  id?: string;
}
