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

export interface RouteParams extends DefaultParams {}

export interface ArtistAlbumRouteParams extends RouteParams {
  artist: string;
  album?: string;
}
