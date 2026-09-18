import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { CompanyGroupFrame } from "@/components/company-group-frame";
import { getCompanyBySlug } from "@/data/companies";
import "./medical.css";

const company = getCompanyBySlug("goodman-medical-equipment")!;

export const metadata: Metadata = {
  title: company.displayName,
  description: company.summary,
};

export default function GoodmanMedicalEquipmentPage() {
  const director = company.leadership[0];

  return (
    <CompanyGroupFrame company={company} className="medical-equipment-page">
      <header className="med-hero">
        <div className="med-hero-inner">
          <div className="med-tech-spec-bar">
            <div className="med-spec-indicator">
              <span>TRADING OPERATIONS // UAE &amp; PAKISTAN</span>
            </div>
            <div>
              <span>REF: GMET-2024-DIRECTORATE</span>
            </div>
          </div>

          <div className="med-hero-grid">
            <div className="med-title-block">
              <span className="med-category-callout">
                {company.business}
              </span>
              <h1>{company.displayName}</h1>
              <p className="med-summary-text">{company.summary}</p>
            </div>

            <div className="med-logo-module">
              <span className="med-corner-mark med-corner-tl" aria-hidden="true" />
              <span className="med-corner-mark med-corner-tr" aria-hidden="true" />
              <span className="med-corner-mark med-corner-bl" aria-hidden="true" />
              <span className="med-corner-mark med-corner-br" aria-hidden="true" />

              <div className="med-logo-wrap">
                <Image
                  src={company.logo}
                  alt={`${company.displayName} logo`}
                  width={company.logoWidth}
                  height={company.logoHeight}
                  priority
                  sizes="(max-width: 640px) 220px, 280px"
                />
              </div>
              <span className="med-logo-meta">
                PRECISION SPECIFICATION LOGO · GG3
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="med-content-container">
        {/* Split UAE / Pakistan Presence Section */}
        <section aria-labelledby="med-presence-heading">
          <div className="med-section-header">
            <h2 id="med-presence-heading">Dual-Region Trading Presence</h2>
            <span className="med-section-tag">GEOGRAPHIC REACH // 02 MARKETS</span>
          </div>

          <div className="med-split-presence-grid">
            <article className="med-presence-card">
              <div className="med-presence-region">Region 01 // Middle East</div>
              <h3>United Arab Emirates</h3>
              <p>
                Commercial trading hub coordinating procurement, supply-chain logistics,
                and distribution across the Gulf cooperation territory.
              </p>
            </article>

            <article className="med-presence-card">
              <div className="med-presence-region">Region 02 // South Asia</div>
              <h3>Pakistan</h3>
              <p>
                Established operational channels delivering hospital equipment, diagnostic
                machinery, and specialized clinical devices nationwide.
              </p>
            </article>
          </div>
        </section>

        {/* Technical Capabilities & Directorate */}
        <section aria-labelledby="med-operations-heading">
          <div className="med-section-header">
            <h2 id="med-operations-heading">Operations &amp; Directorate</h2>
            <span className="med-section-tag">STRUCTURE // VERIFIED DATA</span>
          </div>

          <div className="med-details-grid">
            <article className="med-detail-box">
              <div>
                <span className="med-role-tag">CAPABILITY</span>
                <h3>Medical Equipment Trading</h3>
                <p>
                  Specialized commercial sourcing and distribution of medical devices,
                  surgical apparatus, and hospital technology systems.
                </p>
              </div>
            </article>

            {director ? (
              <article className="med-detail-box">
                <div>
                  <span className="med-role-tag">{director.role.toUpperCase()}</span>
                  <h3>{director.name}</h3>
                  <p>{director.detail}</p>
                </div>
              </article>
            ) : null}
          </div>

          <div style={{ marginTop: "3rem" }}>
            <Link
              href="/#contact"
              className="med-category-callout"
              style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}
            >
              <span>Procurement &amp; Commercial Routing via Group</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </div>
    </CompanyGroupFrame>
  );
}
