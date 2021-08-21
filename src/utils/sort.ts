import { ISortColumn } from "../components/TableHeader";
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
  if (sort === "comments") {
    return direction === "asc" ? a[sort] - b[sort] : b[sort] - a[sort];
  } else {
    return direction === "asc"
      ? Date.parse(a[sort]) - Date.parse(b[sort])
      : Date.parse(b[sort]) - Date.parse(a[sort]);
  }
}
