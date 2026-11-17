import type { ReactNode } from "react";
import type { CompanyProfile } from "@/data/companies";
import { CompanyThemeSync } from "@/components/company-theme-sync";
import { SiteFooter } from "@/components/site-footer";
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
  return (
    <div id="top" className={`company-group-frame ${className}`.trim()} suppressHydrationWarning>
      <CompanyThemeSync />
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>

      <SiteHeader />

      <main id="main-content" tabIndex={-1}>
        {children}
      </main>

      <SiteFooter currentCompanySlug={company.slug} />
    </div>
  );
}
