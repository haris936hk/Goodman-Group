export type Theme = "dark" | "light";

export function readSiteTheme(): Theme {
  if (typeof document !== "undefined") {
    const current = document.documentElement.dataset.theme;
    if (current === "light" || current === "dark") return current;
  }
  try {
    const stored = localStorage.getItem("goodman-group-theme");
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    // Storage inaccessible or denied
  }
  if (typeof window !== "undefined" && typeof window.matchMedia === "function") {
    try {
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    } catch {
      return "dark";
    }
  }
  return "dark";
}

export function setSiteTheme(theme: Theme): void {
  if (typeof document !== "undefined") {
    document.documentElement.dataset.theme = theme;
    document.documentElement.dataset.themeExplicit = "true";
  }
  try {
    localStorage.setItem("goodman-group-theme", theme);
  } catch {
    // The document retains the current preference when storage is unavailable.
  }
}
