import { createSlice } from "@reduxjs/toolkit";
import { IRepository } from "../services/issuesData";

const initialState: IRepository = {
  full_name: "",
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
      state.full_name = action.payload.full_name;
      state.repositoryValid = true;
    },

    setRepositoryValid: (state, action) => {
      state.repositoryValid = true;
    },

    setRepositoryInvalid: (state, action) => {
      state.repositoryValid = false;
    },
  },
});

export const { setRepository, setRepositoryValid, setRepositoryInvalid } =
  slice.actions;
export default slice.reducer;
