import { RepositoryContext } from "backend/context/repositoryContext";
import { Metadata } from "./metadata";

export interface DataContext {
  mediaFiles: Metadata[];
  repositories: RepositoryContext;
}

export const getFileBySize = (context: DataContext, size: number) => {
  return context.mediaFiles.find((x) => x.size === size);
};
