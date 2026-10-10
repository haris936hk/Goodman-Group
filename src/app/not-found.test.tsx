import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import NotFound, { metadata } from "./not-found";

describe("NotFound (404 page)", () => {
  it("exports valid not-found metadata disabling crawler indexing", () => {
    expect(metadata.title).toBe("Page not found");
    expect(metadata.robots).toEqual({ index: false, follow: false });
  });

  it("renders semantic landmarks, 404 heading, and recovery navigation", () => {
    render(<NotFound />);

    expect(screen.getByText("404 / Page not found")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "This route has moved beyond the map.",
      }),
    ).toBeInTheDocument();

    const main = screen.getByRole("main");
    expect(main).toHaveAttribute("id", "main-content");

    const skipLink = screen.getByRole("link", { name: "Skip to main content" });
    expect(skipLink).toHaveAttribute("href", "#main-content");

    const returnHomeLink = screen.getByRole("link", { name: /Return home/i });
    expect(returnHomeLink).toHaveAttribute("href", "/");

    const browseCompaniesLink = screen.getByRole("link", { name: /Browse companies/i });
    expect(browseCompaniesLink).toHaveAttribute("href", "/companies");
  });
});
