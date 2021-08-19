import { ISortColumn } from "../App";
import { IssueDataFromServer } from "../types/issue";

type SortType = "created_at" | "updated_at" | "comments";
type DirectionType = "asc" | "desc";

const sortKeys = {
  created: "created_at",
  updated: "updated_at",
  comments: "comments",
} as const;

export const sortBy = (
  items: IssueDataFromServer[],
  { sort, direction }: ISortColumn
): IssueDataFromServer[] => {
  const sortedItems = items;
  sortedItems.sort((a, b) => compare(a, b, sortKeys[sort], direction));
  return sortedItems;
};

function compare(
  a: IssueDataFromServer,
  b: IssueDataFromServer,
  sort: SortType,
  direction: DirectionType
) {
  const convert =
    sort === "comments"
      ? (s: string) => Number(s)
      : (s: string) => Date.parse(s);
  return direction === "asc"
    ? convert(a[sort]) - convert(b[sort])
    : convert(b[sort]) - convert(a[sort]);
}
