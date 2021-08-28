import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { createStore, combineReducers } from "redux";
import { FilterGroup } from "../FilterGroup";
import reducer, { setIssuesFilter } from "../../store/slices/issuesFilter";
import * as reactRedux from "react-redux";

describe("FilterGroup", () => {
  const useSelectorMock = jest.spyOn(reactRedux, "useSelector");
  const useDispatchMock = jest.spyOn(reactRedux, "useDispatch");
  const dummyDispatch = jest.fn();

  beforeEach(() => {
    useSelectorMock.mockClear();
    useDispatchMock.mockClear();
    useDispatchMock.mockReturnValue(dummyDispatch);
    useSelectorMock.mockReturnValue("all");
    render(<FilterGroup />);
  });

  it("renders 4 filter names", () => {
    expect(screen.getByText("All")).toBeInTheDocument();
    expect(screen.getByText("Open")).toBeInTheDocument();
    expect(screen.getByText("Closed")).toBeInTheDocument();
    expect(screen.getByText("Bookmarked")).toBeInTheDocument();
  });

  it("renders 'All' filter selected by default", () => {
    expect(screen.getByText("All")).toHaveClass("bg-blue-500");
  });

  it("sends dispatch on click and visualize selection", () => {
    cleanup();
    // restore original funcitonality of useSelector and useDispatch
    // and then setup and use reals store and reducer
    useSelectorMock.mockRestore();
    useDispatchMock.mockRestore();
    const rootReducer = combineReducers({
      issuesFilter: reducer,
    });
    const mockStore = createStore(rootReducer);
    render(
      <Provider store={mockStore}>
        <FilterGroup />
      </Provider>
    );
    // userEvent.click(screen.getByText("Open"));
    // expect(dummyDispatch).toBeCalledTimes(2);
    fireEvent.click(screen.getByText("Open"));
    screen.debug();
    expect(screen.getByText("Open")).toHaveClass("bg-blue-500");
  });
});
