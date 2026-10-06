"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const storageKey = "goodman-group-theme";
type Theme = "dark" | "light";

function savedTheme(): Theme {
  try {
    return localStorage.getItem(storageKey) === "light" ? "light" : "dark";
  } catch {
    return "dark";
  }
}

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
    const preference = savedTheme();
    setChromeTheme(preference);
    shell.dataset.theme = preference;
    setTheme(preference);
    const observer = new MutationObserver(() => {
      if (shell.isConnected) setChromeTheme(shell.dataset.theme === "light" ? "light" : "dark");
    });
    observer.observe(document.head, { childList: true });
    return () => {
      observer.disconnect();
      setChromeTheme("dark");
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
        const shell = buttonRef.current?.closest<HTMLElement>(".site-shell");
        if (shell) shell.dataset.theme = next;
        setChromeTheme(next);
        const backdrop = document.querySelector<HTMLElement>(".mobile-nav-backdrop");
        if (backdrop) backdrop.dataset.theme = next;
        setTheme(next);
        try {
          localStorage.setItem(storageKey, next);
        } catch {
          // Storage may be disabled; the current page remains usable.
        }
      }}
    >
      {theme === "dark" ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
    </button>
  );
}
