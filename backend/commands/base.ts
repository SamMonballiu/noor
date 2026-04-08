import { RepositoryContext } from "backend/context/repositoryContext";
import { Response } from "express";
import { CreatePlaylistCommandHandler } from "features/playlists/create/createPlaylistCommand";

export interface Command {}

export interface CommandHandler<T extends Command> {
  handle: (command: T) => Promise<CommandHandleResult>;
  canHandle: (command: T) => boolean;
}

export interface CommandValidator<T extends Command> {
  validate: (command: T) => CommandValidateResult;
  canValidate: (command: T) => boolean;
}

export enum CommandHandleResultType {
  None,
  Success,
  NotFound,
  ValidationError,
  Error,
}
export class CommandHandleResult {
  public type: CommandHandleResultType;
  public message?: string;

  private constructor(type: CommandHandleResultType, message?: string) {
    this.type = type;
    this.message = message;
  }

  public static get Success() {
    return new CommandHandleResult(CommandHandleResultType.Success);
  }

  public static NotFound(message?: string) {
    return new CommandHandleResult(CommandHandleResultType.NotFound, message);
  }

  public static ValidationError(message: string) {
    return new CommandHandleResult(
      CommandHandleResultType.ValidationError,
      message,
    );
  }

  public static Error(message: string) {
    return new CommandHandleResult(CommandHandleResultType.Error, message);
  }
}

export class CommandValidateResult {
  public errors: string[];

  public constructor(errors: string[]) {
    this.errors = errors;
  }

  public get isSuccess() {
    return this.errors.length === 0;
  }
}

export class CommandBus {
  private readonly context: RepositoryContext;
  private validators: CommandValidator<any>[] = [];
  private handlers: CommandHandler<any>[] = [];

  constructor(context: RepositoryContext) {
    this.context = context;

    this.context.initialize().then(() => {
      this.validators = [];

      this.handlers = [new CreatePlaylistCommandHandler(this.context)];
    });
  }

  public async execute(command: Command): Promise<CommandHandleResult> {
    const validator = this.validators.find((x) => x.canValidate(command));
    const handler = this.handlers.find((x) => x.canHandle(command));

    if (validator !== undefined) {
      const { errors, isSuccess } = validator.validate(command);
      if (!isSuccess) {
        return CommandHandleResult.ValidationError(errors.join("\n"));
      }
    }

    return handler !== undefined
      ? handler.handle(command)
      : CommandHandleResult.Error(
          "Couldn't find a handler for a command of this type.",
        );
  }

  public async handle(command: Command, res: Response) {
    const result = await this.execute(command);
    handleResult(result, res);
  }
}

type CommandResultHandler = (
  result: CommandHandleResult,
  res: Response,
) => void;

export const handleResult: CommandResultHandler = (
  result: CommandHandleResult,
  res: Response,
) => {
  const { Success, NotFound, ValidationError, Error } = CommandHandleResultType;
  switch (result.type) {
    case Success:
      res.status(200).send();
      break;
    case NotFound:
      res.status(404).send(result.message);
      break;
    case ValidationError:
      res.status(400).send(result.message);
      break;
    case Error:
      res.status(500).send(result.message);
      break;
  }
};
