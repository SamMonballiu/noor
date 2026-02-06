import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { AlbumResponse } from "./models";

export const useAlbumsQuery = (callback: (data: AlbumResponse) => void) =>
  useQuery<AlbumResponse>({
    staleTime: Infinity,
    queryKey: ["albums"],
    queryFn: async () => {
      const response = await axios.get<AlbumResponse>(
        "http://raspberrypi:54321/api/albums",
      );
      callback(response.data);
      return response.data;
    },
  });
