import { Response, Request } from "express";
import { RouteRegistrar } from "../../../models/routeRegistrar";
import fs from "fs";
import path from "path";

export const mapGetAudioRoute: RouteRegistrar = (router, dataContext) => {
  router.get("/audio", async (req: Request, res: Response) => {
    const trackPath = req.query.path as string;

    if (!trackPath) {
      return res.status(400).send("Missing path parameter");
    }

    // Validate that the requested file is in our media library
    const track = dataContext.mediaFiles.find((f) => f.path === trackPath);
    if (!track) {
      return res.status(404).send("Track not found");
    }

    const baseUrl = process.env.MEDIA_PATH!;
    const joinedPath = path.join(baseUrl, trackPath);

    const stat = fs.statSync(joinedPath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      // Handle range requests for seeking
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunkSize = end - start + 1;

      const stream = fs.createReadStream(joinedPath, { start, end });
      const ext = path.extname(joinedPath).toLowerCase();
      const contentType = ext === ".ogg" ? "audio/ogg" : "audio/mpeg";

      res.writeHead(206, {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunkSize,
        "Content-Type": contentType,
      });

      stream.pipe(res);
    } else {
      // No range header - send entire file
      const ext = path.extname(joinedPath).toLowerCase();
      const contentType = ext === ".ogg" ? "audio/ogg" : "audio/mpeg";

      res.writeHead(200, {
        "Content-Length": fileSize,
        "Content-Type": contentType,
      });

      fs.createReadStream(joinedPath).pipe(res);
    }
  });
};
