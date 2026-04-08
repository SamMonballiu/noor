import { RouteRegistrar } from "models/routeRegistrar";
import { Response } from "express";
import { PlaylistsMetadataQuery } from "./getPlaylistsMetadataQuery";

export const mapGetPlaylistsMetadataRoute: RouteRegistrar = (
  router,
  _,
  queryResolver,
) => {
  router.get("/playlists", async (_, res: Response) =>
    queryResolver.resolve(new PlaylistsMetadataQuery(), res),
  );
};
