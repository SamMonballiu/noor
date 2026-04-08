import { Query, QueryHandler, QueryResult } from "@queries/base";
import { DataContext } from "models/dataContext";

export class PlaylistsQuery implements Query {}

export class PlaylistsQueryHandler implements QueryHandler<PlaylistsQuery> {
  canHandle = (query: Query) => query instanceof PlaylistsQuery;

  public async handle(_: PlaylistsQuery, dataContext: DataContext) {
    const result = dataContext.repositories.models.playlists.getAll();
    return QueryResult.Success(result);
  }
}
