import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import NotFound from "./not-found";

describe("NotFound (404 page)", () => {

  it("renders semantic landmarks, 404 heading, and recovery navigation", () => {
    render(<NotFound />);

    expect(
      screen.getByRole("heading", {
        level: 1,
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
