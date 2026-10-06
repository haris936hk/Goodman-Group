import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, Check, PackageCheck, ShieldCheck, Stethoscope } from "lucide-react";

import { CompanyGroupFrame } from "@/components/company-group-frame";
import { getCompanyBySlug } from "@/data/companies";
import { goodmanMedicalEquipmentProfile as profile } from "@/data/goodman-medical-equipment";
import { OrganizationJsonLd } from "@/lib/structured-data";
import "./medical.css";

const company = getCompanyBySlug("goodman-medical-equipment")!;
const productIcons = [ShieldCheck, Stethoscope] as const;

export const metadata: Metadata = {
  title: company.displayName,
  description: company.summary,
  alternates: { canonical: "/companies/goodman-medical-equipment" },
};

export default function GoodmanMedicalEquipmentPage() {
  const email = profile.contacts.find((contact) => contact.label === "Email")!;

  return (
    <CompanyGroupFrame company={company} className="medical-equipment-page">
      <OrganizationJsonLd company={company} />
      <header className="med-hero" id="med-top">
        <div className="med-shell med-hero-grid">
          <div className="med-hero-copy">
            <p className="med-kicker">Healthcare supply · UAE &amp; Pakistan</p>
            <h1>Goodman<br /><span>Medical Equipment</span><br />Trading</h1>
            <p className="med-hero-message">{profile.messaging[0].value}</p>
            <p className="med-prose">{company.summary}</p>
            <div className="med-actions"><a className="med-action" href="#contact">Discuss your requirements <ArrowUpRight size={18} aria-hidden="true" /></a><a className="med-text-link" href="#solutions">Explore our solutions <ArrowDown size={17} aria-hidden="true" /></a></div>
            <p className="med-assurance"><PackageCheck size={18} aria-hidden="true" />{profile.messaging[4].value}</p>
          </div>
          <aside className="med-hero-panel" aria-label="Healthcare supply at a glance">
            <div className="med-panel-brand">{company.logo ? <Image src={company.logo.src} alt={`${company.displayName} logo`} width={company.logo.width} height={company.logo.height} priority sizes="200px" /> : null}</div>
            <p className="med-panel-label"><span />{profile.messaging[2].value}</p>
            <h2>Healthcare essentials.<br />Dependable supply.</h2>
            <ul className="med-panel-products">{profile.products.map((product, index) => <li key={product.name}><span>0{index + 1}</span>{product.name}<Check size={17} aria-hidden="true" /></li>)}</ul>
            <div className="med-panel-foundation"><strong>{profile.established}</strong><span>Established in Dubai<br />With a Pakistan supply presence</span></div>
          </aside>
        </div>
      </header>
      <nav className="med-section-nav" aria-label="On this page"><div className="med-shell"><a href="#solutions">Solutions</a><a href="#workflow">Supply approach</a><a href="#presence">Presence</a><a href="#markets">Markets</a><a href="#leadership">Leadership</a><a href="#contact">Contact <ArrowUpRight size={15} aria-hidden="true" /></a></div></nav>

      <section className="med-section" id="solutions" aria-labelledby="med-solutions-heading"><div className="med-shell">
        <div className="med-section-heading"><p className="med-kicker">{profile.messaging[1].value}</p><h2 id="med-solutions-heading">Equipment for care.<br />Service you can depend on.</h2><p>Surgical instruments, medical equipment, and devices for hospitals, clinics, and healthcare professionals.</p></div>
        <div className="med-products">{profile.products.map((product, index) => {
          const Icon = productIcons[index];
          return <article key={product.name}><div className="med-product-top"><span className="med-icon">{Icon ? <Icon size={30} aria-hidden="true" /> : null}</span><span className="med-number">0{index + 1}</span></div><h3>{product.name}</h3><p>{product.description}</p><span className="med-product-caption">Healthcare product category</span></article>;
        })}</div>
        <div className="med-service-grid"><div><p className="med-kicker">Our capabilities</p><h3>Service &amp; operating strengths</h3><ul className="med-check-list">{profile.strengths.map((strength) => <li key={strength}><Check size={16} aria-hidden="true" />{strength}</li>)}</ul></div><aside className="med-commitment"><p className="med-kicker">Customer commitment</p><h3>What customers can expect</h3><ul className="med-check-list">{profile.customerPromise.map((promise) => <li key={promise}><Check size={16} aria-hidden="true" />{promise}</li>)}</ul><a className="med-text-link" href="#contact">Talk to our team <ArrowUpRight size={17} aria-hidden="true" /></a></aside></div>
      </div></section>

      <section className="med-section med-tinted" id="workflow" aria-labelledby="med-workflow-heading"><div className="med-shell">
        <div className="med-workflow-layout"><div className="med-section-heading med-sticky-heading"><p className="med-kicker">From order to delivery</p><h2 id="med-workflow-heading">A connected<br />supply approach.</h2><p>Manufacturer coordination, warehouse receipt, quality checks, and dispatch against customer demand.</p><span className="med-workflow-caption"><span />Five stages of supply-chain management</span></div><ol className="med-workflow">{profile.supplyChain.map((step, index) => <li key={step}><div className="med-workflow-marker"><span>0{index + 1}</span>{index < profile.supplyChain.length - 1 ? <ArrowDown size={17} aria-hidden="true" /> : null}</div><p>{step.replace(/^\d+\.\s*/, "")}</p></li>)}</ol></div>
        <details className="med-disclosure med-instrument-disclosure"><summary><span>Offsite instrument-reprocessing workflow</span><small>7 stages</small></summary><div className="med-disclosure-content"><p className="med-disclosure-note">Seven-stage instrument-reprocessing workflow via STERIS Offsite Reprocessing Center (ORC).</p><ol className="med-instrument-steps">{profile.instrumentHandling.map((step, index) => <li key={step}><span className="med-number" aria-hidden="true">0{index + 1}</span><p>{step.replace(/^\d+\.\s*/, "")}</p></li>)}</ol></div></details>
      </div></section>

      <section className="med-section" id="presence" aria-labelledby="med-presence-heading"><div className="med-shell">
        <div className="med-section-heading"><p className="med-kicker">Our operating base</p><h2 id="med-presence-heading">Dual-Region Trading Presence</h2><p>Established in {profile.established}, {profile.officialLegalName} operates from Dubai with a Pakistan office in Islamabad.</p></div>
        <div className="med-presence-grid"><article><span className="med-number">01 / United Arab Emirates</span><h3>Dubai</h3><p>Company base</p><address>{profile.base}</address></article><article><span className="med-number">02 / Pakistan</span><h3>Islamabad</h3><p>Pakistan office &amp; nationwide supply</p><address>{profile.pakistanOffice}</address></article></div>
        <div className="med-principles"><article><p className="med-kicker">Mission</p><h3>Focused on patient care.</h3><p>{profile.mission}</p></article><article><p className="med-kicker">Vision</p><h3>A wider horizon for healthcare.</h3><p>{profile.vision}</p></article></div>
        <div className="med-values"><h3>Operating values</h3><ul>{profile.values.map((value, index) => <li key={value}><span className="med-number">0{index + 1}</span><p>{value}</p></li>)}</ul></div>
      </div></section>

      <section className="med-section med-tinted" id="markets" aria-labelledby="med-markets-heading"><div className="med-shell">
        <div className="med-section-heading"><p className="med-kicker">Customers &amp; markets</p><h2 id="med-markets-heading">Serving healthcare.<br />Looking ahead.</h2><p>Current operations in the UAE and Pakistan, with a separate focus on future international markets.</p></div>
        <div className="med-market-layout"><div className="med-customer-panel"><p className="med-kicker">Who we serve</p><h3>Healthcare providers</h3><ul className="med-ruled-list">{profile.customers.map((customer) => <li key={customer}>{customer}</li>)}</ul></div><div><div className="med-operating-markets"><p className="med-kicker">Current operations</p><h3>Operating presence</h3><ul className="med-check-list">{profile.currentMarkets.map((market) => <li key={market}><Check size={17} aria-hidden="true" />{market}</li>)}</ul></div><div className="med-target-markets"><p className="med-kicker">Future target markets</p><h3>Planned market focus</h3><ul>{profile.targetMarkets.map((market) => <li key={market}>{market}<span>Target market</span></li>)}</ul></div></div></div>
      </div></section>

      <section className="med-section" id="leadership" aria-labelledby="med-leadership-heading"><div className="med-shell">
        <div className="med-leadership-layout"><div className="med-leadership-intro"><p className="med-kicker">People &amp; principles</p><h2 id="med-leadership-heading">A foundation<br />of commitment.</h2><p>{profile.messaging[3].value}</p><p className="med-prose">Established in {profile.established} by four founders, with governance and operational functions supporting healthcare supply.</p></div><div className="med-founders"><h3>Founding leadership</h3><ul>{profile.founders.map((founder, index) => <li key={founder}><span className="med-number">0{index + 1}</span>{founder}</li>)}</ul></div></div>
        <div className="med-board"><h3>Board of directors</h3><ul>{profile.board.map((member) => <li key={member.name}><strong>{member.name}</strong><span>Director</span></li>)}</ul></div>
        <div className="med-disclosures"><details className="med-disclosure"><summary><span>Governance and control functions</span></summary><div className="med-disclosure-content"><ul className="med-check-list">{profile.governanceFunctions.map((item) => <li key={item}><Check size={16} aria-hidden="true" />{item}</li>)}</ul></div></details><details className="med-disclosure"><summary><span>Organizational structure &amp; roles</span></summary><div className="med-disclosure-content"><ul className="med-check-list">{profile.organizationRoles.map((role) => <li key={role}><Check size={16} aria-hidden="true" />{role}</li>)}</ul></div></details></div>
      </div></section>

      <section className="med-contact" id="contact" aria-labelledby="med-contact-heading"><div className="med-shell med-contact-layout"><div><p className="med-kicker">Direct supplier contact</p><h2 id="med-contact-heading">Let’s discuss your<br />healthcare supply needs.</h2><p>Contact our Islamabad team for medical equipment, device, and surgical instrument enquiries.</p><a className="med-action" href={email.href!}>Email our team <ArrowUpRight size={18} aria-hidden="true" /></a><p className="med-contact-legal">{profile.officialLegalName}</p></div><div><dl className="med-contact-list">{profile.contacts.filter((contact) => contact.label !== "Website").map((contact) => <div key={contact.label}><dt>{contact.label}</dt><dd>{contact.href ? <a href={contact.href}>{contact.value}</a> : contact.value}</dd></div>)}</dl><Link href="/#contact" className="med-text-link med-group-routing-link">Group routing for procurement &amp; commercial enquiries <ArrowUpRight size={17} aria-hidden="true" /></Link><a className="med-text-link med-back-top" href="#med-top">Back to top ↑</a></div></div></section>
    </CompanyGroupFrame>
  );
}
