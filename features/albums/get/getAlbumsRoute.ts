import { Request, Response } from "express";
import { RouteRegistrar } from "../../../models/routeRegistrar";
import { AlbumsQuery } from "./getAlbumsQuery";

export const mapGetAlbumsRoute: RouteRegistrar = ({
  router,
  queryResolver,
}) => {
  router.get("/albums", async (req: Request, res: Response) =>
    queryResolver.resolve(
      new AlbumsQuery(req.query["searchTerm"] as string),
      res,
    ),
  );
};
