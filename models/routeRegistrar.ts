import { Router } from "express";
import { DataContext } from "./dataContext";
import { QueryResolver } from "@queries/base";

export type RouteRegistrar = (
  router: Router,
  dataContext: DataContext,
  queryResolver: QueryResolver,
) => void;
