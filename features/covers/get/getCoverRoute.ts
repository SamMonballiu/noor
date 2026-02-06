import { Response, Request } from "express";
import { RouteRegistrar } from "../../../models/routeRegistrar";
import { generateThumbnail } from "./thumbnail";
const { fdir } = require("fdir");

export const mapGetCoverRoute: RouteRegistrar = (router) => {
  router.get("/cover", async (req: Request, res: Response) => {
    const path = req.query.albumPath;

    const crawler = new fdir().withMaxDepth(1).withRelativePaths().crawl(path);

    const files = crawler.sync();
    const coverFiles = files.filter((file: string) =>
      ["cover.jpg", "folder.jpg", "cover.png", "folder.png"].includes(
        file.toLowerCase(),
      ),
    );

    const getThumbnail = async (path: string) => {
      let thumbnail: Buffer;
      try {
        thumbnail = await generateThumbnail(
          path,
          { width: 800, height: 800 },
          75,
        );
      } catch (err) {
        console.log(err);
        thumbnail = Buffer.from([]);
      }

      return thumbnail;
    };

    if (coverFiles.length > 0) {
      const coverPath = `${path}/${coverFiles[0]}`;
      const thumbnail = await getThumbnail(coverPath);
      res.setHeader("content-type", "image/jpeg").status(200).send(thumbnail);
    } else {
      res.status(404).send("Cover not found");
    }
  });
};
