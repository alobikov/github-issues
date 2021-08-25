import { createSlice } from "@reduxjs/toolkit";
import { IRepository } from "../services/issuesData";

const initialState: IRepository = {
  full_name: "",
  repositoryValid: true,
  response: "",
};

export const reducer = (state = initialState, action: any) => {
  return state;
};

const slice = createSlice({
  name: "repository",
  initialState,
  reducers: {
    setRepository: (state, action) => {
      state.full_name = action.payload.full_name;
      state.repositoryValid = true;
    },

    setRepositoryValid: (state, action) => {
      state.repositoryValid = action.payload;
    },

    setRepositoryResponse: (state, action) => {
      state.response = action.payload;
    },
  },
});

export const { setRepository, setRepositoryValid, setRepositoryResponse } =
  slice.actions;
export default slice.reducer;
