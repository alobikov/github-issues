import React from "react";
import { TableRow } from "./TableRow";
import { IssueDataFromServer } from "../types/issue";
import { BookmarksType } from "../types/types";

interface TableBodyProps {
  items: IssueDataFromServer[];
  bookmarks: BookmarksType;
  toggleBookmark(id: string): void;
}

export const TableBody: React.FC<TableBodyProps> = ({
  items,
  bookmarks,
  toggleBookmark,
}) => {
  return (
    <tbody>
      {items.map((item, idx) => (
        <TableRow
          key={item.number}
          idx={idx}
          item={item}
          bookmark={bookmarks[item.number]}
          toggleBookmark={toggleBookmark}
        />
      ))}
    </tbody>
  );
};
