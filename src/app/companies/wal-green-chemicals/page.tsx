import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { CompanyGroupFrame } from "@/components/company-group-frame";
import { getCompanyBySlug } from "@/data/companies";
import { walGreenChemicalsProfile } from "@/data/wal-green-chemicals";
import "./walgreen.css";

const company = getCompanyBySlug("wal-green-chemicals")!;
const profile = walGreenChemicalsProfile;

export const metadata: Metadata = {
  title: company.displayName,
  description: `${profile.identity.legalName} — Indenter and trader supplying globally sourced pharmaceutical raw materials, intermediates, and chemicals across Pakistan.`,
};

export default function WalGreenChemicalsPage() {
  const leader = profile.leadership;

  return (
    <CompanyGroupFrame company={company} className="wal-green-page">
      <header className="wg-hero">
        <div className="wg-hero-inner">
          <div className="wg-topline">
            <div className="wg-legal-badge">
              <span>{profile.identity.legalName}</span>
            </div>
            <div className="wg-presence-badge">
              <span>Pakistan · Indenting &amp; Trading · Goodman Group Portfolio</span>
            </div>
          </div>

          <div className="wg-hero-grid">
            <div className="wg-copy-area">
              <span className="wg-brand-descriptor">
                {profile.identity.businessType}
              </span>
              <h1>{company.displayName}</h1>
              <p className="wg-summary-lead">
                {profile.identity.positioning}
              </p>
              <p className="wg-core-offer">
                {profile.identity.coreOffer}
              </p>
            </div>

            <div className="wg-logo-stage">
              {company.logo ? (
                <Image
                  src={company.logo.src}
                  alt={`${company.displayName} logo`}
                  width={company.logo.width}
                  height={company.logo.height}
                  priority
                  sizes="(max-width: 640px) 220px, 280px"
                />
              ) : null}
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

      <nav
        className="wg-profile-nav"
        aria-label="Wal Green Chemicals profile navigation"
      >
        <div className="wg-nav-inner">
          <ul className="wg-nav-list">
            <li>
              <a href="#overview">Overview</a>
            </li>
            <li>
              <a href="#capabilities">Capabilities</a>
            </li>
            <li>
              <a href="#products">Products</a>
            </li>
            <li>
              <a href="#coverage-sourcing">Coverage &amp; sourcing</a>
            </li>
            <li>
              <a href="#leadership-contact">Leadership &amp; contact</a>
            </li>
          </ul>
        </div>
      </nav>

      <div className="wg-body-sections">
        {/* Section 1: Overview */}
        <section
          id="overview"
          className="wg-region-card"
          aria-labelledby="overview-heading"
        >
          <div className="wg-card-header">
            <h2 id="overview-heading">Company Overview</h2>
            <span className="wg-card-tag">MISSION &amp; ENTERPRISE IDENTITY</span>
          </div>

          <div className="wg-section-body">
            <div className="wg-lead-block">
              <h3>Mission</h3>
              <p className="wg-mission-text">{profile.mission}</p>
            </div>

            <div className="wg-identity-block">
              <h3>Enterprise Identity</h3>
              <dl className="wg-fact-list">
                <div>
                  <dt>Legal name</dt>
                  <dd>{profile.identity.legalName}</dd>
                </div>
                <div>
                  <dt>Business type</dt>
                  <dd>{profile.identity.businessType}</dd>
                </div>
                <div>
                  <dt>Operating base</dt>
                  <dd>Pakistan</dd>
                </div>
                <div>
                  <dt>Commercial model</dt>
                  <dd>Global sourcing and Pakistan-wide distribution</dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        {/* Section 2: Capabilities */}
        <section
          id="capabilities"
          className="wg-region-card"
          aria-labelledby="capabilities-heading"
        >
          <div className="wg-card-header">
            <h2 id="capabilities-heading">
              Core Capabilities &amp; Organizational Functions
            </h2>
            <span className="wg-card-tag">CAPABILITIES &amp; OPERATIONS</span>
          </div>

          <div className="wg-section-body">
            <div className="wg-strengths-wrapper">
              <h3>Core Business Strengths</h3>
              <ul className="wg-strengths-list">
                {profile.strengths.map((strength) => (
                  <li key={strength}>{strength}</li>
                ))}
              </ul>
            </div>

            <div className="wg-functions-wrapper">
              <h3>Organizational Functions</h3>
              <div className="wg-functions-grid">
                {profile.organizationalFunctions.map((fn) => (
                  <div key={fn.name} className="wg-function-card">
                    <h4>{fn.name}</h4>
                    <ul className="wg-function-responsibilities">
                      {fn.responsibilities.map((resp) => (
                        <li key={resp}>{resp}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Products */}
        <section
          id="products"
          className="wg-region-card"
          aria-labelledby="products-heading"
        >
          <div className="wg-card-header">
            <h2 id="products-heading">Product &amp; Material Portfolio</h2>
            <span className="wg-card-tag">PORTFOLIO CATEGORIES</span>
          </div>

          <div className="wg-section-body">
            <p className="wg-portfolio-disclaimer">
              Verified product and material categories supplied across
              Pakistan’s manufacturing sector. These categories represent
              indenting and trading supply scopes rather than specific stocked
              lines or manufactured products.
            </p>

            <ul
              className="wg-product-grid"
              aria-label="Product and material categories"
            >
              {profile.productPortfolio.map((item) => (
                <li key={item} className="wg-product-item">
                  <span className="wg-product-dot" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Section 4: Coverage & Sourcing */}
        <section
          id="coverage-sourcing"
          className="wg-region-card"
          aria-labelledby="coverage-sourcing-heading"
        >
          <div className="wg-card-header">
            <h2 id="coverage-sourcing-heading">
              National Coverage &amp; Global Sourcing
            </h2>
            <span className="wg-card-tag">LOGISTICS &amp; SOURCING</span>
          </div>

          <div className="wg-section-body">
            <div className="wg-coverage-block">
              <h3>National Customer Coverage</h3>
              <p className="wg-coverage-desc">
                {profile.customerCoverage.customerDescription}
              </p>
              <ul
                className="wg-centres-chips"
                aria-label="Industrial and commercial centres served in Pakistan"
              >
                {profile.customerCoverage.centres.map((centre) => (
                  <li key={centre} className="wg-centre-chip">
                    {centre}
                  </li>
                ))}
              </ul>
              <div className="wg-objective-card">
                <h4>Distribution Objective</h4>
                <p>{profile.customerCoverage.distributionObjective}</p>
              </div>
            </div>

            <div className="wg-sourcing-block">
              <h3>Suppliers &amp; Sourcing Network</h3>

              <div className="wg-sourcing-subgroup">
                <h4>International Imports</h4>
                <p className="wg-sourcing-intro">
                  Wal Green Chemicals maintains established international
                  import channels connecting global manufacturers to
                  Pakistan-based industrial customers:
                </p>
                <div className="wg-imports-grid">
                  {profile.sourcingNetwork.internationalImports.map((imp) => (
                    <div key={imp.origin} className="wg-import-card">
                      <h5>{imp.origin}</h5>
                      <p>{imp.details}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="wg-sourcing-subgroup">
                <h4>Local Sourcing</h4>
                <p className="wg-local-statement">
                  {profile.sourcingNetwork.localSourcing.statement}
                </p>
              </div>

              <div className="wg-sourcing-subgroup">
                <h4>Dual-Channel Model Objectives</h4>
                <p className="wg-benefits-intro">
                  The import-plus-local model is intended to:
                </p>
                <ul className="wg-model-benefits">
                  {profile.sourcingNetwork.modelBenefits.map((benefit) => (
                    <li key={benefit}>{benefit}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Leadership & Contact */}
        <section
          id="leadership-contact"
          className="wg-region-card"
          aria-labelledby="leadership-heading"
        >
          <div className="wg-card-header">
            <h2 id="leadership-heading">
              Executive Leadership &amp; Partnerships
            </h2>
            <span className="wg-card-tag">LEADERSHIP &amp; CONTACT</span>
          </div>

          <div className="wg-section-body">
            <div className="wg-leader-card">
              <div className="wg-leader-header">
                <div>
                  <h3>{leader.name}</h3>
                  <div className="wg-detail-role">{leader.role}</div>
                </div>
                <div className="wg-tenure-badge">
                  <span>CEO since {leader.tenureStartYear}</span>
                </div>
              </div>
              <p className="wg-leader-tenure-detail">
                CEO tenure stated in the group profile: {leader.tenure}.
              </p>
            </div>

            <div className="wg-partnership-card">
              <h3>Supply Partnerships</h3>
              <p className="wg-partnership-statement">
                {profile.partnershipStatement}
              </p>
            </div>

            <div className="wg-contact-card">
              <h3>Connect with Goodman Group</h3>
              <p>
                For institutional inquiries, commercial partnerships, or to
                connect with Wal Green Chemicals leadership, contact Goodman
                Group corporate offices.
              </p>
              <Link
                href="/#contact"
                className="wg-contact-link"
              >
                <span>Connect with Goodman Group</span>
                <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </CompanyGroupFrame>
  );
}
