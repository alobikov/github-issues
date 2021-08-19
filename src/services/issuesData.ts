import { http } from "./http";
import { IIssue, IssuesData, IssuesDataFromServer } from "../types/issue";
import parseLink from "parse-link-header";

interface IRepository {
  name: string;
  org: string;
}

const extractLastPage = (headers: Headers): number => {
  const link = headers.get("link");
  if (!link) return 1;
  const result = parseLink(link)?.last?.page || "1";
  return Number(result); // if no Link in the header return 1
};

export const getIssues = async (
  repo: IRepository
): Promise<IssuesData | null> => {
  const result = await http<IssuesDataFromServer[]>({
    path: `/repos/${repo.org}/${repo.name}/issues`,
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

export const loadAll = async (url: string) => {
  const response = await fetch(url, {
    headers: {
      accept: "application/vnd.github.v3+json",
    },
  });
  if (response.ok) {
    const data: IIssue[] = await response.json();
    const link: string = response.headers.get("link") || "";
    return { data, link };
  } else {
    throw new Error("Network response not OK");
  }
};

const loadId = async (url: string) => {
  const response = await fetch(url, {
    headers: {
      accept: "application/vnd.github.v3+json",
    },
  });
  if (response.ok) {
    const data: {} = await response.json();
    const link: string = response.headers.get("link") || "";
    return data as IIssue;
  } else {
    throw new Error("Network response not OK");
  }
};

export const loadIds = async (url: string, ids: number[]) => {
  return Promise.all(
    ids.map(async (id) => {
      const fullUrl = `${url}/${id.toString()}`;
      const data = await loadId(fullUrl);
      return data as IIssue;
    })
  );
};
