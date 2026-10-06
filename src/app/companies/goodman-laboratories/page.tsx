import type { Metadata } from "next";
import Image from "next/image";
import { ArrowDown, ArrowUpRight, Check, ShieldCheck } from "lucide-react";

import { CompanyGroupFrame } from "@/components/company-group-frame";
import { getCompanyBySlug } from "@/data/companies";
import { goodmanLaboratoriesProfile } from "@/data/goodman-laboratories";
import { OrganizationJsonLd } from "@/lib/structured-data";
import "./laboratories.css";

const company = getCompanyBySlug("goodman-laboratories")!;
const profile = goodmanLaboratoriesProfile;

export const metadata: Metadata = {
  title: company.displayName,
  description: `${profile.identity.legalName} — ${company.summary}`,
  alternates: { canonical: "/companies/goodman-laboratories" },
};

export default function GoodmanLaboratoriesPage() {
  const leader = profile.leadership;
  const certifications = profile.certifications;
  const contact = profile.contactAndLocations;

  return (
    <CompanyGroupFrame company={company} className="laboratories-page">
      <OrganizationJsonLd company={company} />
      <header className="lab-hero" id="lab-top">
        <div className="lab-shell lab-hero-grid">
          <div className="lab-hero-copy">
            <p className="lab-kicker">Pharmaceutical manufacturing · Pakistan</p>
            <h1>Goodman<br /><span>Laboratories</span></h1>
            <p className="lab-hero-purpose">{profile.identity.purpose}</p>
            <p className="lab-prose">{company.summary}</p>
            <div className="lab-actions"><a className="lab-action" href="#contact">Discuss your requirements <ArrowUpRight size={18} aria-hidden="true" /></a><a className="lab-text-link" href="#products">Explore our products <ArrowDown size={17} aria-hidden="true" /></a></div>
            <p className="lab-security"><ShieldCheck size={18} aria-hidden="true" /> Manufacturing, quality, and dependable supply</p>
          </div>
          <aside className="lab-hero-panel" aria-label="Goodman Laboratories at a glance">
            <div className="lab-panel-brand">{company.logo ? <Image src={company.logo.src} alt={`${company.displayName} logo`} width={company.logo.width} height={company.logo.height} priority sizes="240px" /> : null}</div>
            <p className="lab-panel-label"><span /> {profile.identity.tagline}</p>
            <h2>Purpose in every product.<br />Care beyond production.</h2>
            <ul className="lab-panel-capabilities">{profile.identity.capabilities.slice(0, 3).map((capability, index) => <li key={capability}><span>0{index + 1}</span>{capability}<Check size={17} aria-hidden="true" /></li>)}</ul>
            <div className="lab-panel-foundation"><strong>{profile.identity.founded}</strong><span>Established in Pakistan<br />{profile.identity.legalName}</span></div>
          </aside>
        </div>
      </header>

      <nav className="lab-profile-nav" aria-label="Goodman Laboratories profile navigation"><div className="lab-shell"><a href="#company">Company</a><a href="#operations-reach">Manufacturing &amp; reach</a><a href="#products">Products</a><a href="#certifications">Certifications</a><a href="#leadership">Leadership</a><a href="#contact">Contact <ArrowUpRight size={15} aria-hidden="true" /></a></div></nav>

      <section id="company" className="lab-section" aria-labelledby="company-heading"><div className="lab-shell">
        <div className="lab-section-heading"><p className="lab-kicker">Our foundation</p><h2 id="company-heading">Healthcare access.<br />A lasting purpose.</h2><p>Founded {profile.identity.founded} by Syed Talib Hussain Hashmi</p></div>
        <div className="lab-principles"><article><span className="lab-number">01 / Mission</span><h3>Affordability at the heart.</h3><p>{profile.mission}</p></article><article><span className="lab-number">02 / Vision</span><h3>A wider horizon for care.</h3><p>{profile.vision}</p></article></div>
        <div className="lab-foundation-grid"><div><h3>Values</h3><ul className="lab-check-list">{profile.values.map((value) => <li key={value}><Check size={16} aria-hidden="true" />{value}</li>)}</ul></div><dl className="lab-fact-rows"><div><dt>Industry and activities</dt><dd>{profile.identity.industry}</dd></div><div><dt>Stakeholder relationships</dt><dd>{profile.identity.stakeholderRelationships}</dd></div></dl></div>
      </div></section>

      <section id="operations-reach" className="lab-section lab-tinted" aria-labelledby="operations-heading"><div className="lab-shell">
        <div className="lab-manufacturing-layout"><div className="lab-section-heading lab-sticky-heading"><p className="lab-kicker">Manufacturing &amp; operations</p><h2 id="operations-heading">Built to produce.<br />Prepared to supply.</h2><p>Pharmaceutical production, marketing, and supply for hospitals, retailers, and distribution partners.</p><h3 className="lab-subheading">Core capabilities</h3><ul className="lab-check-list">{profile.identity.capabilities.map((capability) => <li key={capability}><Check size={16} aria-hidden="true" />{capability}</li>)}</ul></div>
          <div className="lab-production"><h3>Approved production sections</h3><ol>{profile.productionSections.map((section, index) => <li key={section.name}><span className="lab-production-number">0{index + 1}</span><div><h4>{section.name}</h4><p>{section.description}</p></div></li>)}</ol></div>
        </div>
        <div className="lab-operations-detail"><div><h3>Facilities and manufacturing standards</h3><ul className="lab-check-list">{profile.facilitiesAndOperations.map((statement) => <li key={statement}><Check size={16} aria-hidden="true" />{statement}</li>)}</ul></div><div className="lab-customer-panel"><p className="lab-kicker">Who we serve</p><h3>Customer segments</h3><ul className="lab-ruled-list">{profile.customers.map((customer) => <li key={customer}>{customer}</li>)}</ul></div></div>
        <div className="lab-organization"><h3>Operational departments</h3><ul className="lab-departments">{profile.websiteFunctions.map((department, index) => <li key={department}><span className="lab-number">0{index + 1}</span>{department}</li>)}</ul><div className="lab-disclosures lab-organization-disclosures"><details className="lab-disclosure"><summary><span>Governance structure</span></summary><ul className="lab-check-list">{profile.governance.map((role) => <li key={role}><Check size={16} aria-hidden="true" />{role}</li>)}</ul></details><details className="lab-disclosure"><summary><span>Organizational roles</span></summary><ul className="lab-check-list">{profile.organizationalFunctions.map((role) => <li key={role}><Check size={16} aria-hidden="true" />{role}</li>)}</ul></details></div></div>
        <div className="lab-reach"><div className="lab-national"><p className="lab-kicker">Distribution in Pakistan</p><h3>National coverage</h3><p>Distribution network coverage across Pakistan&apos;s administrative regions.</p><ul className="lab-region-list">{profile.geographicPresence.nationalCoverage.map((area) => <li key={area}>{area}</li>)}</ul></div><div><h3>International activity &amp; reach</h3><p className="lab-prose">International market distribution and supply agreements.</p><dl className="lab-market-list">{profile.internationalActivity.map((activity) => <div key={activity.market}><dt>{activity.market}</dt><dd>{activity.status}</dd></div>)}</dl></div></div>
      </div></section>

      <section id="products" className="lab-section" aria-labelledby="products-heading"><div className="lab-shell">
        <div className="lab-section-heading"><p className="lab-kicker">Product portfolio</p><h2 id="products-heading">Registered and marketed products</h2><p>Explore the portfolio by therapeutic category, with formulations, strengths, pack sizes, and registration numbers.</p></div>
        <div className="lab-disclosures lab-product-categories">{profile.productCategories.map((category, index) => <details key={category.name} className="lab-disclosure"><summary><span className="lab-category-title"><span className="lab-number">{String(index + 1).padStart(2, "0")}</span>{category.name}</span><small>{category.products.length} {category.products.length === 1 ? "product" : "products"}</small></summary><div className="lab-product-list">{category.products.map((product) => <article key={product.name}><h3>{product.name}</h3><p>{product.details}</p></article>)}</div></details>)}</div>
        <section className="lab-therapeutic" aria-labelledby="therapeutic-heading">
          <div className="lab-therapeutic-intro">
            <p className="lab-kicker">Portfolio breadth</p>
            <h3 id="therapeutic-heading">Therapeutic<br />areas</h3>
            <p>Explore the therapeutic areas represented across our pharmaceutical portfolio.</p>
            <div className="lab-therapeutic-count"><strong>{profile.therapeuticAreas.length}</strong><span>areas across<br />the portfolio</span></div>
          </div>
          <ul className="lab-therapeutic-list">
            {profile.therapeuticAreas.map((area, index) => <li key={area}><span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>{area}</li>)}
          </ul>
        </section>
      </div></section>

      <section id="certifications" className="lab-section lab-tinted" aria-labelledby="certifications-heading"><div className="lab-shell">
        <div className="lab-section-heading"><p className="lab-kicker">Standards &amp; systems</p><h2 id="certifications-heading">Management-system certifications</h2><p>Quality, environmental management, and occupational health and safety.</p></div>
        <div className="lab-certificates">{certifications.certificates.map((certificate) => <article key={certificate.certificateNumber}><ShieldCheck size={28} aria-hidden="true" /><strong>{certificate.standard}</strong><h3>{certificate.managementSystem}</h3><p>Certificate {certificate.certificateNumber}</p></article>)}</div>
        <details className="lab-disclosure lab-certification-details"><summary><span>Certification scope &amp; registration details</span></summary><dl className="lab-fact-rows"><div><dt>Issuer</dt><dd>{certifications.issuer}</dd></div><div><dt>Certified company</dt><dd>{certifications.companyName}</dd></div><div><dt>Registration number</dt><dd>{certifications.registrationNumber}</dd></div><div><dt>Certified scope</dt><dd>{certifications.commonScope}</dd></div><div><dt>Certified address</dt><dd>{certifications.certifiedAddress}</dd></div><div><dt>Registration date</dt><dd>{certifications.commonDates.registrationDate}</dd></div><div><dt>Issue date</dt><dd>{certifications.commonDates.issueDate}</dd></div><div><dt>Certificate expiry</dt><dd>{certifications.commonDates.expiryDate}</dd></div><div><dt>Recertification due</dt><dd>{certifications.commonDates.recertificationDueDate}</dd></div></dl></details>
      </div></section>

      <section id="leadership" className="lab-section" aria-labelledby="leadership-heading"><div className="lab-shell lab-leadership-grid">
        <div className="lab-leader-panel"><p className="lab-kicker">Executive leadership</p><h2 id="leadership-heading">Experience behind<br />the enterprise.</h2><h3>{leader.name}</h3><p className="lab-leader-role">{leader.role}</p><p>{leader.biography}</p><dl className="lab-experience"><div><dt>Industry and entrepreneurship</dt><dd>{leader.totalExperience}</dd></div><div><dt>Manufacturing experience</dt><dd>{leader.manufacturingExperience}</dd></div><div><dt>Family enterprise responsibility</dt><dd>From age {leader.familyBusinessStartAge}</dd></div></dl></div>
        <div><p className="lab-kicker">Leadership in practice</p><h3 className="lab-expertise-heading">Executive expertise</h3><ol className="lab-expertise">{leader.expertise.map((item, index) => <li key={item}><span className="lab-number">0{index + 1}</span>{item}</li>)}</ol><div className="lab-growth"><h3>Sustainability and growth</h3><p>{profile.sustainabilityAndGrowth.foundationSummary}</p><p>{profile.sustainabilityAndGrowth.expansionObjective}</p></div></div>
      </div></section>

      <section className="lab-section lab-community-section" aria-labelledby="community-heading"><div className="lab-shell lab-community-grid"><div className="lab-section-heading"><p className="lab-kicker">Beyond the factory</p><h2 id="community-heading">A responsibility<br />to the community.</h2><p>Medicines, emergency support, and rural healthcare initiatives.</p></div><div><h3>Corporate social responsibility</h3><ul className="lab-check-list">{profile.socialResponsibility.map((item) => <li key={item}><Check size={17} aria-hidden="true" />{item}</li>)}</ul></div></div></section>

      <section id="contact" className="lab-contact" aria-labelledby="contact-heading"><div className="lab-shell">
        <div className="lab-contact-grid"><div><p className="lab-kicker">Work with Goodman Laboratories</p><h2 id="contact-heading">Let’s discuss your<br />pharmaceutical requirements.</h2><p>Contact our team for product, manufacturing, and distribution enquiries.</p><a className="lab-action" href={`mailto:${contact.email}`}>Email our team <ArrowUpRight size={18} aria-hidden="true" /></a><a className="lab-contact-email" href={`mailto:${contact.email}`}>{contact.email}</a></div><div className="lab-contact-locations">
          <div>
            <h3>Head office</h3>
            <address>{contact.headOffice}</address>
            <a href="https://maps.app.goo.gl/ziGKsNTZPDgn5NL27" target="_blank" rel="noopener noreferrer" aria-label="View Laboratories office on Google Maps (opens in a new tab)">View on Google Maps <span aria-hidden="true">↗</span></a>
          </div>
          <div>
            <h3>Factory</h3>
            <address>{contact.factory}</address>
            <a href="https://maps.app.goo.gl/JGmf7zXhDnuS7L3Y7" target="_blank" rel="noopener noreferrer" aria-label="View Laboratories factory on Google Maps (opens in a new tab)">View on Google Maps <span aria-hidden="true">↗</span></a>
            <p>Manufacturing licence no.: <strong>{contact.manufacturingLicenceNumber}</strong></p>
            <a href={`tel:${contact.factoryPhonePrimary}`}>{contact.factoryPhoneRange}</a>
            <a href={`tel:${contact.factoryPhoneAlternate}`}>{contact.factoryPhoneAlternateDisplay}</a>
          </div>
          <a className="lab-text-link" href="#lab-top">Back to top ↑</a>
        </div></div>
        <p className="lab-contact-legal">{profile.identity.legalName}</p>
      </div></section>
    </CompanyGroupFrame>
  );
}
