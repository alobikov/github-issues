import { configureStore } from "@reduxjs/toolkit";
import issues from "./issues";
import repository from "./repository";

const store = configureStore({ reducer: { repository } });
export type RootState = ReturnType<typeof store.getState>;
export default store;
