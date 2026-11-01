import type { ReactNode } from "react";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

import "./blog.css";

export default function BlogLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className="site-shell inner-page blog-site-shell" id="top" suppressHydrationWarning>
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <SiteHeader />
      {children}
      <SiteFooter />
    </div>
  );
}
