import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import type { CompanyProfile } from "@/data/companies";

export type CompanyGroupFrameProps = {
  company: CompanyProfile;
  children: ReactNode;
  className?: string;
};

export function CompanyGroupFrame({
  company,
  children,
  className = "",
}: CompanyGroupFrameProps) {
  const relationshipText = company.relationship ?? "A Goodman Group company";

  return (
    <div className={`company-group-frame ${className}`.trim()}>
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>

      <header className="group-frame-header" aria-label="Goodman Group Navigation">
        <div className="group-frame-header-inner">
          <Link href="/" className="group-frame-brand" aria-label="Goodman Group">
            <span className="group-frame-brand-mark" aria-hidden="true">GG</span>
            <span className="group-frame-brand-text">Goodman Group</span>
          </Link>
          <div className="group-frame-relationship">
            <span className="group-frame-relation-text">{relationshipText}</span>
          </div>
          <nav className="group-frame-nav" aria-label="Group navigation">
            <Link href="/companies" className="group-frame-back-link">
              <ArrowLeft aria-hidden="true" className="w-4 h-4" />
              <span>All companies</span>
            </Link>
          </nav>
        </div>
      </header>

      <main id="main-content" tabIndex={-1}>
        {children}
      </main>

      <footer className="group-frame-footer" aria-label="Goodman Group Return">
        <div className="group-frame-footer-inner">
          <div className="group-frame-footer-brand">
            <Link href="/" className="group-frame-footer-home">
              Goodman Group
            </Link>
            <p className="group-frame-footer-desc">
              Parent holding organization · {relationshipText}
            </p>
          </div>
          <div className="group-frame-footer-links">
            <Link href="/companies">All companies</Link>
            <Link href="/">Group home</Link>
            <Link href="/#contact">Contact Group</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
