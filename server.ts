import * as dotenv from "dotenv";
dotenv.config();
import express, { Response } from "express";
import cors from "cors";
const { fdir } = require("fdir");
import { parseFile } from "music-metadata";
import { Metadata } from "./models/metadata";

const port = 54321;

const app = express();
app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: function (origin, callback) {
      return callback(null, true);
    },
    optionsSuccessStatus: 200,
    credentials: true,
  }),
);

const mediaFiles: Metadata[] = [];

const group = {
  byAlbum: (metadata: Metadata[]): Record<string, Metadata[]> =>
    metadata.reduce(
      (acc, val) => {
        const album = val.album ?? "none";
        acc[album] ??= [] as Metadata[];
        acc[album].push(val);

        return acc;
      },
      {} as Record<string, Metadata[]>,
    ),
};

app.get("/test", async (_, res: Response) => {
  res.send(group.byAlbum(mediaFiles));
});

app.listen(port, async () => {
  console.log(`Server started on port ${port}.`);

  const folder = process.env.MEDIA_PATH;
  const directoryCrawler = new fdir()
    .withMaxDepth(1)
    .withRelativePaths()
    .crawl(folder);

  const crawled = directoryCrawler.sync();
  const filtered = crawled.filter((path: string) => path.endsWith(".mp3"));

  console.log(`Parsing ${filtered.length} files.`);

  for (const filePath of filtered) {
    if (filePath.endsWith(".mp3")) {
      const fullPath = `${folder}/${filePath}`;
      const metadata = await parseFile(fullPath, {
        skipCovers: true,
      });
      mediaFiles.push({
        number: metadata.common.track.no ?? undefined,
        title: metadata.common.title,
        album: metadata.common.album,
        artists: metadata.common.artists,
        year: metadata.common.year ?? undefined,
        genre: metadata.common.genre,
        duration: metadata.format.duration,
        path: fullPath,
      });
    }
  }
  console.log("Done.");
});
