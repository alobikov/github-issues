import React from "react";
import { useDispatch, useSelector } from "react-redux";
import cn from "classnames";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import { setSortColumn } from "../store/slices/sortColumn";
import { RootState } from "../store";
import { setActivePage } from "../store/slices/paginator";

type SortKeyType = "created" | "updated" | "comments";

export interface ISortColumn {
  sort: SortKeyType;
  direction: "asc" | "desc";
  id?: number;
}

const headerItems = [
  { key: "title", title: "Title" },
  { key: "author", title: "Author" },
  { sort: "created", title: "Created At" },
  { sort: "updated", title: "Updated At" },
  { sort: "comments", title: "Comments" },
  { key: "bookmark", title: "" },
];

export const TableHeader: React.FC = () => {
  const dispatch = useDispatch();
  const sortColumn = useSelector((state: RootState) => state.sortColumn);

  const sortDirectionIcon = (sort: string, sortColumn: ISortColumn) => {
    if (sort !== sortColumn.sort) return <span className="p-2"></span>;
    return sortColumn.direction === "desc" ? (
      <FaCaretDown className="inline" />
    ) : (
      <FaCaretUp className="inline mb-1" />
    );
  };

  const handleSort = (sort: SortKeyType) => {
    if (sort === sortColumn.sort) {
      const direction = sortColumn.direction === "asc" ? "desc" : "asc";
      dispatch(
        setSortColumn({
          ...sortColumn,
          direction,
        })
      );
    } else {
      dispatch(setSortColumn({ sort, direction: "desc" }));
    }
    dispatch(setActivePage(1));
  };

  const th_Elements = headerItems.map((item) => (
    <th
      className={cn("px-2 py-3 bg-gray-300", {
        "hover:bg-gray-400 cursor-pointer": item.sort,
      })}
      key={item.sort || item.key}
      onClick={() => {
        if (item.sort) return handleSort(item.sort as SortKeyType);
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
      <tr>{th_Elements}</tr>
    </thead>
  );
};
