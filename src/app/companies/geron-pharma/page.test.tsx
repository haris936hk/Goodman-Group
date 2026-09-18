import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import GeronPharmaPage, { metadata } from "./page";

describe("GeronPharmaPage", () => {
  it("exports valid canonical metadata", () => {
    expect(metadata.title).toBe("Geron Pharma");
    expect(metadata.description).toContain("Syed Talib Hussain Hashmi is its CEO since 2019");
  });

  it("renders unique level-one heading, legal identity, and verified facts", () => {
    render(<GeronPharmaPage />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Geron Pharma" }),
    ).toBeInTheDocument();

    expect(
      screen.getAllByText(/Geron Pharma Pvt\. Ltd\./i).length,
    ).toBeGreaterThanOrEqual(1);

    expect(
      screen.getAllByText("A Goodman Group company").length,
    ).toBeGreaterThanOrEqual(1);

    expect(screen.getByText("CEO since 2019")).toBeInTheDocument();
    expect(
      screen.getAllByText(/Pharmaceuticals/i).length,
    ).toBeGreaterThanOrEqual(1);
  });
});
