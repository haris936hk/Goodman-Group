import type { Metadata } from "next";
import { ArrowLeft, Clock3, FileWarning, MapPin, Network } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import {
  companies,
  getCompanyBySlug,
  isCompanyPublished,
} from "@/data/companies";

type CompanyPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return companies.map((company) => ({ slug: company.slug }));
}

export async function generateMetadata({
  params,
}: CompanyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const company = getCompanyBySlug(slug);

  if (!company) {
    return {
      title: "Company not found",
      robots: { index: false, follow: false },
    };
  }

  if (!isCompanyPublished(company)) {
    return {
      title: company.displayName,
      description:
        "A provisional Goodman Group discovery record. Legal identity, Group relationship, and operating details remain subject to business and legal approval.",
      robots: { index: false, follow: true },
    };
  }

  return {
    title: company.displayName,
    description: company.summary,
  };
}

export default async function CompanyPage({ params }: CompanyPageProps) {
  const { slug } = await params;
  const company = getCompanyBySlug(slug);

  if (!company) {
    notFound();
  }

  return (
    <div
      className="site-shell inner-page company-page"
      id="top"
      style={{ "--company-accent": company.accent } as CSSProperties}
    >
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <SiteHeader />
      <main id="main-content" tabIndex={-1}>
        <section className="company-masthead section-shell">
          <Link className="back-link" href="/companies">
            <ArrowLeft aria-hidden="true" /> All companies
          </Link>
          <div className="company-identity">
            <div className="company-profile-logo glass-opaque">
              <Image
                src={company.logo}
                alt={`${company.displayName} logo`}
                width={company.logoWidth}
                height={company.logoHeight}
                sizes="(max-width: 640px) 256px, 272px"
                priority
              />
            </div>
            <div>
              <p className="eyebrow">{company.sector}</p>
              <h1>{company.displayName}</h1>
              <p className="company-relationship">
                <FileWarning aria-hidden="true" />
                {company.relationshipLabel}
              </p>
            </div>
          </div>
          {!isCompanyPublished(company) ? (
            <aside
              className="company-publication-status glass-panel"
              aria-label="Publication status"
            >
              <strong>Preview record — not publication-ready</strong>
              <p>
                Legal identity, Group relationship, operations, leadership,
                evidence, and contact ownership await business and legal approval.
              </p>
            </aside>
          ) : null}
          <p className="company-summary">{company.summary}</p>
        </section>

        <section className="company-record section-shell">
          <header>
            <p className="chapter-index">Company record</p>
            <h2>Information found in the current source.</h2>
            <p>
              This profile reflects the company and leadership information
              currently published or represented in Goodman Group source
              material. Formal legal and operational approval is still required.
            </p>
          </header>

          <div className="record-grid">
            <article className="record-panel glass-panel">
              <Network aria-hidden="true" />
              <span>Group relationship</span>
              <strong>Pending verification</strong>
              <p>{company.relationshipLabel}. Formal relationship classification has not been published.</p>
            </article>
            <article className="record-panel glass-panel">
              <MapPin aria-hidden="true" />
              <span>Locations and markets</span>
              <strong>
                {company.locations.length > 0
                  ? company.locations.join(" · ")
                  : "Not stated on the current site"}
              </strong>
              <p>
                Locations and markets are shown only where the current source
                provides them.
              </p>
            </article>
            <article className="record-panel glass-panel">
              <Clock3 aria-hidden="true" />
              <span>Record freshness</span>
              <strong>{company.lastReviewed}</strong>
              <p>An approved record will carry an accountable review date.</p>
            </article>
          </div>
        </section>

        <section className="profile-modules section-shell">
          {[
            [
              "Capabilities",
              company.capabilities.length > 0
                ? company.capabilities.join(", ")
                : "Products, services, facilities, and areas of operation.",
              company.capabilities.length > 0
                ? "Listed in current source material"
                : "Content awaiting approval",
            ],
            [
              "Leadership",
              company.leadership.length > 0
                ? company.leadership
                    .map((leader) => `${leader.name} — ${leader.role}`)
                    .join("; ")
                : "Current leaders and professional biographies.",
              company.leadership.length > 0
                ? "Listed on the current Goodman Group site"
                : "Content awaiting approval",
            ],
            [
              "Evidence",
              "Licences, certifications, documents, and quality systems.",
              "Content awaiting approval",
            ],
            [
              "Contact route",
              "No company-specific contact route is published on the current Goodman Group site.",
              "Content awaiting approval",
            ],
          ].map(([title, copy, status], index) => (
            <article key={title}>
              <span>0{index + 1}</span>
              <h2>{title}</h2>
              <p>{copy}</p>
              <small>{status}</small>
            </article>
          ))}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
