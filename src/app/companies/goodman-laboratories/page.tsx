import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { CompanyGroupFrame } from "@/components/company-group-frame";
import { getCompanyBySlug } from "@/data/companies";
import "./laboratories.css";

const company = getCompanyBySlug("goodman-laboratories")!;

export const metadata: Metadata = {
  title: company.displayName,
  description: company.summary,
};

export default function GoodmanLaboratoriesPage() {
  const leader = company.leadership[0];

  return (
    <CompanyGroupFrame company={company} className="laboratories-page">
      <header className="lab-hero">
        <div className="lab-hero-inner">
          <div className="lab-meta-bar">
            <div>
              Legal entity:{" "}
              <span className="lab-legal-tag">
                {company.legalName ?? company.displayName}
              </span>
            </div>
            <div className="lab-indicator">
              <span className="lab-indicator-dot" aria-hidden="true" />
              <span>Active Operation · Goodman Portfolio</span>
            </div>
          </div>

          <div className="lab-identity-grid">
            <div className="lab-headings-block">
              <span className="lab-business-descriptor">
                {company.business}
              </span>
              <h1>{company.displayName}</h1>
              <div className="lab-editorial-rule" aria-hidden="true" />
              <p className="lab-summary-lead">{company.summary}</p>
            </div>

            <div className="lab-logo-stage">
              <Image
                src={company.logo}
                alt={`${company.displayName} logo`}
                width={company.logoWidth}
                height={company.logoHeight}
                priority
                sizes="(max-width: 640px) 240px, 320px"
              />
              <span className="lab-logo-caption">
                Registered Pharmaceutical Trademark
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="lab-main-sections">
        <div className="lab-asymmetry-layout">
          <div className="lab-content-column">
            <section className="lab-editorial-section" aria-labelledby="lab-legal-heading">
              <div className="lab-section-header">
                <span className="lab-section-tag">Corporate Governance</span>
              </div>
              <h2 id="lab-legal-heading">Legal Entity & Governance</h2>
              <p>
                {company.legalName ?? company.displayName} operates as an incorporated
                pharmaceutical manufacturing entity within the Goodman Group portfolio,
                governed by corporate standards and regulatory oversight.
              </p>
            </section>

            <section className="lab-editorial-section" aria-labelledby="lab-capabilities-heading">
              <div className="lab-section-header">
                <span className="lab-section-tag">Core Capability</span>
              </div>
              <h2 id="lab-capabilities-heading">Pharmaceutical Manufacturing</h2>
              <p>
                The company is structured specifically around pharmaceutical
                manufacturing operations, serving institutional health systems and
                regional supply channels.
              </p>
            </section>

            {leader ? (
              <section className="lab-editorial-section" aria-labelledby="lab-leadership-heading">
                <div className="lab-section-header">
                  <span className="lab-section-tag">Executive Leadership</span>
                </div>
                <h2 id="lab-leadership-heading">Executive Management</h2>
                <div className="lab-card-grid">
                  <article className="lab-data-card highlight">
                    <h3>{leader.name}</h3>
                    <p className="lab-card-role">{leader.role}</p>
                    <p className="lab-card-detail">{leader.detail}</p>
                  </article>
                </div>
              </section>
            ) : null}
          </div>

          <aside className="lab-trajectory-panel" aria-label="Trajectory and Group Anchor">
            <div>
              <span className="lab-section-tag">Trajectory</span>
              <h3>Manufacturing Focus</h3>
              <svg
                className="lab-trajectory-graphic"
                viewBox="0 0 200 120"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M10 100 L70 70 L120 80 L190 20"
                  stroke="#d3202f"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="10" cy="100" r="4" fill="#16181d" />
                <circle cx="70" cy="70" r="4" fill="#16181d" />
                <circle cx="120" cy="80" r="4" fill="#16181d" />
                <circle cx="190" cy="20" r="5" fill="#d3202f" />
                <line
                  x1="10"
                  y1="110"
                  x2="190"
                  y2="110"
                  stroke="#d2d7dc"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
              </svg>
              <p className="lab-trajectory-note">
                Sustained pharmaceutical operations under executive leadership since 2012.
              </p>
            </div>

            <div style={{ marginTop: "2rem" }}>
              <Link
                href="/#contact"
                className="lab-indicator"
                style={{ textDecoration: "none" }}
              >
                <span>Institutional Inquiry via Group</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </CompanyGroupFrame>
  );
}
