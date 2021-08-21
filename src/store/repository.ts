import { createSlice } from "@reduxjs/toolkit";
import { act } from "react-dom/test-utils";
import { IRepository } from "../services/issuesData";

const initialState: IRepository = {
  name: "",
  org: "",
  repositoryValid: true,
};

export const reducer = (state = initialState, action: any) => {
  return state;
};

const slice = createSlice({
  name: "repository",
  initialState,
  reducers: {
    setRepository: (state, action) => {
      Object.assign(state, action.payload);
    },

    setRepositoryValid: (state, action) => {
      state.repositoryValid = action.payload;
    },
  },
});

export const { setRepository } = slice.actions;
export default slice.reducer;
