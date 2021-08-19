import { http } from "./http";
import { IIssue, IssuesData, IssuesDataFromServer } from "../types/issue";
import parseLink from "parse-link-header";

interface IRepository {
  name: string;
  org: string;
}

interface QueryParams {
  [name: string]: string;
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
  const result = await http<IssuesDataFromServer[]>({ path, params });
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
  id: number
): Promise<IssuesDataFromServer | null> => {
  const path = `/repos/${repo.org}/${repo.name}/issues/${id.toString()}`;
  const result = await http<IssuesDataFromServer>({ path });
  if (result.ok && result.body) {
    return result.body;
  } else {
    return null;
  }
};

export const getIssuesByIds = async (repo: IRepository, ids: number[]) => {
  return Promise.all(
    ids.map(async (id) => {
      const data = await getIssueById(repo, id);
      return data as IIssue;
    })
  );
};
