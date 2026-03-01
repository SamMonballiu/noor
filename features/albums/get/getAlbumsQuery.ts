import { Query, QueryHandler, QueryResult } from "@queries/base";
import { DataContext } from "models/dataContext";
import { group } from "models/group";
import { Metadata } from "models/metadata";

export class AlbumsQuery implements Query {
  public readonly searchTerm?: string;

  constructor(searchTerm?: string) {
    this.searchTerm = searchTerm;
  }
}

export class AlbumsQueryHandler implements QueryHandler<AlbumsQuery> {
  canHandle = (query: Query) => query instanceof AlbumsQuery;

  private filter(tracks: Metadata[], searchTerm?: string) {
    if (!searchTerm) {
      return tracks;
    }

    const match = (...properties: (string | undefined)[]): boolean => {
      return properties
        .filter((p) => p !== undefined)
        .map((p) => (p ?? "").toLowerCase())
        .some((p) => p.includes(searchTerm!.toLowerCase()));
    };

    return tracks.filter((tr) =>
      match(tr.album, tr.title, ...(tr.artists ?? [])),
    );
  }

  public async handle(query: AlbumsQuery, dataContext: DataContext) {
    const grouped = group.byAlbum(
      this.filter(dataContext.mediaFiles, query.searchTerm),
    );
    return QueryResult.Success(grouped);
  }
}
