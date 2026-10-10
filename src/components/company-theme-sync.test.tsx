import { render, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { CompanyThemeSync } from "./company-theme-sync";

describe("CompanyThemeSync", () => {
  let metaThemeColor: HTMLMetaElement;

  beforeEach(() => {
    delete document.documentElement.dataset.theme;
    localStorage.clear();

    metaThemeColor = document.createElement("meta");
    metaThemeColor.name = "theme-color";
    metaThemeColor.content = "#000000";
    document.head.appendChild(metaThemeColor);
  });

  afterEach(() => {
    metaThemeColor.remove();
    delete document.documentElement.dataset.theme;
    localStorage.clear();
  });

  it("synchronizes frame theme and updates meta theme-color according to company palette", async () => {
    const { container } = render(
      <div className="company-group-frame wal-green-page">
        <CompanyThemeSync />
      </div>,
    );

    const frame = container.querySelector(".company-group-frame") as HTMLElement;
    expect(frame).toBeInTheDocument();
    expect(frame.dataset.theme).toBe("dark");
    expect(metaThemeColor.content).toBe("#111b16");

    document.documentElement.dataset.theme = "light";

    await waitFor(() => {
      expect(frame.dataset.theme).toBe("light");
      expect(metaThemeColor.content).toBe("#faf8f5");
    });
  });

  it("handles head mutations by reapplying the active palette", async () => {
    const { container } = render(
      <div className="company-group-frame medical-equipment-page">
        <CompanyThemeSync />
      </div>,
    );

    const frame = container.querySelector(".company-group-frame") as HTMLElement;
    expect(frame.dataset.theme).toBe("dark");
    expect(metaThemeColor.content).toBe("#101c26");

    const dummyScript = document.createElement("script");
    document.head.appendChild(dummyScript);

    await waitFor(() => {
      expect(metaThemeColor.content).toBe("#101c26");
    });

    dummyScript.remove();
  });

  it("handles missing or unmapped company frames without error", () => {
    expect(() => render(<CompanyThemeSync />)).not.toThrow();

    expect(() =>
      render(
        <div className="company-group-frame unmapped-page">
          <CompanyThemeSync />
        </div>,
      ),
    ).not.toThrow();
  });

  it("cleans up observers on unmount", () => {
    const { unmount } = render(
      <div className="company-group-frame geron-page">
        <CompanyThemeSync />
      </div>,
    );

    expect(() => unmount()).not.toThrow();
  });
});
