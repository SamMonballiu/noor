import { Query, QueryHandler, QueryResult } from "@queries/base";
import { DataContext } from "models/dataContext";
import { Playlist } from "models/playlist";

export class PlaylistsMetadataQuery implements Query {}

type PlaylistMetadata = Omit<Playlist, "itemPaths"> & { itemsCount: number };

export class PlaylistsMetadataQueryHandler implements QueryHandler<PlaylistsMetadataQuery> {
  canHandle = (query: Query) => query instanceof PlaylistsMetadataQuery;

  public async handle(_: PlaylistsMetadataQuery, dataContext: DataContext) {
    const result = dataContext.repositories.models.playlists.getAll().map(
      (pl) =>
        ({
          id: pl.id,
          name: pl.name,
          itemsCount: pl.itemPaths.length,
        }) as PlaylistMetadata,
    );
    return QueryResult.Success(result);
  }
}
