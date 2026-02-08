import { type FC } from "react";
import styles from "./Artists.module.scss";
import React from "react";
import { getMainArtist } from "../../models/util";
import cx from "classnames";

interface Props {
  artists: Record<string, number>;
  onClick?: (artist: string) => void;
  show?: "all" | "onlymain" | "abbreviated";
}

export const Artists: FC<Props> = ({
  artists,
  onClick,
  show = "abbreviated",
}) => {
  const mainArtist = getMainArtist(artists);

  const allArtists = getArtists(artists);

  const collection = show === "all" ? allArtists : [mainArtist];

  return (
    <div>
      {collection.map((artist, index, array) => (
        <React.Fragment key={artist}>
          <Artist
            name={artist!}
            onClick={onClick ? () => onClick(artist!) : undefined}
          />
          {index < array.length - 1 && ", "}
        </React.Fragment>
      ))}
      {show === "abbreviated" && allArtists.length > 1 ? (
        <span className={styles.abbrev}>
          {" "}
          and {allArtists.length - 1} others
        </span>
      ) : null}
    </div>
  );
};

const Artist: FC<{ name: string; onClick?: () => void }> = ({
  name,
  onClick,
}) => {
  return (
    <span
      onClick={onClick}
      className={cx({ [styles.clickable]: onClick !== undefined })}
    >
      {name}
    </span>
  );
};

const getArtists = (artists: Record<string, number>) => {
  return Object.keys(artists).sort((a, b) => byOccurrences(a, b, artists));
};

const byOccurrences = (
  a: string,
  b: string,
  artists: Record<string, number>,
) => {
  return artists[b] - artists[a];
};
