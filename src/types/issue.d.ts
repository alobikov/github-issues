export interface IIssue {
  id: number;
  title: string;
  state: string;
  number: number;
  user: { login: string };
  created_at: string;
  updated_at: string;
  comments: number;
  body: string;
}

export interface IssueDataFromServer {
  id: number;
  title: string;
  state: string;
  number: number;
  user: { login: string };
  created_at: string;
  updated_at: string;
  comments: number;
  pull_request?: {};
  body: string;
}

export interface IssuesData {
  issues: IssueDataFromServer[];
  lastPage: number;
}
