import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { readSiteTheme, setSiteTheme, syncDocumentTheme } from "./site-theme";

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

  describe("syncDocumentTheme", () => {
    it("applies stored light preference to document and shell elements", () => {
      localStorage.setItem("goodman-group-theme", "light");
      const shell = document.createElement("div");
      shell.className = "site-shell";
      document.body.appendChild(shell);

      syncDocumentTheme();

      expect(document.documentElement.dataset.theme).toBe("light");
      expect(document.documentElement.dataset.themeExplicit).toBe("true");
      expect(shell.dataset.theme).toBe("light");
      shell.remove();
    });
    it("preserves an explicit in-document preference when storage is inaccessible", () => {
      document.documentElement.dataset.theme = "light";
      document.documentElement.dataset.themeExplicit = "true";
      vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => { throw new Error("storage denied"); });
      vi.stubGlobal("matchMedia", vi.fn().mockReturnValue({ matches: true }));
      syncDocumentTheme();
      expect(document.documentElement.dataset.theme).toBe("light");
    });

    it.each([false, true])("applies device preference without persisting an explicit override (dark=%s)", (dark) => {
      vi.stubGlobal("matchMedia", vi.fn().mockReturnValue({ matches: dark }));
      const shell = document.createElement("div");
      shell.className = "site-shell";
      const meta = document.createElement("meta");
      meta.name = "theme-color";
      document.body.append(shell);
      document.head.append(meta);
      try {
        syncDocumentTheme();
        expect(shell.dataset.theme).toBe(dark ? "dark" : "light");
        expect(meta.content).toBe(dark ? "#06111f" : "#ffffff");
        expect(document.documentElement.dataset.themeExplicit).toBeUndefined();
        expect(localStorage.getItem("goodman-group-theme")).toBeNull();
      } finally {
        shell.remove();
        meta.remove();
      }
    });

    it("retains a safe theme when storage and device preference queries both fail", () => {
      vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => { throw new Error("storage denied"); });
      vi.stubGlobal("matchMedia", vi.fn().mockImplementation(() => { throw new Error("media unavailable"); }));
      syncDocumentTheme();
      expect(document.documentElement.dataset.theme).toBe("dark");
    });
  });
});
