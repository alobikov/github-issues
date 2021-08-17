import React from "react"
import { FaRegBookmark, FaBookmark } from "react-icons/fa"
import { IIssue } from "../types/issue"
import cn from "classnames"

interface TableBodyProps {
  items: IIssue[]
  bookmarks: Record<number, boolean>
  toggleBookmark(id: number): void
}

const trElement = (
  issue: IIssue,
  bookmark: boolean,
  idx: number,
  toggleBookmark: (id: number) => void
) => (
  <tr className={cn("text-xs", { "bg-blue-200": idx % 2 })} key={issue.number}>
    <td className="pl-2">{issue.title}</td>
    <td className="px-2">{issue.user.login}</td>
    <td>{issue.created_at}</td>
    <td>{issue.updated_at}</td>
    <td className="text-center">{issue.comments}</td>
    <td
      className="cursor-pointer pr-2"
      onClick={() => toggleBookmark(issue.number)}
    >
      {bookmark ? <FaBookmark /> : <FaRegBookmark />}
    </td>
  </tr>
)

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
  )
}
