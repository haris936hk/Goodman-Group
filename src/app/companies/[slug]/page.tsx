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
            <h2>Precise facts will live here.</h2>
            <p>
              This profile framework is ready for approved company information.
              It deliberately does not infer legal, operational, or leadership
              claims from legacy material.
            </p>
          </header>

          <div className="record-grid">
            <article className="record-panel glass-panel">
              <Network aria-hidden="true" />
              <span>Group relationship</span>
              <strong>Pending verification</strong>
              <p>Subsidiary, associate, joint venture, brand, or partner.</p>
            </article>
            <article className="record-panel glass-panel">
              <MapPin aria-hidden="true" />
              <span>Locations and markets</span>
              <strong>Pending verification</strong>
              <p>Registered office, operations, and status-labelled markets.</p>
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
              "Products, services, facilities, and areas of operation.",
            ],
            [
              "Leadership",
              "Approved leaders, current roles, and professional biographies.",
            ],
            [
              "Evidence",
              "Licences, certifications, documents, and quality systems.",
            ],
            [
              "Contact route",
              "Publication awaits a confirmed owner and functional destination.",
            ],
          ].map(([title, copy], index) => (
            <article key={title}>
              <span>0{index + 1}</span>
              <h2>{title}</h2>
              <p>{copy}</p>
              <small>Content awaiting approval</small>
            </article>
          ))}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
