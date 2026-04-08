import { Request, Response } from "express";
import { RouteRegistrar } from "models/routeRegistrar";
import { SinglePlaylistQuery } from "./getSinglePlaylistQuery";

export const mapGetSinglePlaylistRoute: RouteRegistrar = (
  router,
  _,
  queryResolver,
) => {
  router.get("/playlists/:id", async (req: Request, res: Response) =>
    queryResolver.resolve(
      new SinglePlaylistQuery(req.params["id"].toString()),
      res,
    ),
  );
};
