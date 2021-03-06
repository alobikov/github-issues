import React, { useState } from "react";
import cn from "classnames";
import { IssueDataFromServer } from "../types/issue";
import { IssueDetails } from "./IssueDetails";
import { TypeLabel } from "./TypeLabel";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import { Dialog } from "@material-ui/core";

interface TableRowProps {
  idx: number;
  item: IssueDataFromServer;
  bookmark: boolean;
  toggleBookmark: (id: string) => void;
}

export const TableRow: React.FC<TableRowProps> = ({
  idx,
  item,
  bookmark,
  toggleBookmark,
}) => {
  const [open, setOpen] = useState(false);

  const handleDialogOpen = () => {
    setOpen(true);
  };

  const handleDialogClose = () => {
    setOpen(false);
  };

  const handleToggleBookmark = (
    event: React.MouseEvent<HTMLTableDataCellElement>,
    id: string
  ) => {
    event.stopPropagation();
    toggleBookmark(id);
  };

  return (
    <>
      <tr
        className={cn("text-xs cursor-pointer", { "bg-blue-200": idx % 2 })}
        key={item.number}
        onClick={handleDialogOpen}
      >
        <td className="p-2">
          <div className="flex items-center">
            <TypeLabel type={item.pull_request} />
            <span>{item.title}</span>
          </div>
        </td>
        <td className="px-2">{item.user.login}</td>
        <td>{new Date(Date.parse(item.created_at)).toDateString()}</td>
        <td>{new Date(Date.parse(item.updated_at)).toDateString()}</td>
        <td className="text-center">{item.comments}</td>
        <td
          className="cursor-pointer pr-2"
          onClick={(event) =>
            handleToggleBookmark(event, item.number.toString())
          }
        >
          {bookmark ? <FaBookmark /> : <FaRegBookmark />}
        </td>
      </tr>
      <Dialog open={open} onClose={handleDialogClose}>
        <IssueDetails issue={item} onClose={handleDialogClose} />
      </Dialog>
    </>
  );
};
