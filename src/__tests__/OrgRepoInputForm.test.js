import React from "react"
import { render, screen } from "@testing-library/react"
import { OrgRepoInputForm } from "../components/OrgRepoInputForm"

describe("OrgRepoInputForm", () => {
  it("render two inputs", () => {
    render(<OrgRepoInputForm />)

    expect(screen.getByLabelText(/repo/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/org/i)).toBeInTheDocument()
  })
})
