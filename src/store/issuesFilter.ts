import { createSlice } from "@reduxjs/toolkit";

const initialState = { selectedFilter: "all" };

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
