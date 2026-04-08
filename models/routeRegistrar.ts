import { Router } from "express";
import { DataContext } from "./dataContext";
import { QueryResolver } from "@queries/base";
import { CommandBus } from "backend/commands/base";

export type RouteRegistrar = (
  router: Router,
  dataContext: DataContext,
  queryResolver: QueryResolver,
  commandBus: CommandBus,
) => void;
