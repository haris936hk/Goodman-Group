import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import type { ReactNode } from "react";

import { goodmanGroup } from "@/data/goodman-group";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const initializeGroupTheme = `(function () {
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
    var companyShell = document.querySelector(".wal-green-page, .geron-page, .laboratories-page, .billing-page, .medical-equipment-page");
    if (companyShell) {
      var isBilling = companyShell.classList.contains("billing-page");
      var isGeron = companyShell.classList.contains("geron-page");
      var isLaboratories = companyShell.classList.contains("laboratories-page");
      var isMedical = companyShell.classList.contains("medical-equipment-page");
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

export const metadata: Metadata = {
  metadataBase: new URL("https://goodmangoc.com/"),
  title: {
    default: goodmanGroup.websiteTitle,
    template: "%s | Goodman Group",
  },
  description:
    "Goodman Group brings together companies and capabilities across healthcare, medical equipment, chemicals, and other business areas.",
  alternates: {
    canonical: "/",
  },
};

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: "#06111f",
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html
      lang="en"
      data-theme="dark"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body>
        <Script id="group-theme-init" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: initializeGroupTheme }} />
        {children}
      </body>
    </html>
  );
}
