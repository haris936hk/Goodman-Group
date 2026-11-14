import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import type { ReactNode } from "react";

import { goodmanGroup, SITE_ORIGIN } from "@/data/goodman-group";
import { initializeGroupTheme } from "@/lib/site-theme";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  title: {
    default: goodmanGroup.websiteTitle,
    template: "%s | Goodman Group",
  },
  description:
    "Goodman Group brings together companies and capabilities across healthcare, medical equipment, chemicals, software development, and other business areas.",
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
