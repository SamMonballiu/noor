import { Router } from "express";
import { DataContext } from "./dataContext";

export type RouteRegistrar = (router: Router, dataContext: DataContext) => void;
