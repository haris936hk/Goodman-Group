import type { Metadata } from "next";

import { CompanyGroupFrame } from "@/components/company-group-frame";
import { getCompanyBySlug } from "@/data/companies";
import { goodmanBillingProfile } from "@/data/goodman-billing";
import "./billing.css";

const company = getCompanyBySlug("goodman-billing")!;
const profile = goodmanBillingProfile;

export const metadata: Metadata = {
  title: `${company.displayName} | Goodman Group`,
  description: company.summary,
};

export default function GoodmanBillingPage() {
  const contact = company.contacts[0];
  const leader = company.leadership[0];

  return (
    <CompanyGroupFrame company={company} className="billing-page">
      <header className="billing-hero">
        <div className="billing-shell">
          <p className="billing-kicker">{company.business}</p>
          <h1>{company.displayName}</h1>
          <p className="billing-intro">{company.summary}</p>
          <p className="billing-legal">{company.legalName}</p>
          <a className="billing-action" href={`mailto:${contact}`}>Email Goodman Billing</a>
          <nav className="billing-nav" aria-label="On this page">
            <a href="#services">Services</a>
            <a href="#workflow">Workflow</a>
            <a href="#evidence">Evidence</a>
            <a href="#contact">Contact</a>
          </nav>
        </div>
      </header>

      <section className="billing-section" aria-labelledby="audience-heading">
        <div className="billing-shell">
          <h2 id="audience-heading">Who we support</h2>
          <ul className="billing-audience">
            {profile.customersServed.map((customer) => <li key={customer}>{customer}</li>)}
          </ul>
        </div>
      </section>

      <section className="billing-section" id="services" aria-labelledby="services-heading">
        <div className="billing-shell">
          <h2 id="services-heading">Services</h2>
          <p className="billing-lead">Medical billing and revenue-cycle support, organized by stage of care and payment.</p>
          <div className="billing-stack">
            {profile.serviceGroups.map((group) => (
              <article className="billing-row" key={group.groupName}>
                <h3>{group.groupName}</h3>
                <p>{group.description}</p>
                <details className="billing-details">
                  <summary>View services</summary>
                  <div className="billing-detail-body">
                    {group.services.map((service) => (
                      <div className="billing-service" key={service.heading}>
                        <h4>{service.heading}</h4>
                        <ul>{service.items.map((item) => <li key={item}>{item}</li>)}</ul>
                      </div>
                    ))}
                  </div>
                </details>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="billing-section" id="workflow" aria-labelledby="workflow-heading">
        <div className="billing-shell">
          <h2 id="workflow-heading">Revenue-Cycle Workflow</h2>
          <ol className="billing-workflow">
            {profile.workflowSteps.map((step) => (
              <li key={step.step}>
                <span className="billing-step">Step {step.step}</span>
                <div><h3>{step.name}</h3><p>{step.description}</p></div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="billing-section" id="evidence" aria-labelledby="evidence-heading">
        <div className="billing-shell">
          <h2 id="evidence-heading">Evidence &amp; source notes</h2>
          <p className="billing-lead">Published targets, historical brochure figures, and website listings are distinct records, not independently audited outcomes.</p>
          <div className="billing-stack">
            <details className="billing-details billing-evidence">
              <summary>{profile.performanceIndicators.evidenceBlock.title}</summary>
              <div className="billing-detail-body">
                <p className="billing-source">{profile.performanceIndicators.evidenceBlock.sourceLabel}</p>
                <p className="billing-note">{profile.performanceIndicators.evidenceBlock.disclaimer}</p>
                <dl className="billing-facts">
                  {profile.performanceIndicators.indicators.map((item) => (
                    <div key={item.indicator}><dt>{item.indicator}</dt><dd><strong>{item.value}</strong> — {item.context}</dd></div>
                  ))}
                </dl>
              </div>
            </details>
            <details className="billing-details billing-evidence">
              <summary>{profile.brochureHistory.evidenceBlock.title}</summary>
              <div className="billing-detail-body">
                <p className="billing-source">{profile.brochureHistory.evidenceBlock.sourceLabel}</p>
                <p className="billing-note">{profile.brochureHistory.evidenceBlock.disclaimer}</p>
                <dl className="billing-facts">
                  {profile.brochureHistory.metrics.map((item) => (
                    <div key={item.metric}><dt>{item.metric}</dt><dd><strong>{item.value}</strong> — {item.detail}</dd></div>
                  ))}
                </dl>
              </div>
            </details>
            <details className="billing-details billing-evidence">
              <summary>{profile.specialtyProvenance.evidenceBlock.title}</summary>
              <div className="billing-detail-body">
                <p className="billing-source">{profile.specialtyProvenance.evidenceBlock.sourceLabel}</p>
                <p className="billing-note">{profile.specialtyProvenance.evidenceBlock.disclaimer}</p>
                <dl className="billing-facts">
                  <div><dt>Website coverage claim</dt><dd>{profile.specialtyProvenance.websiteClaim}</dd></div>
                  <div><dt>Listed specialty profiles</dt><dd>{profile.specialtyProvenance.listedCount}</dd></div>
                  <div><dt>Contact form options</dt><dd>{profile.specialtyProvenance.contactFormCount}</dd></div>
                  <div><dt>Historical brochure record</dt><dd>{profile.brochureHistory.metrics.find((metric) => metric.metric === "Specialties Managed")?.value}</dd></div>
                </dl>
                <p>{profile.specialtyProvenance.explanation}</p>
              </div>
            </details>
          </div>
        </div>
      </section>

      <section className="billing-section" aria-labelledby="specialties-heading">
        <div className="billing-shell">
          <h2 id="specialties-heading">Medical Billing Specialties</h2>
          <p className="billing-lead">The company website lists these specialty-specific billing focuses.</p>
          <details className="billing-details billing-catalogue">
            <summary>View {profile.specialties.length} listed specialties</summary>
            <dl className="billing-facts billing-detail-body">
              {profile.specialties.map((item) => <div key={item.name}><dt>{item.name}</dt><dd>{item.focus}</dd></div>)}
            </dl>
          </details>
        </div>
      </section>

      <section className="billing-section" aria-labelledby="platforms-heading">
        <div className="billing-shell">
          <h2 id="platforms-heading">Software platforms</h2>
          <p className="billing-lead">Software the company describes in its operational experience.</p>
          <details className="billing-details billing-catalogue">
            <summary>View {profile.platforms.length} platforms</summary>
            <div className="billing-detail-body">
              <p className="billing-note">{profile.platformDisclaimer}</p>
              <dl className="billing-facts">
                {profile.platforms.map((item) => <div key={item.name}><dt>{item.name}</dt><dd>{item.category}</dd></div>)}
              </dl>
            </div>
          </details>
        </div>
      </section>

      <section className="billing-contact" id="contact" aria-labelledby="contact-heading">
        <div className="billing-shell">
          <h2 id="contact-heading">Contact Goodman Billing</h2>
          <p>For provider billing inquiries, email <a href={`mailto:${contact}`}>{contact}</a>.</p>
          <div className="billing-contact-facts">
            <div><h3>Leadership</h3><p>{leader.name} — {leader.role}</p><p>{leader.detail}</p></div>
            <div><h3>{profile.identity.contactAddressLabel}</h3>
              <address>{company.locations[0]}</address>
              <p className="billing-note">Address is the contact location listed on the company’s official web presence. Not established as an inspected clinical or operational processing facility.</p>
            </div>
          </div>
          <p className="billing-note">{profile.identity.complianceClaim}</p>
        </div>
      </section>
    </CompanyGroupFrame>
  );
}
