import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { companies } from "@/data/companies";
import { goodmanGroup } from "@/data/goodman-group";

import { SiteFooter } from "./site-footer";

describe("SiteFooter", () => {
  it("renders branding, group description, and navigation landmarks", () => {
    render(<SiteFooter />);

    const brandImg = screen.getByAltText("Goodman Group");
    expect(brandImg).toBeInTheDocument();
    expect(screen.getByText(goodmanGroup.description)).toBeInTheDocument();

    expect(screen.getByRole("link", { name: "About the Group" })).toHaveAttribute("href", "/#about");
    expect(screen.getByRole("link", { name: "Our Presence" })).toHaveAttribute("href", "/#presence");

    for (const company of companies) {
      expect(screen.getByRole("link", { name: company.displayName })).toHaveAttribute(
        "href",
        `/companies/${company.slug}`,
      );
    }
  });

  it("renders contact links and all three physical addresses", () => {
    render(<SiteFooter />);

    const emailLink = screen.getByRole("link", { name: goodmanGroup.contacts.email });
    expect(emailLink.getAttribute("href")).toContain(`mailto:${goodmanGroup.contacts.email}`);

    expect(screen.getByText(/Flat No\. 4, Block No\. 26/i)).toBeInTheDocument();
    expect(screen.getByText(/Plot No\. 5, Street S-5, National Industrial Zone/i)).toBeInTheDocument();
    expect(screen.getByText(/15650 Grosvenor Lane, Macomb, MI 48044/i)).toBeInTheDocument();

    const backToTop = screen.getByRole("link", { name: "Back to top ↑" });
    expect(backToTop).toHaveAttribute("href", "#top");
  });
});
