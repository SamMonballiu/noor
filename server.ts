import * as dotenv from "dotenv";
dotenv.config();
import express, { Response } from "express";
import cors from "cors";
import { mapGetAlbumsRoute } from "./features/albums/get/getAlbumsRoute";
import { DataContext } from "./models/dataContext";
import { mapGetCoverRoute } from "./features/covers/get/getCoverRoute";
import path from "path";
import { mapGetAudioRoute } from "./features/audio/get/getAudioRoute";
import { QueryResolver } from "@queries/base";
import fs from "fs";
import chokidar from "chokidar";
import { RepositoryContext } from "backend/context/repositoryContext";
import { mapGetPlaylistsRoute } from "features/playlists/get/getPlaylistsRoute";

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

let dataContext: DataContext;
const repositories = new RepositoryContext("./data.json");

dataContext = {
  mediaFiles: [],
  repositories,
};

repositories.initialize().then(() => {
  const queryResolver = new QueryResolver(dataContext);

  mapGetAlbumsRoute(apiRouter, dataContext, queryResolver);
  mapGetCoverRoute(apiRouter, dataContext, queryResolver);
  mapGetAudioRoute(apiRouter, dataContext, queryResolver);
  mapGetPlaylistsRoute(apiRouter, dataContext, queryResolver);
});

// All other routes to be handled clientside
app.get("*", (_, res: Response) => {
  res.sendFile(path.join(__dirname, "/public", "index.html"));
});

app.listen(port, async () => {
  const filename = "tracks.json";
  const parseTracks = () => {
    const tracks = JSON.parse(fs.readFileSync(filename, { encoding: "utf8" }));
    dataContext.mediaFiles = tracks;
  };

  console.log(`Reading ${filename}...`);
  if (fs.existsSync(filename)) {
    parseTracks();
  } else {
    dataContext.mediaFiles = [];
  }

  const watcher = chokidar.watch(filename, {
    awaitWriteFinish: true,
    interval: 2000,
  });
  watcher.on("change", () => {
    console.log(`${filename} has been modified, repopulating.`);
    parseTracks();
  });

  console.log("Done.");
});
