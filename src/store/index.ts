import issues from "./slices/issues";
import repository from "./slices/repository";
import sortColumn from "./slices/sortColumn";
import issuesFilter from "./slices/issuesFilter";
import paginator from "./slices/paginator";
import createSagaMiddleware from "redux-saga";
import { composeWithDevTools } from "redux-devtools-extension";
import { applyMiddleware, combineReducers, compose, createStore } from "redux";
import rootSaga from "./sagas";

export type RootState = ReturnType<typeof store.getState>;

const sagaMiddleware = createSagaMiddleware();

const reducer = combineReducers({
  issues,
  repository,
  sortColumn,
  issuesFilter,
  paginator,
});

const store = createStore(
  reducer,
  compose(applyMiddleware(sagaMiddleware), composeWithDevTools())
);

sagaMiddleware.run(rootSaga);

export default store;
