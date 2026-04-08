import { RouteRegistrar } from "models/routeRegistrar";
import { Request, Response } from "express";
import { PlaylistsQuery } from "./getPlaylistsQuery";

export const mapGetPlaylistsRoute: RouteRegistrar = (
  router,
  _,
  queryResolver,
) => {
  router.get("/playlists", async (req: Request, res: Response) =>
    queryResolver.resolve(new PlaylistsQuery(), res),
  );
};
