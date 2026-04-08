import { Router } from "express";
import { DataContext } from "./dataContext";
import { QueryResolver } from "@queries/base";
import { CommandBus } from "backend/commands/base";

export type RegistrarArgs = {
  router: Router;
  dataContext: DataContext;
  queryResolver: QueryResolver;
  commandBus: CommandBus;
};

export type RouteRegistrar = (args: RegistrarArgs) => void;
