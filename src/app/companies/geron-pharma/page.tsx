import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { MouseGlowCard } from "@/components/mouse-glow-card";

import { CompanyGroupFrame } from "@/components/company-group-frame";
import { getCompanyBySlug } from "@/data/companies";
import { OrganizationJsonLd } from "@/lib/structured-data";
import "./geron.css";

const company = getCompanyBySlug("geron-pharma")!;
const geronAccent = "var(--geron-purple)";

export const metadata: Metadata = {
  title: company.displayName,
  description: company.summary,
  alternates: {
    canonical: "/companies/geron-pharma",
  },
};

export default function GeronPharmaPage() {
  const leader = company.leadership[0];

  return (
    <CompanyGroupFrame company={company} className="geron-page">
      <OrganizationJsonLd company={company} />
      <header className="geron-hero">
        <div className="geron-hero-inner">
          <div className="geron-badge-row">
            <div className="geron-pill">
              <span className="geron-pill-dot" aria-hidden="true" />
              <span>
                Legal name: {company.legalName ?? company.displayName}
              </span>
            </div>
            <div className="geron-pill">
              <span>Pharmaceutical business</span>
            </div>
          </div>

          <div className="geron-hero-main">
            <div className="geron-headings-area">
              <span className="geron-business-category">
                {company.business}
              </span>
              <h1>{company.displayName}</h1>
              <p className="geron-summary-lead">{company.summary}</p>
            </div>

            <div className="geron-circular-stage">
              <div className="geron-orbit-ring" aria-hidden="true">
                <span className="geron-orbit-node" />
              </div>
              <div className="geron-circle-center">
                {company.logo ? (
                  <Image
                    src={company.logo.src}
                    alt={`${company.displayName} logo`}
                    width={company.logo.width}
                    height={company.logo.height}
                    priority
                    sizes="(max-width: 640px) 200px, 280px"
                  />
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="geron-network-section" aria-labelledby="geron-structure-heading">
        <div className="geron-section-intro">
          <h2 id="geron-structure-heading">Company information</h2>
          <p>
            Key corporate facts and leadership for Geron Pharma (Pvt.) Ltd.
          </p>
        </div>

        <div className="geron-facts-grid">
          <MouseGlowCard
            accent={geronAccent}
            className="company-card glass-panel geron-fact-card"
          >
            <span className="geron-fact-label">Legal identity</span>
            <h3 className="geron-fact-heading">
              {company.legalName ?? company.displayName}
            </h3>
          </MouseGlowCard>

          <MouseGlowCard
            accent={geronAccent}
            className="company-card glass-panel geron-fact-card"
          >
            <span className="geron-fact-label">Business</span>
            <h3 className="geron-fact-heading">{company.business}</h3>
          </MouseGlowCard>

          {leader ? (
            <MouseGlowCard
              accent={geronAccent}
              className="company-card glass-panel geron-fact-card"
            >
              <span className="geron-fact-label">Leadership</span>
              <div>
                <h3 className="geron-fact-heading">{leader.name}</h3>
                <p className="geron-fact-detail">{leader.detail}</p>
              </div>
            </MouseGlowCard>
          ) : null}
        </div>

        <div style={{ marginTop: "3.5rem", textAlign: "center" }}>
          <Link
            href="/#contact"
            className="geron-pill"
            style={{ textDecoration: "none", display: "inline-flex" }}
          >
            <span>Direct inquiries via Goodman Group</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </CompanyGroupFrame>
  );
}
