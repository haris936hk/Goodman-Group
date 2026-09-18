import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import WalGreenChemicalsPage, { metadata } from "./page";

describe("WalGreenChemicalsPage", () => {
  it("exports valid canonical metadata", () => {
    expect(metadata.title).toBe("Wal Green Chemicals");
    expect(metadata.description).toContain("Syed Talib Hussain Hashmi is its CEO since 2021");
  });

  it("renders unique level-one heading, legal identity, and verified facts", () => {
    render(<WalGreenChemicalsPage />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Wal Green Chemicals" }),
    ).toBeInTheDocument();

    expect(
      screen.getAllByText(/Wal Green Chemical Pvt\. Ltd\./i).length,
    ).toBeGreaterThanOrEqual(1);

    expect(
      screen.getAllByText("A Goodman Group company").length,
    ).toBeGreaterThanOrEqual(1);

    expect(screen.getByText("CEO since 2021")).toBeInTheDocument();
    expect(
      screen.getAllByText(/Chemicals/i).length,
    ).toBeGreaterThanOrEqual(1);
  });
});
