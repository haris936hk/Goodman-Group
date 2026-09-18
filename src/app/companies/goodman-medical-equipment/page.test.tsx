import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import GoodmanMedicalEquipmentPage, { metadata } from "./page";

describe("GoodmanMedicalEquipmentPage", () => {
  it("exports valid canonical metadata", () => {
    expect(metadata.title).toBe("Goodman Medical Equipment Trading");
    expect(metadata.description).toContain("United Arab Emirates and Pakistan");
  });

  it("renders unique level-one heading, split presence, and director record", () => {
    render(<GoodmanMedicalEquipmentPage />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Goodman Medical Equipment Trading",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getAllByText("A Goodman Group company").length,
    ).toBeGreaterThanOrEqual(1);

    expect(screen.getByText("United Arab Emirates")).toBeInTheDocument();
    expect(screen.getByText("Pakistan")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 3, name: "Syed Talib Hussain Hashmi" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/DIRECTOR SINCE JULY 2024/i),
    ).toBeInTheDocument();
  });
});
