import { http, QueryParams } from "./http";
import { IIssue, IssuesData, IssueDataFromServer } from "../types/issue";
import parseLink from "parse-link-header";
import { PAGE_SIZE } from "../config/appSettings";

export interface IRepository {
  name: string;
  org: string;
  repositoryValid: boolean;
}

const extractLastPage = (headers: Headers): number => {
  const link = headers.get("link");
  if (!link) return 1;
  const result = parseLink(link)?.last?.page || "1";
  return Number(result); // if no Link in the header return 1
};

export const getIssues = async (
  repo: IRepository,
  params: QueryParams
): Promise<IssuesData | null> => {
  const path = `/repos/${repo.org}/${repo.name}/issues`;
  const extendedParams = { ...params, per_page: PAGE_SIZE.toString() };
  const result = await http<IssueDataFromServer[]>({
    path,
    params: extendedParams,
  });
  if (result.ok && result.body) {
    return {
      issues: result.body,
      lastPage: result.headers ? extractLastPage(result.headers) : 1,
    };
  } else {
    return null;
  }
};

export const getIssueById = async (
  repo: IRepository,
  id: string
): Promise<IssueDataFromServer | null> => {
  const path = `/repos/${repo.org}/${repo.name}/issues/${id}`;
  const result = await http<IssueDataFromServer>({ path });
  if (result.ok && result.body) {
    return result.body;
  } else {
    return null;
  }
};

export const getIssuesByIds = async (repo: IRepository, ids: string[]) => {
  return Promise.all(
    ids.map(async (id) => {
      const data = await getIssueById(repo, id);
      return data as IIssue;
    })
  );
};
