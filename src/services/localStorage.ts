import { IRepository } from "./issuesData";

export const saveToStorage = (repoFullName: string, ids: string[]) => {
  localStorage.setItem(repoFullName, ids.toString());
};

export const loadFromStorage = (repoFullName: string): string[] | null => {
  const result = localStorage.getItem(repoFullName);
  return result ? result.split(",") : null;
};
