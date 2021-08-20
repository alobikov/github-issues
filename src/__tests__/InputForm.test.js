import React from "react";
import { render, screen } from "@testing-library/react";
import { InputForm } from "../components/InputForm";

describe("InputForm", () => {
  it("render two inputs", () => {
    render(<InputForm />);

    expect(screen.getByLabelText(/repo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/org/i)).toBeInTheDocument();
  });
});
