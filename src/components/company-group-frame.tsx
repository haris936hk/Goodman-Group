import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { companies, type CompanyProfile } from "@/data/companies";
import { CompanyThemeSync } from "@/components/company-theme-sync";
import { SiteHeader } from "@/components/site-header";

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
    <div className={`company-group-frame ${className}`.trim()} suppressHydrationWarning>
      <CompanyThemeSync />
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>

      <SiteHeader />

      <main id="main-content" tabIndex={-1}>
        {children}
      </main>

      <footer className="group-frame-footer" aria-label="Goodman Group">
        <div className="group-frame-footer-inner">
          <div className="group-frame-footer-brand">
            <Link href="/" className="group-frame-footer-home" aria-label="Goodman Group">
              <Image src="/assets/logos/GG-white.png" alt="Goodman Group" width={280} height={119} className="group-frame-footer-logo" />
            </Link>
            <p className="group-frame-footer-statement">Distinct expertise.<br />One Goodman Group.</p>
            <p className="group-frame-footer-desc">{relationshipText}</p>
            <Link href="/#contact" className="group-frame-contact">
              Contact Group <ArrowUpRight aria-hidden="true" size={18} />
            </Link>
          </div>
          <nav className="group-frame-company-links" aria-label="Our companies">
            <h2 className="group-frame-eyebrow">Explore our companies</h2>
            <ul>
              {companies.map((item, index) => (
                <li key={item.slug}>
                  <Link href={`/companies/${item.slug}`} aria-current={item.slug === company.slug ? "page" : undefined}>
                    <span className="group-frame-company-index" aria-hidden="true">0{index + 1}</span>
                    <span>{item.displayName}</span>
                    <ArrowUpRight aria-hidden="true" size={18} />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="group-frame-footer-bottom">
          <span>© {new Date().getFullYear()} Goodman Group</span>
          <nav className="group-frame-footer-links" aria-label="Group footer navigation">
            <Link href="/">Group home</Link>
            <Link href="/companies">All companies <ArrowUpRight aria-hidden="true" size={14} /></Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
