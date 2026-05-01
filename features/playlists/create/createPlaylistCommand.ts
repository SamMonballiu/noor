import {
  Command,
  CommandHandler,
  CommandHandleResult,
} from "backend/commands/base";
import { RepositoryContext, setId } from "backend/context/repositoryContext";
import { DataContext } from "models/dataContext";
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
  private readonly dataContext: DataContext;

  constructor(dataContext: DataContext) {
    this.dataContext = dataContext;
  }

  canHandle = (command: Command) => command instanceof CreatePlaylistCommand;

  public async handle(command: CreatePlaylistCommand) {
    const playlist: Playlist = {
      id: "",
      name: command.name,
      itemSizes: command.itemPaths.reduce((acc, val) => {
        const item = this.dataContext.mediaFiles.find((x) => x.path === val);
        if (item) acc.push(item.size);
        return acc;
      }, [] as number[]),
    };

    setId(playlist);

    this.dataContext.repositories.models.playlists.add(playlist.id, playlist);
    await this.dataContext.repositories.saveChanges();
    return CommandHandleResult.Success;
  }
}
