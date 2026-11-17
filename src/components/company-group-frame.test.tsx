import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { companies } from "@/data/companies";
import { goodmanGroup } from "@/data/goodman-group";

import { CompanyGroupFrame } from "./company-group-frame";

vi.mock("next/navigation", () => ({ usePathname: () => "/companies/test-corp" }));


describe("CompanyGroupFrame", () => {
  it("renders shared navigation, content, and the group footer", () => {
    const company = companies[0];
    render(
      <CompanyGroupFrame company={company} className="custom-frame-class">
        <section>Company Profile Content</section>
      </CompanyGroupFrame>,
    );

    const skipLink = screen.getByRole("link", { name: "Skip to main content" });
    expect(skipLink).toHaveAttribute("href", "#main-content");

    expect(screen.getByRole("link", { name: "Goodman Group home" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("navigation", { name: "Primary navigation" }))
      .toHaveTextContent("Our Companies");
    expect(screen.getByRole("link", { name: "Our Companies" }))
      .toHaveAttribute("href", "/companies");

    const main = screen.getByRole("main");
    expect(main).toHaveAttribute("id", "main-content");
    expect(main).toHaveAttribute("tabindex", "-1");
    expect(screen.getByText("Company Profile Content")).toBeInTheDocument();

    const footer = screen.getByRole("contentinfo");
    expect(within(footer).getByText(goodmanGroup.description)).toBeInTheDocument();
    expect(within(footer).getByRole("link", { name: company.displayName }))
      .toHaveAttribute("aria-current", "page");
    expect(within(footer).getByRole("link", { name: "Back to top ↑" }))
      .toHaveAttribute("href", "#top");

    const root = main.closest(".company-group-frame");
    expect(root).toHaveClass("custom-frame-class");
    expect(root).toHaveAttribute("id", "top");
  });

});
