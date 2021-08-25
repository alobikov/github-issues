import { createAction } from "@reduxjs/toolkit";
import { ISortColumn } from "../../components/TableHeader";
import { FilterType } from "../issuesFilter";

interface IParams extends ISortColumn {
  page: string;
  per_page: string;
  state: FilterType;
}

interface LoadIssuesParams {
  params: IParams;
  repositoryFullName: string;
}

interface LoadIssuesByIdsParams {
  urls: string[];
}

export const loadIssues = createAction<LoadIssuesParams>("LOAD_ISSUES");

export const loadRepos = createAction<string>("LOAD_REPOS");

export const loadIssuesByIds =
  createAction<LoadIssuesByIdsParams>("LOAD_ISSUES_BY_IDS");
