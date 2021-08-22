import { configureStore } from "@reduxjs/toolkit";
import issues from "./issues";
import repository from "./repository";
import sortColumn from "./sortColumn";
import issuesFilter from "./issuesFilter";
import paginator from "./paginator";

const store = configureStore({
  reducer: { issues, repository, sortColumn, issuesFilter, paginator },
});
export type RootState = ReturnType<typeof store.getState>;
export default store;
