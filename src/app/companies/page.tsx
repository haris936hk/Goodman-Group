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
    "Browse Goodman Group provisional discovery records by sector. Company relationships and operating details remain subject to business and legal approval.",
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
              Browse every provisional company record in semantic content. Each
              profile has a stable URL and will hold its own approved facts,
              leadership, evidence, locations, and inquiry route.
            </p>
          </div>
          <div className="directory-status glass-panel">
            <span>Portfolio status</span>
            <strong>Verification in progress</strong>
            <p>
              Entity names and relationships are not presented as legally
              approved until the Group register is validated.
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
                  {records.length} provisional{" "}
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

          <section className="unconfirmed-sectors glass-overlay">
            <span>Register under review</span>
            <div>
              <h2>Automotive</h2>
              <p>Operating entities to be confirmed.</p>
            </div>
            <div>
              <h2>Real Estate</h2>
              <p>Operating entities to be confirmed.</p>
            </div>
          </section>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
