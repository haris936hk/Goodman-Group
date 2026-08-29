import { ArrowLeft, Building2 } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="site-shell inner-page not-found-page" id="top">
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <SiteHeader />
      <main id="main-content" className="not-found-main section-shell">
        <p className="eyebrow">404 / Page not found</p>
        <h1>This route has moved beyond the map.</h1>
        <p>
          The page may have moved, or the address may be incorrect. Return to the
          Group story or continue through the complete company directory.
        </p>
        <div className="not-found-actions">
          <Link className="button button-primary" href="/">
            <ArrowLeft aria-hidden="true" /> Return home
          </Link>
          <Link className="text-link" href="/companies">
            <Building2 aria-hidden="true" /> Browse companies
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
