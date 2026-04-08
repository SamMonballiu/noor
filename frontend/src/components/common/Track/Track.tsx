import React, { type FC } from "react";
import { FaPlay } from "react-icons/fa";
import { useRouting } from "../../../hooks/useRouting";
import type { Metadata } from "../../../models";
import cx from "classnames";
import styles from "./Track.module.scss";
import { ImagePreview } from "../ImagePreview/ImagePreview";

type TrackProps = Metadata & {
  className?: string;
  onClick?: () => void;
  onDoubleClick?: () => void;
  isSelected?: boolean;
  showArtist: boolean;
  showNumber?: boolean;
  showCover?: boolean;
  titleFallback?: string;
};

export const Track: FC<TrackProps> = ({
  className,
  albumPath,
  number,
  title,
  artists,
  onClick,
  onDoubleClick,
  isSelected,
  showArtist,
  showNumber = false,
  showCover = false,
  titleFallback,
}) => {
  const { navigate } = useRouting();
  return (
    <div
      className={cx(className, styles.track)}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
    >
      {showNumber ? (
        <div className={styles.number}>
          {isSelected ? (
            <FaPlay onClick={onDoubleClick} />
          ) : (
            <span>{number}</span>
          )}
        </div>
      ) : null}
      {showCover && <ImagePreview className={styles.cover} path={albumPath} />}
      <div>
        <div className={styles.title}>
          <span>{title ?? titleFallback}</span>
        </div>
        {showArtist
          ? artists?.map((x, idx, arr) => (
              <React.Fragment key={idx}>
                <span
                  className={styles.artists}
                  onClick={() => navigate.toArtist(x)}
                >
                  {x}
                </span>
                {idx < arr.length - 1 && (
                  <span className={styles.artists}>, </span>
                )}
              </React.Fragment>
            ))
          : null}
      </div>
    </div>
  );
};
