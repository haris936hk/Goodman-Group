import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { ArrowLeft, ArrowUpRight, Network } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { companies } from "@/data/companies";

export const metadata: Metadata = {
  title: "Our Companies",
  description:
    "Browse Goodman Group companies and capabilities through direct portfolio discovery.",
};

export default function CompaniesPage() {
  return (
    <div className="site-shell inner-page" id="top">
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
            <h1>Distinct companies. One clear view.</h1>
            <p>
              Browse every company in the Goodman Group portfolio. Each company
              has a bespoke destination with its verified facts, leadership,
              capabilities, and direct inquiry route.
            </p>
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
              <li
                key={company.slug}
                className="directory-company-panel glass-panel"
                style={{ "--company-accent": company.accent } as CSSProperties}
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
              </li>
            ))}
          </ul>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
