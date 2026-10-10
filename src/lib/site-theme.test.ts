import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { readSiteTheme, setSiteTheme } from "./site-theme";

describe("site-theme", () => {
  beforeEach(() => {
    delete document.documentElement.dataset.theme;
    delete document.documentElement.dataset.themeExplicit;
    localStorage.clear();
  });

  afterEach(() => {
    delete document.documentElement.dataset.theme;
    delete document.documentElement.dataset.themeExplicit;
    localStorage.clear();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  describe("readSiteTheme", () => {
    it("returns dataset theme when set to light or dark", () => {
      document.documentElement.dataset.theme = "light";
      expect(readSiteTheme()).toBe("light");

      document.documentElement.dataset.theme = "dark";
      expect(readSiteTheme()).toBe("dark");
    });

    it("falls through to localStorage when dataset theme is unset or invalid", () => {
      document.documentElement.dataset.theme = "other";
      localStorage.setItem("goodman-group-theme", "light");
      expect(readSiteTheme()).toBe("light");

      delete document.documentElement.dataset.theme;
      localStorage.setItem("goodman-group-theme", "dark");
      expect(readSiteTheme()).toBe("dark");
    });

    it("falls through to matchMedia when localStorage is unset or invalid", () => {
      localStorage.setItem("goodman-group-theme", "invalid");
      const matchMediaLight = vi.fn().mockReturnValue({ matches: false });
      vi.stubGlobal("matchMedia", matchMediaLight);
      expect(readSiteTheme()).toBe("light");

      const matchMediaDark = vi.fn().mockReturnValue({ matches: true });
      vi.stubGlobal("matchMedia", matchMediaDark);
      expect(readSiteTheme()).toBe("dark");
    });

    it("handles localStorage security errors by falling back to matchMedia", () => {
      vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
        throw new Error("storage access denied");
      });
      const matchMediaMock = vi.fn().mockReturnValue({ matches: false });
      vi.stubGlobal("matchMedia", matchMediaMock);
      expect(readSiteTheme()).toBe("light");
    });

    it("falls back to dark when matchMedia throws an exception", () => {
      const failingMatchMedia = vi.fn().mockImplementation(() => {
        throw new Error("matchMedia failed");
      });
      vi.stubGlobal("matchMedia", failingMatchMedia);
      expect(readSiteTheme()).toBe("dark");
    });

    it("falls back to dark when matchMedia is unavailable or not a function", () => {
      vi.stubGlobal("matchMedia", undefined);
      expect(readSiteTheme()).toBe("dark");
    });
  });

  describe("setSiteTheme", () => {
    it("updates document dataset attributes and localStorage", () => {
      setSiteTheme("light");
      expect(document.documentElement.dataset.theme).toBe("light");
      expect(document.documentElement.dataset.themeExplicit).toBe("true");
      expect(localStorage.getItem("goodman-group-theme")).toBe("light");

      setSiteTheme("dark");
      expect(document.documentElement.dataset.theme).toBe("dark");
      expect(document.documentElement.dataset.themeExplicit).toBe("true");
      expect(localStorage.getItem("goodman-group-theme")).toBe("dark");
    });

    it("handles localStorage write exceptions gracefully without throwing", () => {
      vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
        throw new Error("QuotaExceeded");
      });

      expect(() => setSiteTheme("light")).not.toThrow();
      expect(document.documentElement.dataset.theme).toBe("light");
      expect(document.documentElement.dataset.themeExplicit).toBe("true");
    });
  });
});
