import type { Metadata, Viewport } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUp, ArrowUpRight, Code2, Gauge, LifeBuoy, Monitor, Palette, ShieldCheck, Smartphone } from "lucide-react";

import { CompanyGroupFrame } from "@/components/company-group-frame";
import { getCompanyBySlug } from "@/data/companies";
import { goodmanGroup } from "@/data/goodman-group";
import { goodmanTechnologiesProfile as profile } from "@/data/goodman-technologies";
import { OrganizationJsonLd } from "@/lib/structured-data";
import { TechnologiesMotion } from "./technologies-motion";
import { TechnologiesShowcase } from "./technologies-showcase";
import { DesktopServiceArt, MobileServiceArt, WebServiceArt } from "./technologies-service-art";
import { TechnologiesWorkbench } from "./technologies-workbench";
import { TechnologiesApproach } from "./technologies-approach";
import { TechnologiesCommitments } from "./technologies-commitments";
import { TechnologiesDirector } from "./technologies-director";
import "./technologies.css";

const company = getCompanyBySlug("goodman-technologies")!;

export const metadata: Metadata = {
  title: "Goodman Technologies — Software Development",
  description: company.summary,
  alternates: { canonical: "/companies/goodman-technologies" },
};

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f7fc" },
    { media: "(prefers-color-scheme: dark)", color: "#080d1c" },
  ],
};

const serviceIcons = [Code2, Smartphone, Monitor, Palette, ShieldCheck, Gauge, LifeBuoy];
const serviceIllustrations = [WebServiceArt, MobileServiceArt, DesktopServiceArt];

export default function GoodmanTechnologiesPage() {
  return (
    <CompanyGroupFrame company={company} className="technologies-page">
      <OrganizationJsonLd company={company} />
      <TechnologiesMotion />
      <header className="technologies-hero" id="technologies-top">
        <div className="technologies-shell technologies-hero-grid">
          <div className="technologies-hero-copy">
            <div className="technologies-logo-plate"><Image src={company.logo!.src} width={1383} height={1137} sizes="(max-width: 640px) 180px, 220px" alt="Goodman Technologies logo" fetchPriority="high" /></div>
            <p className="technologies-eyebrow">Goodman Technologies</p>
            <h1>From idea to <span className="technologies-headline-accent">software</span> that ships<span className="technologies-headline-period">.</span></h1>
            <p className="technologies-intro">{company.summary}</p>
            <p className="technologies-tagline">{profile.tagline}</p>
            <div className="technologies-actions">
              <Link className="technologies-button" href="/#contact">Start a project <ArrowUpRight size={18} aria-hidden="true" /></Link>
              <a className="technologies-text-link" href="#services">Explore our services <ArrowDown size={17} aria-hidden="true" /></a>
            </div>
          </div>
          <TechnologiesShowcase />
        </div>
        <div className="technologies-shell technologies-hero-footnote"><span>Strategy meets craft. Code meets possibility.</span><a href="#services">Scroll to explore <ArrowDown size={14} aria-hidden="true" /></a></div>
      </header>

      <nav className="technologies-nav" aria-label="On this page"><div className="technologies-shell"><a href="#services">Services</a><a href="#technology">Technology</a><a href="#approach">Our approach</a><a href="#why-goodman">Why Goodman</a><a href="#director">The director</a><a href="#contact">Let&apos;s talk <ArrowUpRight size={15} aria-hidden="true" /></a></div></nav>

      <section className="technologies-experience" aria-label="Goodman Technologies experience"><div className="technologies-shell technologies-metrics">{profile.metrics.map((metric) => <div key={metric.label}><strong>{metric.value}</strong><span>{metric.label}</span></div>)}</div></section>

      <section className="technologies-section" id="services" aria-labelledby="services-heading"><div className="technologies-shell">
        <div className="technologies-heading" data-technologies-reveal><p className="technologies-eyebrow">01 / What we do</p><h2 id="services-heading">Software for every screen.</h2><p>{profile.introduction}</p></div>
        <div className="technologies-services-primary" data-technologies-reveal>
          {profile.services.slice(0, 3).map((service, index) => {
            const Icon = serviceIcons[index];
            const Illustration = serviceIllustrations[index];
            return (
              <article className="technologies-service technologies-service-featured" data-service={service.id} key={service.id}>
                <div className="technologies-service-top"><Icon size={25} aria-hidden="true" /><span>0{index + 1}</span></div>
                <div className="technologies-service-preview"><Illustration /></div>
                <h3>{service.title}</h3><p>{service.description}</p>
                <ul>{service.items.map((item) => <li key={item}>{item}</li>)}</ul>
              </article>
            );
          })}
        </div>
        <div className="technologies-services-secondary" data-technologies-reveal>{profile.services.slice(3).map((service, index) => { const Icon = serviceIcons[index + 3]; return <article className="technologies-service technologies-service-compact" key={service.id}><Icon size={23} aria-hidden="true" /><div><h3>{service.title}</h3><p>{service.description}</p></div></article>; })}</div>
      </div></section>

      <section className="technologies-section technologies-tinted" id="technology" aria-labelledby="technology-heading"><div className="technologies-shell">
        <TechnologiesWorkbench />
      </div></section>

      <section className="technologies-section" id="approach" aria-labelledby="approach-heading"><div className="technologies-shell">
        <div className="technologies-heading" data-technologies-reveal><p className="technologies-eyebrow">03 / Our approach</p><h2 id="approach-heading">From first conversation to production.</h2><p>Explore each stage of the software lifecycle.</p></div>
        <TechnologiesApproach />
      </div></section>

      <section className="technologies-section technologies-tinted" id="why-goodman" aria-labelledby="why-heading"><div className="technologies-shell">
        <div className="technologies-heading" data-technologies-reveal><p className="technologies-eyebrow">04 / Why Goodman</p><h2 id="why-heading">Built with clarity. Delivered with care.</h2></div>
        <TechnologiesCommitments />
      </div></section>

      <TechnologiesDirector />

      <section className="technologies-section technologies-contact" id="contact" aria-labelledby="contact-heading"><div className="technologies-shell technologies-contact-inner" data-technologies-reveal><div><p className="technologies-eyebrow">06 / Let&apos;s talk</p><h2 id="contact-heading">Let&apos;s build what comes next.</h2><p>Choose Goodman Technologies in the company-of-interest field.</p><div className="technologies-actions"><Link className="technologies-button" href="/#contact">Start a project <ArrowUpRight size={18} aria-hidden="true" /></Link><a className="technologies-text-link" href={`mailto:${goodmanGroup.contacts.email}`}>Goodman Group enquiries <ArrowUpRight size={17} aria-hidden="true" /></a></div></div><a className="technologies-back-top" href="#technologies-top">Back to top <ArrowUp size={17} aria-hidden="true" /></a></div></section>
    </CompanyGroupFrame>
  );
}
