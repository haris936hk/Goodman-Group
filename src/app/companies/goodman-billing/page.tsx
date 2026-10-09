import type { Metadata, Viewport } from "next";
import Image from "next/image";
import { ArrowDown, ArrowUpRight, Check, ShieldCheck } from "lucide-react";

import { CompanyGroupFrame } from "@/components/company-group-frame";
import { getCompanyBySlug } from "@/data/companies";
import { goodmanBillingProfile } from "@/data/goodman-billing";
import { OrganizationJsonLd } from "@/lib/structured-data";
import { BillingDirectory } from "./billing-directory";
import "./billing.css";

const company = getCompanyBySlug("goodman-billing")!;
const profile = goodmanBillingProfile;

export const metadata: Metadata = {
  title: company.displayName,
  description: company.summary,
  alternates: { canonical: "/companies/goodman-billing" },
};

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafbf8" },
    { media: "(prefers-color-scheme: dark)", color: "#101c19" },
  ],
};

export default function GoodmanBillingPage() {
  const contact = company.contacts[0];
  const leader = company.leadership[0];

  return (
    <CompanyGroupFrame
      company={company}
      className="billing-page"
    >
      <OrganizationJsonLd company={company} />
      <header className="billing-hero" id="billing-top">
        <div className="billing-shell billing-hero-grid">
          <div className="billing-hero-copy">
            <p className="billing-kicker">Goodman Billing · Healthcare providers in the USA</p>
            <h1>Medical Billing.<br /><span>Redefined.</span></h1>
            <p className="billing-hero-intro">{profile.identity.introduction}</p>
            <div className="billing-actions"><a className="billing-action" href="#contact">Get Started <ArrowUpRight size={18} aria-hidden="true" /></a><a className="billing-text-link" href="#services">Explore our services <ArrowDown size={17} aria-hidden="true" /></a></div>
            <p className="billing-security"><ShieldCheck size={18} aria-hidden="true" /> {profile.identity.complianceClaim}</p>
          </div>
          <aside className="billing-hero-panel" aria-label="Revenue-cycle support">
            <div className="billing-panel-label"><span className="billing-dot" /> Your practice. Our priority.</div>
            <h2>More focus on care.<br />Less friction in billing.</h2>
            <p>Accurate claims, faster reimbursements, and a revenue cycle that works as hard as you do.</p>
            <ol className="billing-hero-flow"><li><span>01</span> Verify &amp; prepare <Check size={17} aria-hidden="true" /></li><li><span>02</span> Code &amp; submit <Check size={17} aria-hidden="true" /></li><li><span>03</span> Recover &amp; report <Check size={17} aria-hidden="true" /></li></ol>
            <div className="billing-panel-bottom"><strong>75+</strong><span>specialties supported<br />across the nation</span></div>
          </aside>
        </div>
      </header>
      <nav className="billing-nav" aria-label="On this page"><div className="billing-shell"><a href="#services">Services</a><a href="#specialties">Specialties</a><a href="#platforms">Integrations</a><a href="#workflow">Our approach</a><a href="#testimonials">Client stories</a><a href="#contact">Contact <ArrowUpRight size={15} aria-hidden="true" /></a></div></nav>

      <section className="billing-section" aria-labelledby="benefits-heading"><div className="billing-shell">
        <div className="billing-section-heading"><p className="billing-kicker">How we do it</p><h2 id="benefits-heading">Billing that works<br />as hard as you do.</h2><p>Explore how Goodman Billing transforms your revenue cycle into a reliable, scalable engine — built for results, not just reports.</p></div>
        <div className="billing-benefits">{profile.benefits.map((benefit) => <article key={benefit.heading}><span className="billing-benefit-icon" aria-hidden="true"><span style={{ maskImage: `url("${benefit.icon}")` }} /></span><h3>{benefit.heading}</h3><p>{benefit.description}</p></article>)}</div>
      </div></section>

      <section className="billing-section billing-tinted" id="services" aria-labelledby="services-heading"><div className="billing-shell">
        <div className="billing-section-heading"><p className="billing-kicker">Our services</p><h2 id="services-heading">Comprehensive medical<br />billing solutions.</h2><p>{profile.identity.servicesIntroduction}</p><p>{profile.identity.servicesDetail}</p></div>
        <BillingDirectory kind="services" entries={profile.services.map((service) => ({ name: service.heading, icon: service.icon, items: service.items }))} />
      </div></section>

      <section className="billing-section billing-specialties-section" id="specialties" aria-labelledby="specialties-heading"><div className="billing-shell">
        <div className="billing-section-heading"><p className="billing-kicker">Specialty-focused</p><h2 id="specialties-heading">Your specialty.<br />Our expertise.</h2><p>{profile.identity.specialtiesIntroduction}</p></div>
        <ul className="billing-specialty-benefits"><li><Check aria-hidden="true" size={17} />Customized billing for each medical specialty</li><li><Check aria-hidden="true" size={17} />Efficient claims management and error reduction</li><li><Check aria-hidden="true" size={17} />Specialty-specific reporting for revenue optimization</li></ul>
        <BillingDirectory kind="specialties" entries={profile.specialties.map((specialty) => ({ name: specialty.name, icon: specialty.icon, description: specialty.focus }))} />
      </div></section>

      <section className="billing-section" id="platforms" aria-labelledby="platforms-heading"><div className="billing-shell">
        <div className="billing-section-heading"><p className="billing-kicker">Integrations &amp; compatibility</p><h2 id="platforms-heading">Your software.<br />A seamless fit.</h2><p>We support and integrate with the most popular medical billing and EHR software platforms. Your existing systems work seamlessly with our services.</p></div>
        <div className="billing-platform-grid">{profile.platforms.map((platform) => <article key={platform.name}><div className="billing-platform-logo"><Image src={platform.logo.src} alt="" width={platform.logo.width} height={platform.logo.height} sizes="(max-width: 640px) 140px, 180px" /></div><h3>{platform.name}</h3><p>{platform.category}</p></article>)}</div>
        <div className="billing-integration-note"><p>We also integrate with many other platforms and custom systems. Contact us to discuss your specific integration needs.</p><a className="billing-text-link" href="#contact">Discuss your integration <ArrowUpRight size={18} aria-hidden="true" /></a></div>
      </div></section>

      <section className="billing-section billing-tinted billing-workflow-section" id="workflow" aria-labelledby="workflow-heading"><div className="billing-shell">
        <div className="billing-workflow-layout">
          <div className="billing-section-heading billing-workflow-heading"><p className="billing-kicker">From encounter to reimbursement</p><h2 id="workflow-heading">Revenue-Cycle<br />Workflow</h2><p>One connected approach to the details that keep your practice moving.</p><span className="billing-workflow-caption"><span /> Six steps. One connected cycle.</span></div>
          <ol className="billing-workflow">{profile.workflowSteps.map((step, index) => <li key={step.step}><div className="billing-workflow-marker"><span className="billing-number">0{step.step}</span>{index < profile.workflowSteps.length - 1 && <ArrowDown size={18} aria-hidden="true" />}</div><div className="billing-workflow-copy"><h3>{step.name}</h3><p>{step.description}</p></div></li>)}</ol>
        </div>
        <section className="billing-tasks" aria-labelledby="billing-tasks-heading">
          <div className="billing-tasks-heading"><p className="billing-kicker">Behind every step</p><h3 id="billing-tasks-heading">Explore our core operational tasks</h3></div>
          <div className="billing-task-columns">{(["front-desk", "billing-rcm"] as const).map((category) => <div className="billing-task-group" key={category}><h4><span className="billing-task-label">{category === "front-desk" ? "01" : "02"}</span>{category === "front-desk" ? "Front-Desk Tasks" : "Billing & RCM Tasks"}</h4><ul>{profile.coreTasks.filter((task) => task.category === category).map((task) => <li key={task.title}><Check size={16} aria-hidden="true" />{task.title}</li>)}</ul></div>)}</div>
        </section>
      </div></section>

      <section className="billing-section" aria-labelledby="difference-heading"><div className="billing-shell billing-difference-grid">
        <div className="billing-commitment"><p className="billing-kicker">Why choose us</p><h2 id="difference-heading">What sets<br />us apart.</h2><p>{profile.identity.commitment}</p><a className="billing-action" href="#contact">Talk about your practice <ArrowUpRight size={18} aria-hidden="true" /></a></div>
        <div className="billing-differentiators">{profile.differentiators.map((item, index) => <article key={item.heading}><span className="billing-number">0{index + 1}</span><div><h3>{item.heading}</h3><p>{item.description}</p></div></article>)}</div>
      </div></section>

      <section className="billing-section billing-tinted" id="testimonials" aria-labelledby="testimonials-heading"><div className="billing-shell">
        <div className="billing-section-heading"><p className="billing-kicker">Client stories</p><h2 id="testimonials-heading">What our clients say.</h2><p>Healthcare providers share their experience with Goodman Billing.</p></div>
        <div className="billing-testimonials">{profile.testimonials.map((testimonial) => <figure key={testimonial.name}><span className="billing-stars" aria-label="5 out of 5 stars">★★★★★</span><blockquote>{testimonial.report}</blockquote><figcaption><strong>{testimonial.name}</strong><span>{testimonial.context}</span></figcaption></figure>)}</div>
      </div></section>

      <section className="billing-contact" id="contact" aria-labelledby="contact-heading"><div className="billing-shell billing-contact-grid">
        <div><p className="billing-kicker">Let’s work together</p><h2 id="contact-heading">Ready to optimize<br />your medical billing?</h2><p>Contact us today to learn how we can help you improve your revenue cycle management.</p><a className="billing-action" href={`mailto:${contact}`}>Email Goodman Billing <ArrowUpRight size={18} aria-hidden="true" /></a><a className="billing-contact-email" href={`mailto:${contact}`}>{contact}</a></div>
        <div className="billing-contact-facts"><div><h3>{company.displayName}</h3><p>{company.legalName}</p><p>{profile.identity.complianceClaim}</p></div>
          <div>
            <h3>{profile.identity.contactAddressLabel}</h3>
            <address>{company.locations[0]}</address>
            <a className="billing-text-link" href="https://maps.app.goo.gl/hnyVHMW6GQLpt8d16" target="_blank" rel="noopener noreferrer" aria-label="View Billing US contact address on Google Maps (opens in a new tab)">View on Google Maps <span aria-hidden="true">↗</span></a>
          </div>
          <div><h3>Leadership</h3><p>{leader.name} — {leader.role}</p><p>{leader.detail}</p></div><a className="billing-text-link" href="#billing-top">Back to top ↑</a>
        </div>
      </div></section>
    </CompanyGroupFrame>
  );
}
