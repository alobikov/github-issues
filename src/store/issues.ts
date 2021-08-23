import { createSlice } from "@reduxjs/toolkit";
import { IssueDataFromServer } from "../types/issue";

interface IInitialState {
  list: IssueDataFromServer[];
  loading: boolean;
}

const initialState: IInitialState = {
  list: [],
  loading: false,
};

const slice = createSlice({
  name: "issues",
  initialState,
  reducers: {
    issuesRequested: (issues, action) => {
      issues.loading = true;
    },

    issuesRequestedFailed: (issues, action) => {
      issues.loading = false;
    },

    issuesReceived: (issues, action) => {
      issues.list = action.payload;
      issues.loading = false;
    },

    oneIssueReceived: (issues, action) => {
      issues.list.push(action.payload);
    },

    clearIssues: (issues) => {
      issues.list = [];
    },

    stopLoading: (issues) => {
      issues.loading = false;
    },
  },
});

export const {
  issuesReceived,
  oneIssueReceived,
  clearIssues,
  issuesRequested,
  issuesRequestedFailed,
  stopLoading,
} = slice.actions;
export default slice.reducer;
