import type { Metadata } from "next";
import { ArrowLeft, Network } from "lucide-react";
import Link from "next/link";

import { CompanyCard } from "@/components/company-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { companies } from "@/data/companies";

export const metadata: Metadata = {
  title: "Our Companies",
  description:
    "Browse Goodman Group companies and capabilities by sector.",
};

const groupedCompanies = Map.groupBy(companies, (company) => company.sector);

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
              Browse every company in the Goodman Group portfolio. Each profile
              has a stable URL with its facts, leadership, capabilities,
              locations, and inquiry route.
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
          {[...groupedCompanies.entries()].map(([sector, records], index) => (
            <section className="directory-sector" key={sector}>
              <header>
                <span>0{index + 1}</span>
                <h2>{sector}</h2>
                <p>
                  {records.length}{" "}
                  {records.length === 1 ? "record" : "records"}
                </p>
              </header>
              <div
                className={`company-grid company-grid-directory${
                  records.length === 1 ? " company-grid-single" : ""
                }`}
              >
                {records.map((company) => (
                  <CompanyCard key={company.slug} company={company} compact />
                ))}
              </div>
            </section>
          ))}

          <section className="additional-sectors glass-overlay">
            <span>Additional sectors</span>
            <div>
              <h2>Automotive</h2>
              <p>Automobiles are among Goodman Group&apos;s areas of activity.</p>
            </div>
            <div>
              <h2>Real Estate</h2>
              <p>Real estate is among Goodman Group&apos;s areas of activity.</p>
            </div>
          </section>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
