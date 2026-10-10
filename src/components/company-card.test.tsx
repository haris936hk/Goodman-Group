import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { CompanyProfile } from "@/data/companies";

import { CompanyCard } from "./company-card";

const mockCompany: CompanyProfile = {
  slug: "test-corp",
  displayName: "Test Corporation",
  legalName: "Test Corporation (Pvt.) Ltd.",
  relationship: "Subsidiary",
  business: "Pharmaceutical Solutions",
  summary: "Comprehensive healthcare distribution and supply.",
  logo: {
    src: "/assets/logos/test.png",
    width: 240,
    height: 120,
  },
  accent: "#2563eb",
  founded: "2015",
  locations: ["Islamabad, Pakistan"],
  leadership: [{ name: "Director", role: "CEO", detail: "Founder" }],
  capabilities: ["Supply Chain"],
  contacts: ["contact@test.com"],
};

describe("CompanyCard", () => {
  it("renders standard company card with logo, business, title, and summary", () => {
    const { container } = render(<CompanyCard company={mockCompany} />);

    expect(screen.getByRole("link", { name: "View Test Corporation" })).toHaveAttribute(
      "href",
      "/companies/test-corp",
    );
    expect(screen.getByText("Pharmaceutical Solutions")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: "Test Corporation" })).toBeInTheDocument();
    expect(screen.getByText("Comprehensive healthcare distribution and supply.")).toBeInTheDocument();

    const logo = screen.getByAltText("Test Corporation logo");
    expect(logo).toBeInTheDocument();
    expect(decodeURIComponent(logo.getAttribute("src") ?? "")).toContain("/assets/logos/test.png");

    const card = container.querySelector(".company-card");
    expect(card).not.toHaveClass("company-card-compact");
  });

  it("renders compact variant without summary and with compact modifier class", () => {
    const { container } = render(<CompanyCard company={mockCompany} compact />);

    const card = container.querySelector(".company-card");
    expect(card).toHaveClass("company-card-compact");
    expect(screen.queryByText("Comprehensive healthcare distribution and supply.")).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: "Test Corporation" })).toBeInTheDocument();
  });

  it("renders text identity fallback when company logo is omitted", () => {
    const companyWithoutLogo: CompanyProfile = {
      ...mockCompany,
      logo: null,
    };

    render(<CompanyCard company={companyWithoutLogo} />);

    expect(screen.queryByAltText("Test Corporation logo")).not.toBeInTheDocument();
    const textIdentity = screen.getByText("Test Corporation", { selector: ".company-text-identity" });
    expect(textIdentity).toBeInTheDocument();
  });
});
