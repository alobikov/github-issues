import { configureStore } from "@reduxjs/toolkit";
import issues from "./issues";
import repository from "./repository";
import sortColumn from "./sortColumn";
import issuesFilter from "./issuesFilter";
import paginator from "./paginator";
import api from "./middleware/api";

const store = configureStore({
  reducer: {
    issues,
    repository,
    sortColumn,
    issuesFilter,
    paginator,
  },
  middleware: [api],
});
export type RootState = ReturnType<typeof store.getState>;
export default store;
