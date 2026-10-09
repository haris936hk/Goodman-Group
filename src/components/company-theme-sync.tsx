"use client";

import { useEffect } from "react";
import { readSiteTheme } from "@/lib/site-theme";

const palettes = [
  { className: "wal-green-page", light: "#faf8f5", dark: "#111b16" },
  { className: "geron-page", light: "#f8f5ff", dark: "#0c0817" },
  { className: "laboratories-page", light: "#fcfaf7", dark: "#191416" },
  { className: "billing-page", light: "#fafbf8", dark: "#101c19" },
  { className: "medical-equipment-page", light: "#fafbfc", dark: "#101c26" },
] as const;

export function CompanyThemeSync(): null {
  useEffect(() => {
    const shell = document.querySelector<HTMLElement>(".company-group-frame");
    const palette = palettes.find(({ className }) => shell?.classList.contains(className));
    if (!shell || !palette) return;

    const apply = () => {
      if (!shell.isConnected) return;
      const theme = readSiteTheme();
      shell.dataset.theme = theme;
      document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]').forEach((meta) => {
        meta.content = palette[theme];
      });
    };
    apply();
    const themeObserver = new MutationObserver(apply);
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    const headObserver = new MutationObserver(apply);
    headObserver.observe(document.head, { childList: true });
    return () => {
      themeObserver.disconnect();
      headObserver.disconnect();
    };
  }, []);
  return null;
}
