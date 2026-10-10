import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { mockMatchMedia } from "../../../../tests/test-utils";
import WalGreenChemicalsPage, { metadata } from "./page";

describe("WalGreenChemicalsPage", () => {
  beforeEach(() => {
    mockMatchMedia(false);
  });
  it("exports valid canonical metadata", () => {
    expect(metadata.title).toBe("Wal Green Chemicals");
    expect(metadata.description).toContain("Wal Green Chemicals (Pvt.) Ltd.");
    expect(metadata.description).toContain("pharmaceutical raw materials");
    expect(metadata.description).toContain("Pakistan");
  });

  it("renders unique level-one heading, legal identity, and verified facts", () => {
    render(<WalGreenChemicalsPage />);

    // Single H1 heading
    const h1Headings = screen.getAllByRole("heading", { level: 1 });
    expect(h1Headings).toHaveLength(1);
    expect(h1Headings[0]).toHaveTextContent("Wal Green Chemicals");

    // Corrected legal name
    expect(
      screen.getAllByText(/Wal Green Chemicals \(Pvt\.\) Ltd\./i).length,
    ).toBeGreaterThanOrEqual(1);

    // Group relationship disclosure
    expect(
      screen.getAllByText("A Goodman Group company").length,
    ).toBeGreaterThanOrEqual(1);

    // Executive leadership and CEO tenure
    expect(
      screen.getByRole("heading", {
        level: 3,
        name: "Syed Talib Hussain Hashmi",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("CEO since 2021")).toBeInTheDocument();
    expect(
      screen.getAllByText(/Chief Executive Officer/i).length,
    ).toBeGreaterThanOrEqual(1);

    // Mission and positioning
    expect(
      screen.getByText(
        /To give Pakistan’s pharmaceutical and chemical manufacturing sector timely, compliant, and cost-effective access/i,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /A Pakistan-based bridge between international manufacturers and the local pharmaceutical/i,
      ),
    ).toBeInTheDocument();

    // All four organizational-function headings
    expect(
      screen.getByRole("heading", { level: 4, name: "Sales and marketing" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 4, name: "Business development" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 4,
        name: "Administration and finance",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 4,
        name: "Shipment and after-sales service",
      }),
    ).toBeInTheDocument();

    // Representative first and last product categories
    expect(
      screen.getByText("Active pharmaceutical ingredients."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Nutraceutical ingredients."),
    ).toBeInTheDocument();

    // All eight national coverage centres
    const centres = [
      "Faisalabad",
      "Hattar",
      "Islamabad",
      "Lahore",
      "Multan",
      "Peshawar",
      "Rawalpindi",
      "Rawat",
    ];
    for (const centre of centres) {
      expect(screen.getByText(centre)).toBeInTheDocument();
    }

    // Distribution objective
    expect(
      screen.getByText(
        /Consistent, on-time supply regardless of customer location\./i,
      ),
    ).toBeInTheDocument();

    // International import origins
    expect(
      screen.getByRole("heading", { level: 5, name: "China" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 5, name: "India" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 5, name: "Europe" }),
    ).toBeInTheDocument();

    // Karachi local sourcing hub
    expect(
      screen.getByText(/Karachi is the company’s primary local sourcing hub/i),
    ).toBeInTheDocument();

    // Partnership statement
    expect(
      screen.getByText(
        /Wal Green Chemicals states that it looks forward to building long-term supply partnerships with customers\./i,
      ),
    ).toBeInTheDocument();
  });

  it("renders fallbacks when company logo is omitted", async () => {
    vi.resetModules();
    vi.doMock("@/data/companies", () => ({
      getCompanyBySlug: (slug: string) => ({
        slug,
        displayName: "Wal Green Chemicals",
        legalName: "Wal Green Chemicals (Pvt.) Ltd.",
        relationship: null,
        business: "Raw materials",
        summary: "Summary.",
        logo: null,
        accent: "#1e7e50",
        founded: "2021",
        locations: [],
        leadership: [],
        capabilities: [],
        contacts: [],
      }),
    }));
    // Exception: dynamic import is required to evaluate the page module under vi.doMock isolation.
    const { default: MockWalGreenPage } = await import("./page");
    render(<MockWalGreenPage />);
    expect(screen.queryByAltText("Wal Green Chemicals logo")).not.toBeInTheDocument();
    vi.doUnmock("@/data/companies");
    vi.resetModules();
  });
});
