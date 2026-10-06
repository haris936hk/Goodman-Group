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
  try {
    if (localStorage.getItem("goodman-group-theme") === "light") theme = "light";
  } catch (error) {}

  function apply() {
    var shell = document.querySelector(".site-shell");
    if (!shell) return false;
    shell.dataset.theme = theme;
    var chrome = document.querySelector('meta[name="theme-color"]');
    if (chrome) chrome.content = theme === "light" ? "#ffffff" : "#06111f";
    return true;
  }

  if (apply()) return;
  var observer = new MutationObserver(function () {
    if (apply()) observer.disconnect();
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });
  document.addEventListener("DOMContentLoaded", function () {
    observer.disconnect();
  }, { once: true });
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
  colorScheme: "dark",
  themeColor: "#06111f",
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body>
        <Script id="group-theme-init" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: initializeGroupTheme }} />
        {children}
      </body>
    </html>
  );
}
