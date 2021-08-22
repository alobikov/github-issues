import { http } from "./http";
import { IRepository } from "./issuesData";

export interface RepoDataFromServer {
  message?: string;
}

export const checkRepository = async (
  repoFullName: string
): Promise<boolean> => {
  const path = `/repos/${repoFullName}`;
  const result = await http<RepoDataFromServer>({ path, skipError: true });
  if (result.ok && result.body) {
    return true;
  } else {
    return false;
  }
};
