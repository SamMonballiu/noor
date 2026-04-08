import { RepositoryContext } from "backend/context/repositoryContext";
import { Metadata } from "./metadata";

export interface DataContext {
  mediaFiles: Metadata[];
  repositories: RepositoryContext;
}
