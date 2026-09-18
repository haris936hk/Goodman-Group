import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import GoodmanLaboratoriesPage, { metadata } from "./page";

describe("GoodmanLaboratoriesPage", () => {
  it("exports valid canonical metadata", () => {
    expect(metadata.title).toBe("Goodman Laboratories");
    expect(metadata.description).toContain("Syed Talib Hussain Hashmi is its CEO since 2012");
  });

  it("renders unique level-one heading, legal identity, and verified facts", () => {
    render(<GoodmanLaboratoriesPage />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Goodman Laboratories" }),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Goodman Laboratories (Pvt.) Ltd."),
    ).toBeInTheDocument();

    expect(
      screen.getAllByText("A Goodman Group company").length,
    ).toBeGreaterThanOrEqual(1);

    expect(screen.getByText("CEO since 2012")).toBeInTheDocument();
    expect(
      screen.getAllByText(/Pharmaceutical manufacturing/i).length,
    ).toBeGreaterThanOrEqual(1);
  });
});
