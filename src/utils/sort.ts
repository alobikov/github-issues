import { ISortColumn } from "../App";
import { IssuesDataFromServer } from "../types/issue";

type SortType = "created_at" | "updated_at" | "comments";
type DirectionType = "asc" | "desc";

const sortKeys = {
  created: "created_at",
  updated: "updated_at",
  comments: "comments",
} as const;

export const sortBy = (
  items: IssuesDataFromServer[],
  { sort, direction }: ISortColumn
): IssuesDataFromServer[] => {
  const sortedItems = items;
  sortedItems.sort((a, b) => compare(a, b, sortKeys[sort], direction));
  return sortedItems;
};

function compare(
  a: IssuesDataFromServer,
  b: IssuesDataFromServer,
  sort: SortType,
  direction: DirectionType
) {
  return direction === "asc"
    ? Number(a[sort]) - Number(b[sort])
    : Number(b[sort]) - Number(a[sort]);
}
