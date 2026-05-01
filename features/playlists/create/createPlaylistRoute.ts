import { RouteRegistrar } from "models/routeRegistrar";
import { Request, Response } from "express";
import { Playlist } from "models/playlist";
import { CreatePlaylistCommand } from "./createPlaylistCommand";

type PlaylistPostmodel = Omit<Playlist, "id" | "itemSizes"> & {
  itemPaths: string[];
};

export const mapCreatePlaylistRoute: RouteRegistrar = ({
  router,
  commandBus,
}) => {
  router.post("/playlists", async (req: Request, res: Response) => {
    const postmodel = req.body as PlaylistPostmodel;

    await commandBus.handle(
      new CreatePlaylistCommand(postmodel.name, postmodel.itemPaths),
      res,
    );
  });
};
