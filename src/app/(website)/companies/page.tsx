import type { Metadata } from "next";
import { ArrowLeft, ArrowUpRight, Network } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { MouseGlowCard } from "@/components/mouse-glow-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { companies } from "@/data/companies";
import { OrganizationJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Our Companies",
  description:
    "Browse Goodman Group companies and capabilities through direct portfolio discovery.",
  alternates: {
    canonical: "/companies",
  },
};

export default function CompaniesPage() {
  return (
    <div className="site-shell inner-page" id="top" suppressHydrationWarning>
      <OrganizationJsonLd />
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <SiteHeader />
      <main id="main-content" tabIndex={-1}>
        <section className="directory-hero section-shell">
          <Link className="back-link" href="/">
            <ArrowLeft aria-hidden="true" /> Back to the Group
          </Link>
          <div className="directory-heading">
            <p className="eyebrow">
              <Network aria-hidden="true" /> Goodman Group portfolio
            </p>
            <h1>Our Companies</h1>
          </div>
        </section>

        <section
          className="directory-content section-shell"
          aria-labelledby="directory-title"
        >
          <h2 id="directory-title" className="sr-only">
            Company directory
          </h2>

          <ul className="company-directory-list">
            {companies.map((company, index) => (
              <MouseGlowCard
                as="li"
                key={company.slug}
                accent={company.accent}
                className="directory-company-panel glass-panel"
              >
                <div className="directory-panel-brand">
                  <span className="directory-panel-index">0{index + 1}</span>
                  <div className="directory-panel-logo glass-opaque">
                    {company.logo ? (
                      <Image
                        src={company.logo.src}
                        alt={`${company.displayName} logo`}
                        width={company.logo.width}
                        height={company.logo.height}
                        sizes="(max-width: 640px) 180px, 220px"
                      />
                    ) : (
                      <span className="directory-text-identity">
                        {company.displayName}
                      </span>
                    )}
                  </div>
                </div>

                <div className="directory-panel-content">
                  <div className="directory-panel-header">
                    <span className="directory-panel-business">
                      {company.business}
                    </span>
                    <h3>{company.displayName}</h3>
                    {company.legalName ? (
                      <span className="directory-panel-legal">
                        {company.legalName}
                      </span>
                    ) : null}
                  </div>
                  <p className="directory-panel-summary">{company.summary}</p>

                  {company.locations.length > 0 ? (
                    <p className="directory-panel-locations">
                      <strong>Locations:</strong> {company.locations.join(", ")}
                    </p>
                  ) : null}
                </div>

                <div className="directory-panel-action">
                  <Link
                    href={`/companies/${company.slug}`}
                    className="directory-view-link"
                    aria-label={`View ${company.displayName}`}
                  >
                    <span>View {company.displayName}</span>
                    <ArrowUpRight aria-hidden="true" />
                  </Link>
                </div>
              </MouseGlowCard>
            ))}
          </ul>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
