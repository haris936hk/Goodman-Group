import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import GeronPharmaPage, { metadata } from "./page";

describe("GeronPharmaPage", () => {
  beforeEach(() => {
    vi.stubGlobal("matchMedia", vi.fn(() => ({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })));
  });
  it("exports valid canonical metadata", () => {
    expect(metadata.title).toBe("Geron Pharma");
    expect(metadata.description).toBe(
      "Geron Pharma (Pvt.) Ltd. is a pharmaceutical business led by Chief Executive Officer Syed Talib Hussain Hashmi, who has served as CEO since 2019.",
    );
  });

  it("renders unique level-one heading, legal identity, and verified facts", () => {
    render(<GeronPharmaPage />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Geron Pharma" }),
    ).toBeInTheDocument();

    expect(
      screen.getAllByText(/Geron Pharma \(Pvt\.\) Ltd\./i).length,
    ).toBeGreaterThanOrEqual(1);

    expect(
      screen.getAllByText("A Goodman Group company").length,
    ).toBeGreaterThanOrEqual(1);

    expect(
      screen.getByRole("heading", {
        level: 3,
        name: "Geron Pharma (Pvt.) Ltd.",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 3,
        name: "Pharmaceutical business",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("Syed Talib Hussain Hashmi")).toBeInTheDocument();
    expect(
      screen.getByText("Chief Executive Officer since 2019."),
    ).toBeInTheDocument();

  });
});
