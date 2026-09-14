import type { Metadata } from "next";
import { ArrowLeft, MapPin, Network } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { companies, getCompanyBySlug } from "@/data/companies";

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
            </div>
          </div>
          <p className="company-summary">{company.summary}</p>
        </section>

        <section className="company-record section-shell">
          <header>
            <p className="chapter-index">Company record</p>
            <h2>Company information.</h2>
            <p>
              Explore the company&apos;s capabilities, leadership, locations, and
              ways to connect with Goodman Group.
            </p>
          </header>

          <div className="record-grid">
            <article className="record-panel glass-panel">
              <Network aria-hidden="true" />
              <span>Legal identity</span>
              <strong>{company.legalName ?? company.displayName}</strong>
              <p>{company.relationship ?? "Goodman Group company"}</p>
            </article>
            {company.locations.length > 0 ? (
              <article className="record-panel glass-panel">
                <MapPin aria-hidden="true" />
                <span>Locations and markets</span>
                <strong>{company.locations.join(" · ")}</strong>
                <p>Operating locations and markets associated with this company.</p>
              </article>
            ) : null}
          </div>
        </section>

        <section className="profile-modules section-shell">
          {[
            {
              title: "Capabilities",
              copy:
                company.capabilities.length > 0
                  ? company.capabilities.join(", ")
                  : "Products, services, facilities, and areas of operation.",
            },
            {
              title: "Leadership",
              copy:
                company.leadership.length > 0
                  ? company.leadership
                      .map((leader) => `${leader.name} — ${leader.role}`)
                      .join("; ")
                  : "Current leaders and professional biographies.",
            },
            {
              title: "Evidence",
              copy: "Licences, certifications, documents, and quality systems.",
            },
            {
              title: "Contact route",
              copy: "Contact Goodman Group for company inquiries.",
            },
          ].map(({ title, copy }, index) => (
            <article key={title}>
              <span>0{index + 1}</span>
              <h2>{title}</h2>
              <p>{copy}</p>
            </article>
          ))}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
