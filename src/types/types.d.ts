export type BookmarksType = {
  [issueNumber: string]: boolean;
};

export interface IRepository {
  full_name: string;
  repositoryValid: boolean;
  response: string;
}
