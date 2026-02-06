import styles from "./ImagePreview.module.scss";
import { useEffect, useState, type FC } from "react";
import { useInView } from "react-intersection-observer";
import cx from "classnames";
import { useQueryClient } from "@tanstack/react-query";
import { Loading } from "../Loading/Loading";
import { useAlbumCoverQuery } from "../../query";

interface Props {
  path: string;
  dimension?: number;
  quality?: number;
  square?: boolean;
  className?: string;
}

export const ImagePreview: FC<Props> = ({ path, className }) => {
  const { ref, inView } = useInView();
  const queryClient = useQueryClient();
  const [hasBeenInView, setHasBeenInView] = useState(false);

  useEffect(() => {
    queryClient.cancelQueries({
      queryKey: ["thumbnail", path],
    });
  }, []);

  useEffect(() => {
    if (inView && !hasBeenInView) {
      setHasBeenInView(true);
    }
  }, [inView, hasBeenInView]);

  const { data: imageData, isFetching: isFetchingImage } = useAlbumCoverQuery(
    path,
    hasBeenInView,
  );

  return (
    <div className={cx(styles.container, className)} ref={ref}>
      {isFetchingImage ? (
        <Loading className={styles.preview} />
      ) : (
        <img src={imageData} className={styles.image} />
      )}
    </div>
  );
};
