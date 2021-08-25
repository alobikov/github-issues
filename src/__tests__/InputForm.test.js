import React from "react";
import {
  fireEvent,
  getByLabelText,
  getByText,
  render,
  screen,
} from "@testing-library/react";
import { InputForm } from "../components/InputForm";
import { Provider } from "react-redux";
import { createStore, combineReducers } from "redux";
import issues from "../store/slices/issues";
import repository from "../store/slices/repository";
import sortColumn from "../store/slices/sortColumn";
import issuesFilter from "../store/slices/issuesFilter";
import paginator from "../store/slices/paginator";
import userEvent from "@testing-library/user-event";

describe("InputForm", () => {
  const reducer = combineReducers({
    issues,
    repository,
    sortColumn,
    issuesFilter,
    paginator,
  });

  const store = createStore(reducer);

  it("renders two inputs", () => {
    const { container } = render(
      <Provider store={store}>
        <InputForm />
      </Provider>
    );

    expect(screen.getByLabelText(/repository/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/organization/i)).toBeInTheDocument();
  });
});
