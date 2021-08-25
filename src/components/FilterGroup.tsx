import React from "react";
import { useDispatch, useSelector } from "react-redux";
import cn from "classnames";
import { setIssuesFilter } from "../store/slices/issuesFilter";
import { RootState } from "../store";
import { setActivePage } from "../store/slices/paginator";

interface IItem {
  title: string;
  state: string;
}

interface FilterGroupProps {
  className: string;
}

const filterItems = [
  { title: "All", state: "all" },
  { title: "Open", state: "open" },
  { title: "Closed", state: "closed" },
  { title: "Bookmarked", state: "bookmarked" },
];

export const FilterGroup: React.FC<FilterGroupProps> = ({ className }) => {
  const dispatch = useDispatch();
  const selectedFilter = useSelector(
    (state: RootState) => state.issuesFilter.selectedFilter
  );

  const handleChange = (item: IItem) => {
    if (item.state === selectedFilter) return;
    dispatch(setIssuesFilter(item.state));
    dispatch(setActivePage(1));
  };

  const filterGroupElements = filterItems.map((item) => (
    <li
      onClick={() => handleChange(item)}
      key={item.state}
      className={cn("p-1 border-b-2 border-gray-300 cursor-pointer", {
        "text-white bg-blue-500": selectedFilter === item.state,
        "hover:bg-gray-100": selectedFilter !== item.state,
      })}
    >
      {item.title}
    </li>
  ));

  return (
    <div className={className}>
      <ul className="border-2 border-b-0 border-gray-300">
        {filterGroupElements}
      </ul>
    </div>
  );
};
