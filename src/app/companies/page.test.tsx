import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { companies } from "@/data/companies";

import CompaniesPage from "./page";

const retiredCompanySlugs = [
  ["h", "y", "g", "e", "i", "a", "-pharmaceuticals"].join(""),
  ["m", "e", "d", "w", "e", "l", "l", "-pharmaceuticals"].join(""),
] as const;

describe("CompaniesPage", () => {
  it("renders the ungrouped semantic company directory from canonical data", () => {
    render(<CompaniesPage />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Our Companies",
      }),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(/Browse every company in the Goodman Group portfolio/),
    ).not.toBeInTheDocument();

    for (const company of companies) {
      expect(
        screen.getByRole("heading", { level: 3, name: company.displayName }),
      ).toBeInTheDocument();

      const links = screen.getAllByRole("link", {
        name: `View ${company.displayName}`,
      });
      expect(links).toHaveLength(1);
      expect(links[0]).toHaveAttribute("href", `/companies/${company.slug}`);
    }
    const equipmentCard = screen
      .getByRole("heading", {
        level: 3,
        name: "Goodman Medical Equipment Trading",
      })
      .closest("li");

    expect(equipmentCard).toHaveTextContent(
      "Locations: Dubai, United Arab Emirates, Islamabad, Pakistan",
    );
    expect(equipmentCard).not.toHaveTextContent("Founders & Directors");
    for (const founder of [
      "Malik Munir Awan",
      "Syed Talib Hussain Hashmi",
      "Taj Muhammad",
      "Syed Ahmed Ali",
    ]) {
      expect(equipmentCard).not.toHaveTextContent(founder);
    }
  });

  it("does not expose retired company profiles", () => {
    const { container } = render(<CompaniesPage />);

    for (const slug of retiredCompanySlugs) {
      expect(
        container.querySelector(`a[href="/companies/${slug}"]`),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText(new RegExp(slug.split("-")[0], "i")),
      ).not.toBeInTheDocument();
    }
  });

  it("does not render sector-based groupings or additional sector blocks", () => {
    render(<CompaniesPage />);

    expect(screen.queryByRole("heading", { name: "Automotive" })).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Real Estate" })).not.toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Healthcare & Pharmaceuticals" }),
    ).not.toBeInTheDocument();
    expect(screen.queryByText("Additional sectors")).not.toBeInTheDocument();
    expect(
      screen.queryByText("Automobiles are among Goodman Group's areas of activity."),
    ).not.toBeInTheDocument();
  });
});
