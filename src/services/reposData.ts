import { http } from "./http";
import { IRepository } from "./issuesData";

export interface RepoDataFromServer {
  message?: string;
}

export const checkRepository = async (repo: IRepository): Promise<boolean> => {
  const path = `/repos/${repo.org}/${repo.name}`;
  const result = await http<RepoDataFromServer>({ path, skipError: true });
  if (result.ok && result.body) {
    return true;
  } else {
    return false;
  }
};
