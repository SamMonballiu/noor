import { Query, QueryHandler, QueryResult } from "@queries/base";
import { DataContext, getFileBySize } from "models/dataContext";
import { Metadata } from "models/metadata";

export class SinglePlaylistQuery implements Query {
  public readonly id: string;

  constructor(id: string) {
    this.id = id;
  }
}

export class SinglePlaylistQueryHandler implements QueryHandler<SinglePlaylistQuery> {
  canHandle = (query: Query) => query instanceof SinglePlaylistQuery;

  public async handle(query: SinglePlaylistQuery, dataContext: DataContext) {
    const playlist = dataContext.repositories.models.playlists.find(query.id);

    if (!playlist) {
      return QueryResult.NotFound();
    }

    return QueryResult.Success({
      id: playlist.id,
      name: playlist.name,
      items: playlist.itemSizes
        .map((size) => getFileBySize(dataContext, size))
        .filter((x) => x !== undefined) as Metadata[],
    });
  }
}
