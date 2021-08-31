import { createSlice } from "@reduxjs/toolkit";
import { PAGE_SIZE } from "../../config/appSettings";

const initialState = { activePage: 1, lastPage: 1 };

const slice = createSlice({
  name: "paginator",
  initialState,
  reducers: {
    setActivePage: (state, action) => {
      state.activePage = action.payload;
    },

    setLastPage: (state, action) => {
      state.lastPage = action.payload;
    },

    calcAndSetLastPage: (state, action) => {
      state.lastPage = Math.ceil(action.payload / PAGE_SIZE);
    },
  },
});

export const { setActivePage, setLastPage, calcAndSetLastPage } = slice.actions;
export default slice.reducer;
