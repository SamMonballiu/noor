import { Response } from "express";
import { AlbumsQueryHandler } from "features/albums/get/getAlbumsQuery";
import { PlaylistsMetadataQueryHandler } from "features/playlists/get/getPlaylistsMetadataQuery";
import { SinglePlaylistQueryHandler } from "features/playlists/get/getSinglePlaylistQuery";
import { DataContext } from "models/dataContext";

export interface Query {}

export interface QueryHandler<T extends Query> {
  handle: (query: T, context: DataContext) => Promise<QueryResult<any>>;
  canHandle: (query: T) => boolean;
}

type QueryResultType = "success" | "error" | "notfound";

export class QueryResult<T> {
  public type: QueryResultType;
  public message?: string;
  public response?: T;

  private constructor(type: QueryResultType, message?: string, response?: T) {
    this.type = type;
    this.message = message;
    this.response = response;
  }

  public static Success(response: any) {
    return new QueryResult("success", undefined, response);
  }

  public static Error(message: string) {
    return new QueryResult("error", message);
  }

  public static NotFound() {
    return new QueryResult("notfound");
  }
}

export class QueryResolver {
  private readonly context: DataContext;
  private handlers: QueryHandler<any>[] = [
    new AlbumsQueryHandler(),
    new PlaylistsMetadataQueryHandler(),
    new SinglePlaylistQueryHandler(),
  ];

  constructor(context: DataContext) {
    this.context = context;
  }

  private async resolveQuery(query: Query): Promise<QueryResult<any>> {
    const handler = this.handlers.find((x) => x.canHandle(query));

    return handler !== undefined
      ? handler.handle(query, this.context)
      : QueryResult.Error("Couldn't find a handler for a query of this type");
  }

  public async resolve(query: Query, res: Response) {
    const result = await this.resolveQuery(query);
    handleQueryResult(result, res);
  }
}

type QueryResultHandler = (result: QueryResult<any>, res: Response) => void;

const handleQueryResult: QueryResultHandler = (
  result: QueryResult<any>,
  res: Response,
) => {
  switch (result.type) {
    case "success":
      res.status(200).send(result.response);
      break;
    case "notfound":
      res.status(404);
    case "error":
      res.status(500).send(result); //TODO make an ErrorResponse or something
      break;
  }
};
