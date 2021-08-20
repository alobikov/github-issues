import React from "react";
import cn from "classnames";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";

interface ISortColumn {
  sort: string;
  direction: "asc" | "desc";
}

interface SortingBarProps {
  items: { sort?: string; title: string; key?: string }[];
  sortColumn: ISortColumn;
  onSort(path: string): void;
}

export const TableHeader: React.FC<SortingBarProps> = ({
  items,
  sortColumn,
  onSort,
}) => {
  const sortDirectionIcon = (sort: string, sortColumn: ISortColumn) => {
    if (sort !== sortColumn.sort) return <span className="p-2"></span>;
    return sortColumn.direction === "desc" ? (
      <FaCaretDown className="inline" />
    ) : (
      <FaCaretUp className="inline mb-1" />
    );
  };

  const thElements = items.map((item) => (
    <th
      className={cn("px-2 py-3 cursor-pointer bg-gray-300", {
        "hover:bg-gray-100": item.sort,
      })}
      style={{}}
      key={item.sort || item.key}
      onClick={() => {
        if (item.sort) return onSort(item.sort);
      }}
    >
      <span className="whitespace-nowrap">
        {item.title}
        {item.sort && sortDirectionIcon(item.sort, sortColumn)}
      </span>
    </th>
  ));

  return (
    <thead>
      <tr>{thElements}</tr>
    </thead>
  );
};
