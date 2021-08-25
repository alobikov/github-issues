import { createSlice } from "@reduxjs/toolkit";

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
  },
});

export const { setActivePage, setLastPage } = slice.actions;
export default slice.reducer;
