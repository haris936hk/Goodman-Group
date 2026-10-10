import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { CompanyProfile } from "@/data/companies";

import { CompanyGroupFrame } from "./company-group-frame";

const mockCompanyBase: CompanyProfile = {
  slug: "test-corp",
  displayName: "Test Corp",
  legalName: "Test Corp Ltd.",
  relationship: null,
  business: "Healthcare",
  summary: "Summary text.",
  logo: null,
  accent: "#123456",
  founded: "2020",
  locations: [],
  leadership: [],
  capabilities: [],
  contacts: [],
};

describe("CompanyGroupFrame", () => {
  it("renders standard frame elements with default relationship fallback", () => {
    render(
      <CompanyGroupFrame company={mockCompanyBase} className="custom-frame-class">
        <section>Company Profile Content</section>
      </CompanyGroupFrame>,
    );

    const skipLink = screen.getByRole("link", { name: "Skip to main content" });
    expect(skipLink).toHaveAttribute("href", "#main-content");

    const brandLinks = screen.getAllByRole("link", { name: "Goodman Group" });
    expect(brandLinks.length).toBeGreaterThanOrEqual(1);
    expect(brandLinks[0]).toHaveAttribute("href", "/");
    expect(screen.getByText("GG")).toBeInTheDocument();

    const backLinks = screen.getAllByRole("link", { name: "All companies" });
    expect(backLinks.length).toBeGreaterThanOrEqual(1);
    expect(backLinks[0]).toHaveAttribute("href", "/companies");

    expect(screen.getAllByText("A Goodman Group company").length).toBeGreaterThanOrEqual(1);

    const main = screen.getByRole("main");
    expect(main).toHaveAttribute("id", "main-content");
    expect(main).toHaveAttribute("tabindex", "-1");
    expect(screen.getByText("Company Profile Content")).toBeInTheDocument();

    expect(screen.getByRole("link", { name: "Group home" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: "Contact Group" })).toHaveAttribute("href", "/#contact");

    const root = main.closest(".company-group-frame");
    expect(root).toHaveClass("custom-frame-class");
  });

  it("renders bespoke relationship text when company specifies one", () => {
    const bespokeCompany: CompanyProfile = {
      ...mockCompanyBase,
      relationship: "Operating division of Goodman Group",
    };

    render(
      <CompanyGroupFrame company={bespokeCompany}>
        <div>Profile Content</div>
      </CompanyGroupFrame>,
    );

    expect(
      screen.getAllByText("Operating division of Goodman Group").length,
    ).toBeGreaterThanOrEqual(1);
    expect(screen.queryByText("A Goodman Group company")).not.toBeInTheDocument();
  });
});
