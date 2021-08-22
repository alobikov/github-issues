import { createSlice } from "@reduxjs/toolkit";
import { ISortColumn } from "../components/TableHeader";

const initialState: ISortColumn = {
  sort: "created",
  direction: "desc",
};

const slice = createSlice({
  name: "sortColumn",
  initialState,
  reducers: {
    setSortColumn: (state, action) => {
      Object.assign(state, action.payload);
    },
  },
});

export const { setSortColumn } = slice.actions;
export default slice.reducer;
