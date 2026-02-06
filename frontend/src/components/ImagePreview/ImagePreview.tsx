import styles from "./ImagePreview.module.scss";
import { useEffect, useState, type FC } from "react";
import { useInView } from "react-intersection-observer";
import axios from "axios";
import cx from "classnames";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loading } from "../Loading/Loading";

interface Props {
  path: string;
  dimension?: number;
  quality?: number;
  square?: boolean;
  className?: string;
}

const prefix = import.meta.env.DEV ? "http://raspberrypi:54321" : undefined;

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

  const { data: imageData, isFetching: isFetchingImage } = useQuery({
    queryKey: ["thumbnail", path],
    queryFn: async ({ signal }) => {
      const fetchUrl = `${prefix}/api/cover?albumPath=${encodeURIComponent(path)}`;
      const response = (
        await axios.get(fetchUrl, { responseType: "blob", signal })
      ).data;
      const imageObjectUrl = URL.createObjectURL(response);
      return imageObjectUrl;
    },
    staleTime: Infinity,
    enabled: hasBeenInView,
  });

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
