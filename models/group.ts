import { Metadata } from "./metadata";

export const group = {
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
