import React from "react";
import { cleanup, render, screen } from "@testing-library/react";
import { TypeLabel } from "../TypeLabel";

describe("TypeLabel", () => {
  afterEach(() => {
    cleanup();
  });

  it("should render 'isssue'", () => {
    render(<TypeLabel />);
    expect(screen.getByText(/issue/)).toBeInTheDocument();
  });

  it("should render 'pr' if 'type' props gets object", () => {
    render(<TypeLabel type={{}} />);
    expect(screen.getByText(/pr/)).toBeInTheDocument();
  });
});
