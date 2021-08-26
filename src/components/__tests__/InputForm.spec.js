import {
  fireEvent,
  getByLabelText,
  getByText,
  render,
  screen,
} from "@testing-library/react";
import { InputForm } from "../InputForm";
import * as reactRedux from "react-redux";
import userEvent from "@testing-library/user-event";
import { useEventCallback } from "@material-ui/core";

describe("InputForm", () => {
  const useSelectorMock = jest.spyOn(reactRedux, "useSelector");
  const useDispatchMock = jest.spyOn(reactRedux, "useDispatch");
  const dummyDispatch = jest.fn();

  beforeEach(() => {
    useSelectorMock.mockClear();
    useDispatchMock.mockClear();
    useDispatchMock.mockReturnValue(dummyDispatch);
    useSelectorMock.mockReturnValue({ repositoryValid: false, response: "" });
  });

  it("renders two inputs", () => {
    render(<InputForm />);

    expect(screen.getByLabelText(/repository/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/organization/i)).toBeInTheDocument();
  });

  it("render Submit button in disabled state", () => {
    render(<InputForm />);

    expect(screen.getByRole("button")).toHaveProperty("type", "submit");
    expect(screen.getByRole("button")).toHaveProperty("disabled", true);
  });

  it("Submit button enabled when both inputs are filled", () => {
    render(<InputForm />);

    userEvent.type(screen.getAllByRole("textbox")[0], "rails");
    userEvent.type(screen.getAllByRole("textbox")[1], "rails");
    expect(screen.getByRole("button")).toHaveProperty("disabled", false);
  });

  it("render response text if repositoryValid === false", () => {
    useSelectorMock.mockReturnValue({
      repositoryValid: false,
      response: "error",
    });
    render(<InputForm />);

    expect(screen.getByText("error")).toBeInTheDocument();
  });

  it("not renders response text if repositoryValid === true", () => {
    useSelectorMock.mockReturnValue({
      repositoryValid: true,
      response: "",
    });
    render(<InputForm />);

    expect(screen.getByTestId("error-field")).toHaveTextContent("");
  });

  it("send dispatch on submit when both inputs have values", () => {
    render(<InputForm />);

    userEvent.type(screen.getAllByRole("textbox")[0], "rails");
    userEvent.type(screen.getAllByRole("textbox")[1], "rails");

    userEvent.click(screen.getByRole("button"));
    expect(dummyDispatch).toBeCalledTimes(1);
  });
});
