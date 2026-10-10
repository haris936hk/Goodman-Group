import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ThemeToggle } from "./theme-toggle";

describe("ThemeToggle", () => {
  let metaThemeColor: HTMLMetaElement;

  beforeEach(() => {
    delete document.documentElement.dataset.theme;
    delete document.documentElement.dataset.themeExplicit;
    localStorage.clear();

    metaThemeColor = document.createElement("meta");
    metaThemeColor.name = "theme-color";
    metaThemeColor.content = "#06111f";
    document.head.appendChild(metaThemeColor);
  });

  afterEach(() => {
    metaThemeColor.remove();
    delete document.documentElement.dataset.theme;
    delete document.documentElement.dataset.themeExplicit;
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("toggles between dark and light themes on button click", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <div className="site-shell" data-theme="dark">
        <div className="mobile-nav-backdrop" />
        <ThemeToggle />
      </div>,
    );

    const button = screen.getByRole("button", { name: "Switch to light mode" });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("aria-pressed", "false");

    await user.click(button);

    const shell = container.querySelector(".site-shell");
    expect(shell).toHaveAttribute("data-theme", "light");
    expect(metaThemeColor.content).toBe("#ffffff");

    const backdrop = container.querySelector(".mobile-nav-backdrop");
    expect(backdrop).toHaveAttribute("data-theme", "light");
    expect(button).toHaveAttribute("aria-label", "Switch to dark mode");
    expect(button).toHaveAttribute("aria-pressed", "true");

    await user.click(button);
    expect(shell).toHaveAttribute("data-theme", "dark");
    expect(metaThemeColor.content).toBe("#06111f");
  });

  it("synchronizes with external data-theme changes on documentElement via MutationObserver", async () => {
    const { container } = render(
      <div className="site-shell" data-theme="dark">
        <ThemeToggle />
      </div>,
    );

    const shell = container.querySelector(".site-shell");
    expect(shell).toHaveAttribute("data-theme", "dark");

    document.documentElement.dataset.theme = "light";

    await waitFor(() => {
      expect(shell).toHaveAttribute("data-theme", "light");
    });
  });

  it("re-applies chrome theme when head child list mutates", async () => {
    render(
      <div className="site-shell" data-theme="light">
        <ThemeToggle />
      </div>,
    );

    const dummyLink = document.createElement("link");
    dummyLink.rel = "stylesheet";
    dummyLink.href = "/dummy.css";
    document.head.appendChild(dummyLink);

    await waitFor(() => {
      expect(metaThemeColor.content).toBe("#06111f");
    });

    dummyLink.remove();
  });

  it("handles rendering outside of a .site-shell element gracefully", () => {
    expect(() => render(<ThemeToggle />)).not.toThrow();
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
    fireEvent.click(button);
    expect(button).toBeInTheDocument();
  });
});
