import { createSlice } from "@reduxjs/toolkit";

const initialState = { activePage: 1 };

const slice = createSlice({
  name: "paginator",
  initialState,
  reducers: {
    setActivePage: (state, action) => {
      state.activePage = action.payload;
    },
  },
});

export const { setActivePage } = slice.actions;
export default slice.reducer;
