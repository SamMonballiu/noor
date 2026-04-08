import {
  Repository,
  RepositoryContext as LibRepositoryContext,
} from "json-repo";
import { Entity } from "models/entity";
import { Playlist } from "models/playlist";
import { v4 as uuidv4 } from "uuid";

export class RepositoryContext extends LibRepositoryContext {
  constructor(dataPath: string) {
    super(dataPath);
  }

  models = {
    playlists: new CustomRepository<Playlist>(),
  };
}

export const setId = (entity: Entity<string>) => {
  entity.id = uuidv4();
};

class CustomRepository<T> extends Repository<T> {
  constructor() {
    super();
  }

  public getAll(): T[] {
    return this.filter((_: T) => true);
  }
}
