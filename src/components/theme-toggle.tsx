"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { readSiteTheme, setSiteTheme, type Theme } from "@/lib/site-theme";

function setChromeTheme(theme: Theme) {
  document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]').forEach((meta) => {
    meta.content = theme === "light" ? "#ffffff" : "#06111f";
  });
}

export function ThemeToggle() {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const shell = buttonRef.current?.closest<HTMLElement>(".site-shell");
    if (!shell) return;

    const applyThemeToShell = (currentTheme: Theme) => {
      setTheme(currentTheme);
      if (shell.isConnected) {
        shell.dataset.theme = currentTheme;
        setChromeTheme(currentTheme);
        const backdrop = document.querySelector<HTMLElement>(".mobile-nav-backdrop");
        if (backdrop) backdrop.dataset.theme = currentTheme;
      }
    };

    const preference = readSiteTheme();
    applyThemeToShell(preference);

    const rootObserver = new MutationObserver(() => {
      const current = readSiteTheme();
      applyThemeToShell(current);
    });
    rootObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    const headObserver = new MutationObserver(() => {
      if (shell.isConnected) {
        setChromeTheme(shell.dataset.theme === "light" ? "light" : "dark");
      }
    });
    headObserver.observe(document.head, { childList: true });

    return () => {
      rootObserver.disconnect();
      headObserver.disconnect();
    };
  }, []);

  return (
    <button
      ref={buttonRef}
      className="theme-toggle"
      type="button"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      aria-pressed={theme === "light"}
      onClick={() => {
        const next = theme === "dark" ? "light" : "dark";
        setSiteTheme(next);
        const shell = buttonRef.current?.closest<HTMLElement>(".site-shell");
        if (shell) shell.dataset.theme = next;
        setChromeTheme(next);
        const backdrop = document.querySelector<HTMLElement>(".mobile-nav-backdrop");
        if (backdrop) backdrop.dataset.theme = next;
        setTheme(next);
      }}
    >
      {theme === "dark" ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
    </button>
  );
}
