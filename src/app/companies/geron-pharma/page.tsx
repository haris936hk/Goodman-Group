import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { CompanyGroupFrame } from "@/components/company-group-frame";
import { getCompanyBySlug } from "@/data/companies";
import "./geron.css";

const company = getCompanyBySlug("geron-pharma")!;

export const metadata: Metadata = {
  title: company.displayName,
  description: company.summary,
};

export default function GeronPharmaPage() {
  const leader = company.leadership[0];

  return (
    <CompanyGroupFrame company={company} className="geron-page">
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
                <Image
                  src={company.logo}
                  alt={`${company.displayName} logo`}
                  width={company.logoWidth}
                  height={company.logoHeight}
                  priority
                  sizes="(max-width: 640px) 200px, 280px"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="geron-network-section" aria-labelledby="geron-structure-heading">
        <div className="geron-section-intro">
          <h2 id="geron-structure-heading">Verified company information</h2>
          <p>
            The supplied company profile verifies Geron Pharma’s legal identity,
            pharmaceutical sector context, and chief executive.
          </p>
        </div>

        <div className="geron-circular-nodes-grid">
          <article className="geron-node-card">
            <span className="geron-node-badge">Corporate Entity</span>
            <h3>Legal Identity</h3>
            <p>
              The company’s legal name is {company.legalName ?? company.displayName}
            </p>
          </article>

          <article className="geron-node-card">
            <span className="geron-node-badge">Operational Scope</span>
            <h3>Sector Context</h3>
            <p>
              The supplied profile identifies Geron Pharma as a pharmaceutical business.
            </p>
          </article>

          {leader ? (
            <article className="geron-node-card">
              <span className="geron-node-badge">Leadership</span>
              <h3>{leader.name}</h3>
              <p className="geron-node-role">{leader.role}</p>
              <p>{leader.detail}</p>
            </article>
          ) : null}

          <article className="geron-node-card">
            <span className="geron-node-badge">Profile Boundary</span>
            <h3>Profile Scope</h3>
            <p>
              The supplied profile does not provide a separate company overview,
              address, product portfolio, services, markets, customers, or
              contact details.
            </p>
          </article>
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
