export interface Metadata {
  number?: number;
  title?: string;
  album?: string;
  artists?: string[];
  year?: number;
  genre?: string[];
  duration?: number;
  path: string;
}

export type AlbumResponse = Record<string, Metadata[]>;
