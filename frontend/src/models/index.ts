export interface Metadata {
  number?: number;
  title?: string;
  album?: string;
  artists?: string[];
  year?: number;
  genre?: string[];
  duration?: number;
  path: string;
  albumPath: string;
}

export type AlbumResponse = Record<string, Metadata[]>;

export interface AlbumData {
  title: string;
  artists: string[];
  year?: number;
  path: string;
}
