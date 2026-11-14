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

export const initializeGroupTheme = `(function () {
  var theme = "dark";
  var hasExplicit = false;
  try {
    var stored = localStorage.getItem("goodman-group-theme");
    if (stored === "light" || stored === "dark") {
      theme = stored;
      hasExplicit = true;
    }
  } catch (error) {}

  if (!hasExplicit) {
    try {
      if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
        theme = "dark";
      } else if (window.matchMedia) {
        theme = "light";
      }
    } catch (error) {
      theme = "dark";
    }
  } else {
    document.documentElement.dataset.themeExplicit = "true";
  }

  document.documentElement.dataset.theme = theme;

  function apply(activeTheme) {
    var companyShell = document.querySelector(".wal-green-page, .geron-page, .laboratories-page, .billing-page, .medical-equipment-page, .technologies-page");
    if (companyShell) {
      var isBilling = companyShell.classList.contains("billing-page");
      var isGeron = companyShell.classList.contains("geron-page");
      var isLaboratories = companyShell.classList.contains("laboratories-page");
      var isMedical = companyShell.classList.contains("medical-equipment-page");
      var isTechnologies = companyShell.classList.contains("technologies-page");
      companyShell.dataset.theme = activeTheme;
      document.querySelectorAll('meta[name="theme-color"]').forEach(function (meta) {
        meta.content = isBilling
          ? (activeTheme === "dark" ? "#101c19" : "#fafbf8")
          : isGeron
            ? (activeTheme === "dark" ? "#0c0817" : "#f8f5ff")
            : isLaboratories
              ? (activeTheme === "dark" ? "#191416" : "#fcfaf7")
              : isMedical
                ? (activeTheme === "dark" ? "#101c26" : "#fafbfc")
                : isTechnologies
                  ? (activeTheme === "dark" ? "#080d1c" : "#f7f7fc")
                  : (activeTheme === "dark" ? "#111b16" : "#faf8f5");
      });
      return true;
    }
    var shell = document.querySelector(".site-shell");
    if (!shell) return false;
    shell.dataset.theme = activeTheme;
    document.querySelectorAll('meta[name="theme-color"]').forEach(function (meta) {
      meta.content = activeTheme === "light" ? "#ffffff" : "#06111f";
    });
    return true;
  }

  if (!apply(theme)) {
    var observer = new MutationObserver(function () {
      if (apply(document.documentElement.dataset.theme || theme)) observer.disconnect();
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
    document.addEventListener("DOMContentLoaded", function () {
      observer.disconnect();
    }, { once: true });
  }

  try {
    var mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    function onMediaChange(e) {
      var explicit = false;
      try {
        var val = localStorage.getItem("goodman-group-theme");
        if (val === "light" || val === "dark") explicit = true;
      } catch (err) {}
      if (document.documentElement.dataset.themeExplicit === "true") explicit = true;
      if (explicit) return;

      var nextTheme = e.matches ? "dark" : "light";
      document.documentElement.dataset.theme = nextTheme;
      apply(nextTheme);
    }
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", onMediaChange);
    } else if (mediaQuery.addListener) {
      mediaQuery.addListener(onMediaChange);
    }
  } catch (err) {}
})()`;

export function syncDocumentTheme(): void {
  if (typeof document === "undefined") return;
  const root = document.documentElement;

  let theme: Theme = "dark";
  let hasExplicit = false;

  try {
    const stored = localStorage.getItem("goodman-group-theme");
    if (stored === "light" || stored === "dark") {
      theme = stored;
      hasExplicit = true;
    }
  } catch {
    // Storage inaccessible or denied
  }
  const current = root.dataset.theme;
  if (!hasExplicit && root.dataset.themeExplicit === "true" && (current === "light" || current === "dark")) {
    theme = current;
    hasExplicit = true;
  }

  if (!hasExplicit) {
    if (typeof window !== "undefined" && typeof window.matchMedia === "function") {
      try {
        theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      } catch {
        theme = "dark";
      }
    }
  } else {
    root.dataset.themeExplicit = "true";
  }

  root.dataset.theme = theme;

  const shell = document.querySelector<HTMLElement>(".site-shell");
  if (shell) {
    shell.dataset.theme = theme;
  }

  document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]').forEach((meta) => {
    meta.content = theme === "light" ? "#ffffff" : "#06111f";
  });
}
