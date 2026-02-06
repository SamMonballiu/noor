import { Response } from "express";
import { group } from "../../../models/group";
import { RouteRegistrar } from "../../../models/routeRegistrar";

export const mapGetAlbumsRoute: RouteRegistrar = (router, dataContext) => {
  router.get("/albums", async (_, res: Response) => {
    res.send(group.byAlbum(dataContext.mediaFiles));
  });
};
