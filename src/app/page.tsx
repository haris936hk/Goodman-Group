import {
  ArrowUpRight,
  Hospital,
  Landmark,
  Mail,
  Network,
  Phone,
  Store,
} from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";

import { CompanyCard } from "@/components/company-card";

const EnquirySection = dynamic(
  () => import("@/components/enquiry-section").then((mod) => mod.EnquirySection)
);
import { ScrollExperience } from "@/components/scroll-experience";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { companies } from "@/data/companies";
import { goodmanBillingProfile } from "@/data/goodman-billing";
import { goodmanGroup } from "@/data/goodman-group";
import { goodmanLaboratoriesProfile } from "@/data/goodman-laboratories";
import { goodmanMedicalEquipmentProfile } from "@/data/goodman-medical-equipment";
import { walGreenChemicalsProfile } from "@/data/wal-green-chemicals";
import { OrganizationJsonLd } from "@/lib/structured-data";
import "./enquiry.css";

const clientCategories = [
  { label: goodmanGroup.customerTypes[0], icon: Landmark },
  { label: goodmanGroup.customerTypes[1], icon: Hospital },
  { label: goodmanGroup.customerTypes[2], icon: Store },
  { label: goodmanGroup.customerTypes[3], icon: Network },
] as const;

export default function Home() {
  return (
    <div className="site-shell" id="top" suppressHydrationWarning>
      <ScrollExperience />
      <OrganizationJsonLd />
        <a className="skip-link" href="#main-content">
          Skip to main content
        </a>
        <div className="scroll-progress" data-scroll-progress />
        <div className="ambient-orb ambient-orb-one" aria-hidden="true" />
        <div className="ambient-orb ambient-orb-two" aria-hidden="true" />
        <SiteHeader />

        <main id="main-content" tabIndex={-1}>
          <section className="hero section-shell" id="about" data-hero>
            <h1 className="sr-only">Goodman Group</h1>

            <div className="hero-system" aria-label="Goodman Group portfolio system">
              <div className="hero-glow" aria-hidden="true" />
              <div className="orbit orbit-outer" data-orbit-ring="outer">
                {companies.map((company, index) => (
                  <Link
                    key={company.slug}
                    href={`/companies/${company.slug}`}
                    className={`orbit-node orbit-node-${index + 1}`}
                    data-orbit-node
                  >
                    <span className="orbit-node-name">{company.displayName}</span>
                    <ArrowUpRight className="orbit-node-arrow" aria-hidden="true" />
                  </Link>
                ))}
              </div>
              <div className="orbit orbit-inner" data-orbit-ring="inner">
                <span className="orbit-pip orbit-pip-one" data-orbit-node />
                <span className="orbit-pip orbit-pip-two" data-orbit-node />
                <span className="orbit-pip orbit-pip-three" data-orbit-node />
              </div>
              <div className="group-core glass-overlay" data-orbit-node>
                <Image
                  className="group-core-logo-dark"
                  src="/assets/logos/GG-white.png"
                  alt="Goodman Group"
                  width={280}
                  height={119}
                  sizes="(max-width: 640px) 120px, 160px"
                  priority
                />
                <Image
                  className="group-core-logo-light"
                  src="/assets/logos/GG-1.png"
                  alt="Goodman Group"
                  width={297}
                  height={80}
                  sizes="(max-width: 640px) 150px, 200px"
                />
              </div>
            </div>
          </section>

          <section className="chapter portfolio-chapter" id="portfolio">
            <div className="section-shell">
              <header className="chapter-heading" data-reveal>
                <div>
                  <p className="chapter-index">01 / Reveal</p>
                  <h2>Companies within the Goodman Group</h2>
                </div>
              </header>

              <div className="group-narrative-panel glass-panel" data-reveal>
                <div className="group-narrative-header">
                  <p className="group-narrative-eyebrow">{goodmanGroup.websiteTitle}</p>
                  <h3 className="group-narrative-message">{goodmanGroup.message}</h3>
                  <p className="group-narrative-mission">{goodmanGroup.mission}</p>
                </div>
              </div>

              <div className="company-grid" aria-label="Company portfolio">
                {companies.map((company) => (
                  <div key={company.slug} data-reveal>
                    <CompanyCard company={company} />
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="chapter company-focus-chapter" id="group-story">
            <div className="section-shell">
              <header className="chapter-heading chapter-heading-wide" data-reveal>
                <div>
                  <p className="chapter-index">02 / Explore</p>
                  <h2>Operating Sectors</h2>
                </div>
              </header>

              <div className="company-focus-stage">
                <div className="company-focus-visual" data-reveal>
                  <div className="company-focus-image-wrap">
                    <Image
                      src="/assets/logos/hero2.png"
                      alt="Goodman Group operations and manufacturing environment"
                      fill
                      sizes="(max-width: 900px) 100vw, 48vw"
                    />
                    <div className="image-wash" aria-hidden="true" />
                  </div>
                  <div className="company-focus-visual-label glass-panel">
                    <span>Goodman Group</span>
                  </div>
                </div>

                <ol className="company-focus-list" aria-label="Goodman Group operating sectors">
                  {goodmanGroup.sectors.map((sector, index) => (
                    <li key={sector} data-reveal>
                      <span className="company-focus-number" aria-hidden="true">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <div className="company-focus-body">
                        <h3>{sector}</h3>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </section>

          <section className="chapter clients-chapter" id="clients" aria-labelledby="clients-heading">
            <div className="section-shell">
              <header className="chapter-heading chapter-heading-wide clients-heading" data-reveal>
                <div>
                  <p className="chapter-index">Who we serve</p>
                  <h2 id="clients-heading">Our clients</h2>
                </div>
              </header>

              <ul className="clients-grid" aria-label="Client categories" data-reveal>
                {clientCategories.map(({ label, icon: Icon }) => (
                  <li className="client-tile glass-panel" key={label}>
                    <div className="client-icon">
                      <Icon aria-hidden="true" focusable="false" />
                    </div>
                    <h3>{label}</h3>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="chapter presence-chapter" id="presence">
            <div className="section-shell">
              <header className="chapter-heading chapter-heading-wide" data-reveal>
                <div>
                  <p className="chapter-index">03 / Expand</p>
                  <h2>Our presence across regional and global markets.</h2>
                </div>
              </header>

              <div className="presence-ledger-grid">
                {/* Goodman Laboratories */}
                <article className="presence-ledger-card glass-panel" data-reveal>
                  <div className="presence-card-header">
                    <span className="presence-card-company">Goodman Laboratories</span>
                    <h3>Manufacturing Base & International Markets</h3>
                    <p className="presence-card-base">
                      Base: Rawat Industrial Triangle, Islamabad, Pakistan (manufacturing facility and nationwide distribution)
                    </p>
                  </div>
                  <ul className="presence-market-list" aria-label="Goodman Laboratories international markets">
                    {goodmanLaboratoriesProfile.internationalActivity.map((activity) => (
                      <li key={activity.market} className="presence-market-item">
                        <div className="presence-market-title-row">
                          <span className="presence-market-name">{activity.market}</span>
                          <span className="presence-market-tag">
                            {activity.market === "Afghanistan"
                              ? "Partner distribution"
                              : activity.market === "Cambodia"
                                ? "Inquiry-driven expansion"
                                : activity.market === "Ghana"
                                  ? "Five-year agreement signed (2024)"
                                  : activity.market === "Tajikistan"
                                    ? "Developing supply chain"
                                    : "Signed agreement / MOU"}
                          </span>
                        </div>
                        <p className="presence-market-detail">{activity.status}</p>
                      </li>
                    ))}
                  </ul>
                </article>

                {/* Goodman Medical Equipment Trading */}
                <article className="presence-ledger-card glass-panel" data-reveal>
                  <div className="presence-card-header">
                    <span className="presence-card-company">Goodman Medical Equipment Trading</span>
                    <h3>Operating Base & Target Markets</h3>
                    <p className="presence-card-base">
                      Base: Dubai, United Arab Emirates · Supply: Nationwide distribution in Pakistan
                    </p>
                  </div>
                  <div className="presence-market-subsections">
                    <div className="presence-market-subsection">
                      <h4 className="presence-subhead">Current markets (Active operations)</h4>
                      <ul className="presence-simple-list">
                        {goodmanMedicalEquipmentProfile.currentMarkets.map((m) => (
                          <li key={m}>
                            <span className="presence-status-badge status-active">Active</span>
                            <span>{m}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="presence-market-subsection">
                      <h4 className="presence-subhead">Target markets (Planned expansion)</h4>
                      <ul className="presence-simple-list">
                        {goodmanMedicalEquipmentProfile.targetMarkets.map((m) => (
                          <li key={m}>
                            <span className="presence-status-badge status-target">Target market</span>
                            <span>{m}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </article>

                {/* Wal Green Chemicals */}
                <article className="presence-ledger-card glass-panel" data-reveal>
                  <div className="presence-card-header">
                    <span className="presence-card-company">Wal Green Chemicals</span>
                    <h3>Sourcing Hub & Import Channels</h3>
                    <p className="presence-card-base">
                      Sourcing hub: {walGreenChemicalsProfile.sourcingNetwork.localSourcing.hub}, Pakistan
                    </p>
                  </div>
                  <div className="presence-market-subsections">
                    <div className="presence-market-subsection">
                      <h4 className="presence-subhead">International sourcing channels (Procurement)</h4>
                      <ul className="presence-market-list" aria-label="Wal Green Chemicals sourcing channels">
                        {walGreenChemicalsProfile.sourcingNetwork.internationalImports.map((imp) => (
                          <li key={imp.origin} className="presence-market-item">
                            <div className="presence-market-title-row">
                              <span className="presence-market-name">{imp.origin}</span>
                              <span className="presence-status-badge status-sourcing">Sourcing import</span>
                            </div>
                            <p className="presence-market-detail">{imp.details}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </article>

                {/* Goodman Billing & Geron Pharma */}
                {/* Goodman Billing */}
                <article className="presence-ledger-card glass-panel" data-reveal>
                  <div className="presence-card-header">
                    <span className="presence-card-company">Goodman Billing</span>
                    <h3>Service Reach &amp; Operations</h3>
                  </div>
                  <div className="presence-market-subsections">
                    <div className="presence-market-subsection">
                      <h4 className="presence-subhead">Goodman Billing (United States)</h4>
                      <p className="presence-market-detail">
                        <strong>Contact address:</strong> {goodmanGroup.contacts.usContactAddress}.
                      </p>
                      <p className="presence-market-detail">
                        <strong>Service reach:</strong> {goodmanBillingProfile.customersServed[goodmanBillingProfile.customersServed.length - 1]}.
                      </p>
                    </div>
                  </div>
                </article>
              </div>
            </div>
          </section>

          <section className="chapter heritage-chapter">
            <div className="section-shell heritage-layout">
              <div className="heritage-copy" data-reveal>
                <p className="chapter-index">04 / Remember</p>
                <h2>Heritage, told with the precision it deserves.</h2>
                <p>
                  {goodmanGroup.leadership.name} serves as {goodmanGroup.leadership.role}.
                </p>

                <div className="heritage-executive-contacts glass-panel">
                  <span className="executive-contacts-badge">Executive Contact</span>
                  <h3>{goodmanGroup.executiveContacts.leaderName}</h3>
                  <p className="executive-contacts-role">{goodmanGroup.leadership.role}</p>

                  <div className="executive-contacts-links">
                    {goodmanGroup.executiveContacts.phones.map((phone) => (
                      <a
                        key={phone}
                        href={`tel:${phone.replace(/\s+/g, "")}`}
                        className="executive-contact-phone"
                      >
                        <Phone aria-hidden="true" className="w-4 h-4" />
                        <span>{phone}</span>
                      </a>
                    ))}
                    <a
                      href={`mailto:${goodmanGroup.executiveContacts.email}`}
                      className="executive-contact-phone"
                    >
                      <Mail aria-hidden="true" className="w-4 h-4" />
                      <span>{goodmanGroup.executiveContacts.email}</span>
                    </a>
                  </div>

                </div>
              </div>

              <ol className="timeline" aria-label="Group history">
                <li data-reveal>
                  <span>Origin</span>
                  <div>
                    <h3>Family-business beginning at age 16</h3>
                    <p>
                      {goodmanGroup.leadership.name} {goodmanGroup.leadership.familyBusinessEntry.toLowerCase()}.
                    </p>
                  </div>
                </li>
                <li data-reveal>
                  <span>Experience</span>
                  <div>
                    <h3>Administrative and manufacturing experience</h3>
                    <p>
                      {goodmanGroup.leadership.moreThan30Years}, with {goodmanGroup.leadership.manufacturingExperience.toLowerCase()}.
                    </p>
                  </div>
                </li>
                <li data-reveal>
                  <span>Now</span>
                  <div>
                    <h3>Leadership appointments</h3>
                    <p>
                      Goodman Laboratories was founded in 2008 under his executive leadership, followed by appointments at Geron Pharma (CEO since 2019), Wal Green Chemicals (CEO since 2021), and Goodman Medical Equipment Trading (Director since July 2024).
                    </p>
                  </div>
                </li>
              </ol>
            </div>
          </section>

          <EnquirySection />

        </main>

      <SiteFooter />
    </div>
  );
}
