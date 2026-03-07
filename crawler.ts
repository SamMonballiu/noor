const { fdir } = require("fdir");
import { parseFile } from "music-metadata";
import fs from "fs";
import * as dotenv from "dotenv";
dotenv.config();

const getTracks = async () => {
  const folder = process.env.MEDIA_PATH;
  //TODO exit if no folder
  const directoryCrawler = new fdir()
    .withMaxDepth(10)
    .withRelativePaths()
    .crawl(folder);

  const crawled = directoryCrawler.sync();
  const extensions = [".mp3", ".ogg"];
  const filtered = crawled.filter((path: string) =>
    extensions.some((ext) => path.endsWith(ext)),
  );

  const sanitize = (path: string) => path.replace(folder!, "");

  console.log(`Parsing ${filtered.length} files in ${folder}...`);
  const results: any[] = [];

  for (let i = 0; i < filtered.length; i++) {
    const filePath = filtered[i];

    const fullPath = `${folder}/${filePath}`;
    parseFile(fullPath, {
      skipCovers: true,
    }).then((metadata) => {
      results.push({
        number: metadata.common.track.no ?? undefined,
        title: metadata.common.title,
        album: metadata.common.album,
        artists: metadata.common.artists,
        year: metadata.common.year ?? undefined,
        genre: metadata.common.genre,
        duration: metadata.format.duration,
        path: sanitize(fullPath),
        albumPath: sanitize(fullPath.split("/").slice(0, -1).join("/")),
      });

      if (results.length % 200 === 0) {
        console.log(results.length);
      }

      if (i === filtered.length - 1) {
        console.log("Writing.");
        fs.writeFileSync("./tracks.json", JSON.stringify(results));
      }
    });
  }
};

getTracks();
