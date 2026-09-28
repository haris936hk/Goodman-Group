import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
      <body>{children}</body>
    </html>
  );
}
