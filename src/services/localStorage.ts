import { IRepository } from "./issuesData";
import { repoToPath } from "../utils/repoToPath";

export const saveToStorage = (repository: IRepository, ids: string[]) => {
  localStorage.setItem(repoToPath(repository), ids.toString());
};

export const loadFromStorage = (repository: IRepository): string[] | null => {
  const result = localStorage.getItem(repoToPath(repository));
  return result ? result.split(",") : null;
};
