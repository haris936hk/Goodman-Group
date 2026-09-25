import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { CompanyGroupFrame } from "@/components/company-group-frame";
import { getCompanyBySlug } from "@/data/companies";
import { goodmanMedicalEquipmentProfile as profile } from "@/data/goodman-medical-equipment";
import "./medical.css";

const company = getCompanyBySlug("goodman-medical-equipment")!;

export const metadata: Metadata = {
  title: company.displayName,
  description: company.summary,
};

export default function GoodmanMedicalEquipmentPage() {
  return (
    <CompanyGroupFrame company={company} className="medical-equipment-page">
      <header className="med-hero">
        <div className="med-shell med-hero-grid">
          <div className="med-title-block">
            <p className="med-eyebrow">{company.business}</p>
            <h1>{company.displayName}</h1>
            <p className="med-summary">{company.summary}</p>
            <ul className="med-presence-list" aria-label="Documented locations">
              {company.locations.map((location) => (
                <li key={location}>{location}</li>
              ))}
            </ul>
          </div>

          <div className="med-logo-stage">
            <div className="med-logo-wrap">
              {company.logo ? (
                <Image
                  src={company.logo.src}
                  alt={`${company.displayName} logo`}
                  width={company.logo.width}
                  height={company.logo.height}
                  priority
                  sizes="(max-width: 720px) 70vw, 360px"
                />
              ) : null}
            </div>
          </div>
        </div>
      </header>

      <nav className="med-section-nav" aria-label="On this page">
        <div className="med-shell med-section-nav-inner">
          <span>On this page</span>
          <a href="#presence">Presence</a>
          <a href="#solutions">Solutions</a>
          <a href="#markets">Markets</a>
          <a href="#contact">Contact</a>
        </div>
      </nav>

      <div className="med-content">
        <section
          className="med-chapter med-presence"
          id="presence"
          aria-labelledby="med-presence-heading"
        >
          <div className="med-shell">
            <div className="med-chapter-heading">
              <p className="med-eyebrow">Official company identity</p>
              <h2 id="med-presence-heading">Dual-Region Trading Presence</h2>
              <h3>{profile.officialLegalName}</h3>
              <p>
                Established in {profile.established}, Goodman Medical Equipment
                Trading operates from {profile.base} with nationwide healthcare
                supply across Pakistan from its office in {profile.pakistanOffice}.
                The official company webpage consolidates the Dubai LLC and Pakistan
                presence into one company profile.
              </p>
            </div>

            <div className="med-entity-list">
              <article className="med-entity-record">
                <div className="med-record-index" aria-hidden="true">
                  01
                </div>
                <div className="med-record-body">
                  <p className="med-jurisdiction">
                    United Arab Emirates &amp; Pakistan
                  </p>
                  <h3>{profile.officialLegalName}</h3>

                  <div
                    className="med-entity-leadership"
                    aria-label="Board of directors"
                  >
                    {profile.board.map((member) => (
                      <p key={member.name}>
                        <strong>{member.name}</strong>
                        <span>Director</span>
                        {member.sourceName ? (
                          <small>{member.sourceName}</small>
                        ) : null}
                      </p>
                    ))}
                  </div>

                  <p className="med-entity-description">
                    Established in {profile.established} by four founders.
                    The company specializes in surgical products, medical equipment,
                    and medical devices, with contract agreements with leading
                    manufacturers and suppliers.
                  </p>

                  <aside className="med-source-note">
                    <strong>Leadership source note</strong>
                    <p>{profile.leadershipSourceNote}</p>
                  </aside>

                  <aside className="med-source-note">
                    <strong>Source-attributed naming designations</strong>
                    <p>
                      Official legal name: {profile.officialLegalName}. Website
                      headline: {profile.websiteHeadline}. Alternate PDF label:{" "}
                      {profile.alternatePdfLabel}. Personal profile title:{" "}
                      {profile.personalProfileLabel}.
                    </p>
                  </aside>
                </div>
              </article>
            </div>

            <div className="med-presence-grid">
              <div className="med-presence-card">
                <p className="med-eyebrow">Founders</p>
                <h3>Founding leadership</h3>
                <p className="med-card-sub">
                  Established in {profile.established} by:
                </p>
                <ul className="med-fact-list">
                  {profile.founders.map((founder) => (
                    <li key={founder}>{founder}</li>
                  ))}
                </ul>
              </div>

              <div className="med-presence-card">
                <p className="med-eyebrow">Guiding principles</p>
                <h3>Mission &amp; vision</h3>
                <div className="med-lead-block">
                  <strong>Mission</strong>
                  <p>{profile.mission}</p>
                </div>
                <div className="med-lead-block">
                  <strong>Vision</strong>
                  <p>{profile.vision}</p>
                </div>
              </div>

              <div className="med-presence-card med-presence-card-wide">
                <p className="med-eyebrow">Core values</p>
                <h3>Operating values</h3>
                <ul className="med-fact-list med-values-list">
                  {profile.values.map((value) => (
                    <li key={value}>{value}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section
          className="med-chapter med-solutions"
          id="solutions"
          aria-labelledby="med-solutions-heading"
        >
          <div className="med-shell">
            <div className="med-solutions-lead">
              <div className="med-chapter-heading">
                <p className="med-eyebrow">Healthcare solutions</p>
                <h2 id="med-solutions-heading">Healthcare supply record</h2>
                <h3>Delivering Excellence in Healthcare Solutions</h3>
                <p>
                  A healthcare supplier focused on quality, safety, innovation,
                  dependable service, and solutions that improve patient care
                  across Pakistan and international customer channels.
                </p>
              </div>

              <div
                className="med-message-rail"
                aria-label="Attributed company messaging"
              >
                {profile.messaging.map((message) => (
                  <blockquote key={message.label}>
                    <span>{message.label}</span>
                    <p>{message.value}</p>
                  </blockquote>
                ))}
              </div>
            </div>

            <div className="med-product-list">
              {profile.products.map((product, index) => (
                <article className="med-product" key={product.name}>
                  <span aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p className="med-eyebrow">Product category</p>
                    <h3>{product.name}</h3>
                    <p>{product.description}</p>
                  </div>
                </article>
              ))}
            </div>

            <div className="med-operating-grid">
              <div className="med-strengths">
                <p className="med-eyebrow">Service capabilities</p>
                <h3>Service &amp; operating strengths</h3>
                <ul className="med-fact-list">
                  {profile.strengths.map((strength) => (
                    <li key={strength}>{strength}</li>
                  ))}
                </ul>
              </div>

              <aside className="med-commitment">
                <p className="med-eyebrow">Customer commitment</p>
                <h3>What customers can expect</h3>
                <ul className="med-fact-list">
                  {profile.customerPromise.map((promise) => (
                    <li key={promise}>{promise}</li>
                  ))}
                </ul>
              </aside>
            </div>

            <div className="med-disclosures">
              <details className="med-disclosure">
                <summary>
                  <span>
                    Production, cleaning, sterilization, packing, and handling
                    workflow
                  </span>
                </summary>
                <div className="med-disclosure-content">
                  <p className="med-disclosure-note">
                    Source-reported seven-stage workflow via STERIS Offsite
                    Reprocessing Center (ORC); indicates procedures rather than
                    owned Goodman sterilization facilities.
                  </p>
                  <ol className="med-workflow-list">
                    {profile.instrumentHandling.map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ol>
                </div>
              </details>

              <details className="med-disclosure">
                <summary>
                  <span>Supply-chain management process</span>
                </summary>
                <div className="med-disclosure-content">
                  <ol className="med-workflow-list">
                    {profile.supplyChain.map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ol>
                </div>
              </details>

              <details className="med-disclosure">
                <summary>
                  <span>Governance and control functions</span>
                </summary>
                <div className="med-disclosure-content">
                  <ul className="med-fact-list">
                    {profile.governanceFunctions.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </details>

              <details className="med-disclosure">
                <summary>
                  <span>Organizational structure &amp; roles</span>
                </summary>
                <div className="med-disclosure-content">
                  <ul className="med-fact-list">
                    {profile.organizationRoles.map((role) => (
                      <li key={role}>{role}</li>
                    ))}
                  </ul>
                </div>
              </details>
            </div>
          </div>
        </section>

        <section
          className="med-chapter med-markets"
          id="markets"
          aria-labelledby="med-markets-heading"
        >
          <div className="med-shell">
            <div className="med-chapter-heading">
              <p className="med-eyebrow">Clearly qualified market status</p>
              <h2 id="med-markets-heading">Customers &amp; markets</h2>
              <p>
                Current operating presence across the United Arab Emirates and
                Pakistan is separated from international markets identified in
                brochures as future targets.
              </p>
            </div>

            <div className="med-market-list">
              <article className="med-market-group">
                <p className="med-market-status">Current audience</p>
                <h3>Healthcare providers</h3>
                <ul className="med-fact-list">
                  {profile.customers.map((customer) => (
                    <li key={customer}>{customer}</li>
                  ))}
                </ul>
              </article>
              <article className="med-market-group">
                <p className="med-market-status">Current operating markets</p>
                <h3>Operating presence</h3>
                <ul className="med-fact-list">
                  {profile.currentMarkets.map((market) => (
                    <li key={market}>{market}</li>
                  ))}
                </ul>
              </article>
              <article className="med-market-group med-market-targets">
                <p className="med-market-status">Future target markets</p>
                <h3>Planned market focus</h3>
                <ul className="med-fact-list">
                  {profile.targetMarkets.map((market) => (
                    <li key={market}>{market}</li>
                  ))}
                </ul>
              </article>
            </div>
          </div>
        </section>

        <section
          className="med-chapter med-contact"
          id="contact"
          aria-labelledby="med-contact-heading"
        >
          <div className="med-shell med-contact-layout">
            <div className="med-chapter-heading">
              <p className="med-eyebrow">Direct supplier contact</p>
              <h2 id="med-contact-heading">Start with the verified record</h2>
              <h3>{profile.officialLegalName}</h3>
              <p>
                Operational contact office in Islamabad, Pakistan, with direct
                channels for medical equipment, device, and surgical instrument
                inquiries.
              </p>
            </div>

            <div>
              <dl className="med-contact-list">
                {profile.contacts.map((contact) => (
                  <div key={contact.label}>
                    <dt>{contact.label}</dt>
                    <dd>
                      {contact.href ? (
                        <a
                          href={contact.href}
                          {...(contact.href.startsWith("http")
                            ? { target: "_blank", rel: "noopener noreferrer" }
                            : {})}
                        >
                          {contact.value}
                          {contact.href.startsWith("http") ? (
                            <ArrowUpRight aria-hidden="true" />
                          ) : null}
                        </a>
                      ) : (
                        contact.value
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
              <Link href="/#contact" className="med-group-routing-link">
                <span>
                  Group routing for procurement &amp; commercial enquiries
                </span>
                <ArrowUpRight aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </CompanyGroupFrame>
  );
}
