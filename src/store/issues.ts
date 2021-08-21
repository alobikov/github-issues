import { createSlice } from "@reduxjs/toolkit";
import { IssueDataFromServer } from "../types/issue";

interface IInitialState {
  issues: IssueDataFromServer[];
}

const initialState: IInitialState = {
  issues: [],
};

export const reducer = (state = initialState, action: any) => {
  return state;
};

const slice = createSlice({
  name: "issues",
  initialState,
  reducers: {
    getIssues: (state) => {},
  },
});

export const { getIssues } = slice.actions;
export default slice.reducer;
