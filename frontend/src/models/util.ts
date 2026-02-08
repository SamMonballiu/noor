import type { Metadata } from ".";

export const getArtistsMap = (tracks: Metadata[]) => {
  return tracks
    .sort((a, b) => (a.number ?? 0) - (b.number ?? 0))
    .flatMap((t) => t.artists ?? [])
    .reduce(
      (acc, val) => {
        acc[val] ??= 0;
        acc[val]++;
        return acc;
      },
      {} as Record<string, number>,
    );
};

export const getMainArtist = (artists: Record<string, number>) => {
  let mainArtist = "";
  let maxCount = 0;
  for (const artist of Object.keys(artists)) {
    if (artists[artist] > maxCount) {
      mainArtist = artist;
      maxCount = artists[artist];
    }
  }
  return mainArtist;
};
