import type { DefaultParams } from "wouter";

export interface RouteMap {
  home: string;
  albums: string;
}

export const routes: RouteMap = {
  home: "/",
  albums: "/albums/:album?",
};

export interface RouteParams extends DefaultParams {}

export interface AlbumRouteParams extends RouteParams {
  album: string;
}
