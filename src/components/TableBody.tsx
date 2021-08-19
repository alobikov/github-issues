import React from "react";
import { FaRegBookmark, FaBookmark } from "react-icons/fa";
import { IIssue, IssueDataFromServer } from "../types/issue";
import cn from "classnames";
import { BookmarksType } from "../types/types";
import { TypeLabel } from "./TypeLabel";

interface TableBodyProps {
  items: IIssue[];
  bookmarks: BookmarksType;
  toggleBookmark(id: string): void;
}

const trElement = (
  issue: IssueDataFromServer,
  bookmark: boolean,
  idx: number,
  toggleBookmark: (id: string) => void
) => (
  <tr className={cn("text-xs", { "bg-blue-200": idx % 2 })} key={issue.number}>
    <td className="p-2">
      <div className="flex items-center">
        <TypeLabel type={issue.pull_request} />
        <span>{issue.title}</span>
      </div>
    </td>
    <td className="px-2">{issue.user.login}</td>
    <td>{new Date(Date.parse(issue.created_at)).toDateString()}</td>
    <td>{new Date(Date.parse(issue.updated_at)).toDateString()}</td>
    <td className="text-center">{issue.comments}</td>
    <td
      className="cursor-pointer pr-2"
      onClick={() => toggleBookmark(issue.number.toString())}
    >
      {bookmark ? <FaBookmark /> : <FaRegBookmark />}
    </td>
  </tr>
);

export const TableBody: React.FC<TableBodyProps> = ({
  items,
  bookmarks,
  toggleBookmark,
}) => {
  return (
    <tbody>
      {items.map((item, idx) =>
        trElement(item, bookmarks[item.number], idx, toggleBookmark)
      )}
    </tbody>
  );
};
