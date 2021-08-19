export interface IIssue {
  id: number;
  title: string;
  state: string;
  number: number;
  user: { login: string };
  created_at: string;
  updated_at: string;
  comments: string;
}

export interface IssueDataFromServer {
  id: number;
  title: string;
  state: string;
  number: number;
  user: { login: string };
  created_at: string;
  updated_at: string;
  comments: string;
}

export interface IssuesData {
  issues: IssueDataFromServer[];
  lastPage: number;
}
