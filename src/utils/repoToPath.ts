import { IRepository } from "../services/issuesData";

export const repoToPath = (repository: IRepository) =>
  `${repository.org}/${repository.name}`;
