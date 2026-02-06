import * as dotenv from "dotenv";
dotenv.config();
import express, { Response } from "express";
import cors from "cors";
const { fdir } = require("fdir");
import { parseFile } from "music-metadata";
import { Metadata } from "./models/metadata";
import { mapGetAlbumsRoute } from "./features/albums/get/getAlbumsRoute";
import { DataContext } from "./models/dataContext";

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

const apiRouter = express.Router();
app.use("/api", apiRouter);

const dataContext: DataContext = {
  mediaFiles: [],
};

mapGetAlbumsRoute(apiRouter, dataContext);

app.listen(port, async () => {
  console.log(`Server started on port ${port}.`);

  const folder = process.env.MEDIA_PATH;
  const directoryCrawler = new fdir()
    .withMaxDepth(1)
    .withRelativePaths()
    .crawl(folder);

  const crawled = directoryCrawler.sync();
  const extensions = [".mp3", ".ogg"];
  const filtered = crawled.filter((path: string) =>
    extensions.some((ext) => path.endsWith(ext)),
  );

  console.log(`Parsing ${filtered.length} files.`);

  for (const filePath of filtered) {
    const fullPath = `${folder}/${filePath}`;
    const metadata = await parseFile(fullPath, {
      skipCovers: true,
    });
    dataContext.mediaFiles.push({
      number: metadata.common.track.no ?? undefined,
      title: metadata.common.title,
      album: metadata.common.album,
      artists: metadata.common.artists,
      year: metadata.common.year ?? undefined,
      genre: metadata.common.genre,
      duration: metadata.format.duration,
      path: fullPath,
      albumPath: fullPath.split("/").slice(0, -1).join("/"),
    });
  }
  console.log("Done.");
});
