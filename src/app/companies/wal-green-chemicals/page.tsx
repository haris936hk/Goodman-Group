import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { CompanyGroupFrame } from "@/components/company-group-frame";
import { getCompanyBySlug } from "@/data/companies";
import "./walgreen.css";

const company = getCompanyBySlug("wal-green-chemicals")!;

export const metadata: Metadata = {
  title: company.displayName,
  description: company.summary,
};

export default function WalGreenChemicalsPage() {
  const leader = company.leadership[0];

  return (
    <CompanyGroupFrame company={company} className="wal-green-page">
      <header className="wg-hero">
        <div className="wg-hero-inner">
          <div className="wg-topline">
            <div className="wg-legal-badge">
              <span>Corporate Entity: {company.legalName ?? company.displayName}</span>
            </div>
            <div>
              <span>Chemical Operations · Goodman Group Portfolio</span>
            </div>
          </div>

          <div className="wg-hero-grid">
            <div className="wg-copy-area">
              <span className="wg-brand-descriptor">
                {company.business}
              </span>
              <h1>{company.displayName}</h1>
              <p className="wg-summary-lead">{company.summary}</p>
            </div>

            <div className="wg-logo-stage">
              <Image
                src={company.logo}
                alt={`${company.displayName} logo`}
                width={company.logoWidth}
                height={company.logoHeight}
                priority
                sizes="(max-width: 640px) 220px, 280px"
              />
              <svg
                className="wg-swoosh-line"
                viewBox="0 0 160 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M5 15 C 40 5, 100 18, 155 8"
                  stroke="#5fbf92"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        </div>
      </header>

      <div className="wg-body-sections">
        <section className="wg-region-card" aria-labelledby="wg-entity-heading">
          <div className="wg-card-header">
            <h2 id="wg-entity-heading">Corporate Profile &amp; Governance</h2>
            <span className="wg-card-tag">LEGAL IDENTITY</span>
          </div>

          <div className="wg-two-col-grid">
            <div className="wg-detail-block">
              <h3>{company.legalName ?? company.displayName}</h3>
              <div className="wg-detail-role">Incorporated Entity</div>
              <p>
                An incorporated chemicals enterprise within Goodman Group,
                operating under group corporate governance and commercial discipline.
              </p>
            </div>

            <div className="wg-detail-block">
              <h3>Chemicals</h3>
              <div className="wg-detail-role">Core Business Capability</div>
              <p>
                Provides targeted chemical sourcing, supply, and operational services
                supporting industrial and institutional client requirements.
              </p>
            </div>
          </div>
        </section>

        {leader ? (
          <section className="wg-region-card" aria-labelledby="wg-leadership-heading">
            <div className="wg-card-header">
              <h2 id="wg-leadership-heading">Executive Management</h2>
              <span className="wg-card-tag">LEADERSHIP</span>
            </div>

            <div className="wg-two-col-grid">
              <div className="wg-detail-block">
                <h3>{leader.name}</h3>
                <div className="wg-detail-role">{leader.role}</div>
                <p>{leader.detail}</p>
              </div>

              <div className="wg-detail-block" style={{ alignSelf: "center" }}>
                <Link
                  href="/#contact"
                  className="wg-brand-descriptor"
                  style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}
                >
                  <span>Connect with Goodman Group</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </section>
        ) : null}
      </div>
    </CompanyGroupFrame>
  );
}
