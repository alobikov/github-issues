import { createSlice } from "@reduxjs/toolkit";
import { IssueDataFromServer } from "../types/issue";

interface IInitialState {
  list: IssueDataFromServer[];
}

const initialState: IInitialState = {
  list: [],
};

const slice = createSlice({
  name: "issues",
  initialState,
  reducers: {
    issuesReceived: (issues, action) => {
      issues.list = action.payload;
    },
  },
});

export const { issuesReceived } = slice.actions;
export default slice.reducer;
