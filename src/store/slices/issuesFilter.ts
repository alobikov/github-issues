import { createSlice } from "@reduxjs/toolkit";

export type FilterType = "all" | "open" | "closed" | "bookmarked";
export interface IInitialState {
  selectedFilter: FilterType;
}

const initialState: IInitialState = { selectedFilter: "all" };

const slice = createSlice({
  name: "issuesFilter",
  initialState,
  reducers: {
    setIssuesFilter: (state, action) => {
      state.selectedFilter = action.payload;
    },
  },
});

export const { setIssuesFilter } = slice.actions;
export default slice.reducer;
