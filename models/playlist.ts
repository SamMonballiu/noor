import { Entity } from "./entity";

export interface Playlist extends Entity<string> {
  name: string;
  itemPaths: string[];
}
