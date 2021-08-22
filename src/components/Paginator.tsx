import React from "react";
import { useDispatch, useSelector } from "react-redux";
import cn from "classnames";
import Pagination from "@material-ui/lab/Pagination";
import { RootState } from "../store/configureStore";
import { setActivePage } from "../store/paginator";

interface PaginatorProps {
  className: string;
}

export const Paginator: React.FC<PaginatorProps> = ({ className }) => {
  const dispatch = useDispatch();
  const { lastPage, activePage } = useSelector(
    (state: RootState) => state.paginator
  );
  const count = 10;

  const handleChange = (_: any, idx: number) => {
    console.log(idx);
    if (idx === activePage) return;
    dispatch(setActivePage(idx));
  };

  if (lastPage <= 1) return null;
  return (
    <div className={cn(className)}>
      <Pagination
        page={activePage}
        count={lastPage}
        variant="outlined"
        shape="rounded"
        onChange={handleChange}
      />
    </div>
  );
};
