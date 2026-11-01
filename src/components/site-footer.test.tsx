import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { goodmanGroup } from "@/data/goodman-group";

import { SiteFooter } from "./site-footer";

const navigationState = vi.hoisted(() => ({ pathname: "/" }));

vi.mock("next/navigation", () => ({
  usePathname: () => navigationState.pathname,
}));

afterEach(() => {
  navigationState.pathname = "/";
});

describe("SiteFooter", () => {
  it("renders branding, group description, and navigation landmarks", () => {
    render(<SiteFooter />);

    const brandImg = screen.getByAltText("Goodman Group");
    expect(brandImg).toBeInTheDocument();
    expect(screen.getByText(goodmanGroup.description)).toBeInTheDocument();

    expect(screen.getByRole("navigation", { name: "Footer navigation" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Blog" })).toHaveAttribute("href", "/blog");
  });

  it("marks Blog as current on nested blog routes", () => {
    navigationState.pathname = "/blog/announcement";
    render(<SiteFooter />);

    expect(screen.getByRole("link", { name: "Blog" })).toHaveAttribute("aria-current", "page");
  });

  it("renders contact links and all three physical addresses", () => {
    render(<SiteFooter />);

    const emailLink = screen.getByRole("link", { name: goodmanGroup.contacts.email });
    expect(emailLink.getAttribute("href")).toContain(`mailto:${goodmanGroup.contacts.email}`);

    expect(screen.getByText(/Flat No\. 4, Block No\. 26/i)).toBeInTheDocument();
    expect(screen.getByText(/Plot No\. 5, Street S-5, National Industrial Zone/i)).toBeInTheDocument();
    expect(screen.getByText(/91 Ferry Street, Apt 3, Jersey City, New Jersey 07307-0730/i)).toBeInTheDocument();

    const backToTop = screen.getByRole("link", { name: "Back to top ↑" });
    expect(backToTop).toHaveAttribute("href", "#top");
  });
});
