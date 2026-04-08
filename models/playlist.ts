import { Entity } from "./entity";
import { Metadata } from "./metadata";

export interface Playlist extends Entity<string> {
  name: string;
  items: Metadata[];
}
