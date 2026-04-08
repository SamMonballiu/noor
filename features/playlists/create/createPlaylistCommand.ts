import {
  Command,
  CommandHandler,
  CommandHandleResult,
} from "backend/commands/base";
import { RepositoryContext, setId } from "backend/context/repositoryContext";
import { Playlist } from "models/playlist";

export class CreatePlaylistCommand implements Command {
  public readonly name: string;
  public readonly itemPaths: string[];

  constructor(name: string, itemPaths: string[]) {
    this.name = name;
    this.itemPaths = itemPaths;
  }
}

export class CreatePlaylistCommandHandler implements CommandHandler<CreatePlaylistCommand> {
  private readonly dataContext: RepositoryContext;

  constructor(dataContext: RepositoryContext) {
    this.dataContext = dataContext;
  }

  canHandle = (command: Command) => command instanceof CreatePlaylistCommand;

  public async handle(command: CreatePlaylistCommand) {
    const playlist: Playlist = {
      id: "",
      name: command.name,
      itemPaths: command.itemPaths,
    };

    setId(playlist);

    this.dataContext.models.playlists.add(playlist.id, playlist);
    await this.dataContext.saveChanges();
    return CommandHandleResult.Success;
  }
}
