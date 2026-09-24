import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { CompanyGroupFrame } from "@/components/company-group-frame";
import { getCompanyBySlug } from "@/data/companies";
import "./medical.css";

const company = getCompanyBySlug("goodman-medical-equipment")!;
const entities = company.entities ?? [];
const supplier = entities.find((entity) => entity.products.length > 0);

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
              <Image
                src={company.logo}
                alt={`${company.displayName} logo`}
                width={company.logoWidth}
                height={company.logoHeight}
                priority
                sizes="(max-width: 720px) 70vw, 360px"
              />
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
              <p className="med-eyebrow">Three documented legal records</p>
              <h2 id="med-presence-heading">Dual-Region Trading Presence</h2>
              <p>
                The record distinguishes two Pakistan entities from the United
                Arab Emirates entity before describing the verified supplier
                operation.
              </p>
            </div>

            <div className="med-entity-list">
              {entities.map((entity, index) => (
                <article className="med-entity-record" key={entity.legalName}>
                  <div className="med-record-index" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <div className="med-record-body">
                    <p className="med-jurisdiction">{entity.jurisdiction}</p>
                    <h3>{entity.legalName}</h3>

                    {entity.leadership.length > 0 ? (
                      <div
                        className="med-entity-leadership"
                        aria-label="Verified leadership"
                      >
                        {entity.leadership.map((leader) => (
                          <p key={`${entity.legalName}-${leader.role}`}>
                            <strong>{leader.name}</strong>
                            <span>{leader.role}</span>
                            <small>{leader.detail}</small>
                          </p>
                        ))}
                      </div>
                    ) : (
                      <p className="med-entity-muted">
                        The supplied profile does not provide a leadership record.
                      </p>
                    )}

                    {entity.description ? (
                      <p className="med-entity-description">
                        {entity.description}
                      </p>
                    ) : null}

                    {entity.sourceNote ? (
                      <aside className="med-source-note">
                        <strong>Source note</strong>
                        <p>{entity.sourceNote}</p>
                      </aside>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {supplier ? (
          <>
            <section
              className="med-chapter med-solutions"
              id="solutions"
              aria-labelledby="med-solutions-heading"
            >
              <div className="med-shell">
                <div className="med-solutions-lead">
                  <div className="med-chapter-heading">
                    <p className="med-eyebrow">Verified Pakistan supplier profile</p>
                    <h2 id="med-solutions-heading">Healthcare supply record</h2>
                    <h3>{supplier.legalName}</h3>
                    <p>{supplier.description}</p>
                  </div>

                  <div
                    className="med-message-rail"
                    aria-label="Verified company messages"
                  >
                    {supplier.messaging?.map((message) => (
                      <blockquote key={message.label}>
                        <span>{message.label}</span>
                        <p>{message.value}</p>
                      </blockquote>
                    ))}
                  </div>
                </div>

                <div className="med-product-list">
                  {supplier.products.map((product, index) => (
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
                    <p className="med-eyebrow">Verified service evidence</p>
                    <h3>Service &amp; operating strengths</h3>
                    <ul className="med-fact-list">
                      {supplier.strengths.map((strength) => (
                        <li key={strength}>{strength}</li>
                      ))}
                    </ul>
                  </div>

                  {supplier.customerPromise?.length ? (
                    <aside className="med-commitment">
                      <p className="med-eyebrow">Customer commitment</p>
                      <h3>What customers can expect</h3>
                      <ul className="med-fact-list">
                        {supplier.customerPromise.map((promise) => (
                          <li key={promise}>{promise}</li>
                        ))}
                      </ul>
                    </aside>
                  ) : null}
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
                    Current audiences and Pakistan coverage are separated from
                    markets identified only as future targets.
                  </p>
                </div>

                <div className="med-market-list">
                  <article className="med-market-group">
                    <p className="med-market-status">Current audience</p>
                    <h3>Healthcare providers</h3>
                    <ul className="med-fact-list">
                      {supplier.customers.map((customer) => (
                        <li key={customer}>{customer}</li>
                      ))}
                    </ul>
                  </article>
                  <article className="med-market-group">
                    <p className="med-market-status">Current domestic coverage</p>
                    <h3>Pakistan</h3>
                    <ul className="med-fact-list">
                      {supplier.domesticMarkets.map((market) => (
                        <li key={market}>{market}</li>
                      ))}
                    </ul>
                  </article>
                  <article className="med-market-group med-market-targets">
                    <p className="med-market-status">Future target markets</p>
                    <h3>Planned market focus</h3>
                    <ul className="med-fact-list">
                      {supplier.targetMarkets.map((market) => (
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
                  <h3>{supplier.legalName}</h3>
                </div>

                <div>
                  <dl className="med-contact-list">
                    {supplier.contacts.map((contact) => (
                      <div key={contact.label}>
                        <dt>{contact.label}</dt>
                        <dd>
                          {contact.href ? (
                            <a href={contact.href}>{contact.value}</a>
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
          </>
        ) : null}
      </div>
    </CompanyGroupFrame>
  );
}
