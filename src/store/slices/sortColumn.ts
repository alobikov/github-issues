import { createSlice } from "@reduxjs/toolkit";
import { ISortColumn } from "../../components/TableHeader";

const initialState: ISortColumn = {
  sort: "created",
  direction: "desc",
  id: 0,
};

const slice = createSlice({
  name: "sortColumn",
  initialState,
  reducers: {
    setSortColumn: (state, action) => {
      Object.assign(state, action.payload);
      state.id = Math.random();
    },
  },
});

export const { setSortColumn } = slice.actions;
export default slice.reducer;
