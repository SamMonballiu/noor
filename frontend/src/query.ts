import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { AlbumResponse } from "./models";

export const useAlbumsQuery = (searchTerm?: string) =>
  useQuery<AlbumResponse>({
    queryKey: ["albums", searchTerm],
    queryFn: async () => {
      const response = await axios.get<AlbumResponse>(
        `${import.meta.env.VITE_DEVPREFIX}/api/albums` +
          (searchTerm ? `?searchTerm=${searchTerm}` : ""),
      );
      return response.data;
    },
  });

export const useAlbumCoverQuery = (path: string, enabled?: boolean) =>
  useQuery({
    queryKey: ["thumbnail", path],
    queryFn: async ({ signal }) => {
      const fetchUrl = `${import.meta.env.VITE_DEVPREFIX}/api/cover?albumPath=${encodeURIComponent(path)}`;
      const response = (
        await axios.get(fetchUrl, { responseType: "blob", signal })
      ).data;
      const imageObjectUrl = URL.createObjectURL(response);
      return imageObjectUrl;
    },
    staleTime: Infinity,
    enabled,
    retryOnMount: false,
    retry: false,
  });
