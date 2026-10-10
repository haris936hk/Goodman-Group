import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { mockMatchMedia } from "../../../../tests/test-utils";
import GeronPharmaPage, { metadata } from "./page";

describe("GeronPharmaPage", () => {
  beforeEach(() => {
    mockMatchMedia(false);
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

  it("renders graceful fallbacks when legalName, logo, and leadership are missing", async () => {
    vi.resetModules();
    vi.doMock("@/data/companies", () => ({
      getCompanyBySlug: (slug: string) => ({
        slug,
        displayName: "Geron Pharma",
        legalName: null,
        relationship: null,
        business: "Pharmaceutical business",
        summary: "Geron Pharma summary.",
        logo: null,
        accent: "#6c3bb7",
        founded: "2019",
        locations: [],
        leadership: [],
        capabilities: [],
        contacts: [],
      }),
    }));
    // Exception: dynamic import is required to evaluate the page module under vi.doMock isolation.
    const { default: GeronPharmaFallbackPage } = await import("./page");
    render(<GeronPharmaFallbackPage />);
    expect(screen.getByText("Legal name: Geron Pharma")).toBeInTheDocument();
    expect(screen.queryByAltText("Geron Pharma logo")).not.toBeInTheDocument();
    expect(screen.queryByText("Leadership")).not.toBeInTheDocument();
    vi.doUnmock("@/data/companies");
    vi.resetModules();
  });
});
