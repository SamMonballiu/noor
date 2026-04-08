import { Query, QueryHandler, QueryResult } from "@queries/base";
import { DataContext } from "models/dataContext";
import { Metadata } from "models/metadata";
import { Playlist } from "models/playlist";

export class PlaylistsQuery implements Query {}

type HydratedPlaylist = Omit<Playlist, "itemPaths"> & { items: Metadata[] };

export class PlaylistsQueryHandler implements QueryHandler<PlaylistsQuery> {
  canHandle = (query: Query) => query instanceof PlaylistsQuery;

  public async handle(_: PlaylistsQuery, dataContext: DataContext) {
    const result = dataContext.repositories.models.playlists.getAll().map(
      (pl) =>
        ({
          id: pl.id,
          name: pl.name,
          items: dataContext.mediaFiles.filter((x) =>
            pl.itemPaths.includes(x.path),
          ),
        }) as HydratedPlaylist,
    );
    return QueryResult.Success(result);
  }
}
