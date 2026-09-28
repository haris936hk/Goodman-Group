import {
  ArrowUpRight,
  Check,
  Clock3,
  FileCheck2,
  Mail,
  Network,
  Phone,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { CompanyCard } from "@/components/company-card";
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


export default function Home() {
  return (
    <ScrollExperience>
      <div className="site-shell" id="top">
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
                <span className="orbit-node orbit-node-one" data-orbit-node>
                  Healthcare
                </span>
                <span className="orbit-node orbit-node-two" data-orbit-node>
                  Equipment
                </span>
                <span className="orbit-node orbit-node-three" data-orbit-node>
                  Chemicals
                </span>
              </div>
              <div className="orbit orbit-inner" data-orbit-ring="inner">
                <span className="orbit-pip orbit-pip-one" data-orbit-node />
                <span className="orbit-pip orbit-pip-two" data-orbit-node />
                <span className="orbit-pip orbit-pip-three" data-orbit-node />
              </div>
              <div className="group-core glass-overlay" data-orbit-node>
                <Image
                  src="/assets/logos/GG-white.png"
                  alt="Goodman Group"
                  width={5555}
                  height={2368}
                  sizes="(max-width: 640px) 120px, 160px"
                  priority
                />
                <span>Parent Group</span>
              </div>
              <div className="system-caption glass-panel" data-orbit-node>
                <Network aria-hidden="true" />
                <span>
                  One clear structure
                  <small>Many distinct company identities</small>
                </span>
              </div>
            </div>
          </section>

          <section className="chapter portfolio-chapter" id="portfolio">
            <div className="section-shell">
              <header className="chapter-heading" data-reveal>
                <div>
                  <p className="chapter-index">01 / Reveal</p>
                  <h2>A portfolio you can actually navigate.</h2>
                </div>
                <p>
                  Direct company discovery makes every entity findable,
                  accountable, and individually art-directed with permanent
                  access to its verified facts and leadership.
                </p>
              </header>

              <div className="portfolio-intro glass-overlay" data-reveal>
                <div className="portfolio-intro-mark">
                  <Sparkles aria-hidden="true" />
                </div>
                <p>Goodman Group</p>
                <span>A parent brand connecting distinct company identities</span>
                <Link href="/companies">
                  View complete company index <ArrowUpRight aria-hidden="true" />
                </Link>
              </div>
              <div className="group-narrative-panel glass-panel" data-reveal>
                <div className="group-narrative-header">
                  <p className="group-narrative-eyebrow">{goodmanGroup.websiteTitle}</p>
                  <h3 className="group-narrative-message">{goodmanGroup.message}</h3>
                  <p className="group-narrative-mission">{goodmanGroup.mission}</p>
                </div>
                <div className="group-narrative-grid">
                  <div className="group-narrative-col">
                    <h4>Operating Sectors</h4>
                    <p className="group-narrative-caption">
                      Conglomerate sectors described across Group profile materials (descriptive sectors, not separate company routes):
                    </p>
                    <ul className="group-sector-list" aria-label="Goodman Group operating sectors">
                      {goodmanGroup.sectors.map((sector) => (
                        <li key={sector}>{sector}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="group-narrative-col">
                    <h4>Business Interests</h4>
                    <p className="group-narrative-caption">
                      Products, services, and commercial activities documented in Group records:
                    </p>
                    <ul className="group-interest-list" aria-label="Goodman Group business interests">
                      {goodmanGroup.businessInterests.map((interest) => (
                        <li key={interest}>{interest}</li>
                      ))}
                    </ul>
                  </div>
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
                  <h2>{companies.length} portfolio companies under the parent Group. No false sameness.</h2>
                </div>
                <p>
                  Each company receives a bespoke page reflecting its legal identity,
                  leadership, capabilities, and authentic brand character.
                </p>
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
                    <span>Goodman Group portfolio</span>
                    <strong>
                      {companies.length} distinct companies with bespoke destinations
                    </strong>
                  </div>
                </div>

                <ol className="company-focus-list">
                  {companies.map((company, index) => (
                    <li key={company.slug} data-reveal>
                      <span className="company-focus-number">0{index + 1}</span>
                      <div className="company-focus-body">
                        <h3>{company.displayName}</h3>
                        <p>{company.summary}</p>
                        <Link
                          href={`/companies/${company.slug}`}
                          className="company-focus-link"
                          aria-label={`View ${company.displayName}`}
                        >
                          <span>View {company.displayName}</span>
                          <ArrowUpRight aria-hidden="true" className="w-4 h-4" />
                        </Link>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </section>

          <section className="chapter proof-chapter" id="responsibility">
            <div className="section-shell proof-layout">
              <div className="proof-statement" data-reveal>
                <p className="chapter-index">03 / Measure</p>
                <p className="display-word" aria-hidden="true">
                  Proof
                </p>
                <h2>Big claims need sharp context.</h2>
                <p>
                  Scale is most useful when every figure is scoped, dated, and
                  connected to evidence.
                </p>
              </div>

              <div className="proof-rules">
                <article className="proof-rule" data-reveal>
                  <span>01</span>
                  <FileCheck2 aria-hidden="true" />
                  <h3>Documented</h3>
                  <p>Records, licences, documents, and named sources.</p>
                </article>
                <article className="proof-rule" data-reveal>
                  <span>02</span>
                  <Network aria-hidden="true" />
                  <h3>Scoped</h3>
                  <p>Group, company, facility, and market facts never blur together.</p>
                </article>
                <article className="proof-rule" data-reveal>
                  <span>03</span>
                  <Clock3 aria-hidden="true" />
                  <h3>Dated</h3>
                  <p>Every changing record carries a clear effective date.</p>
                </article>
              </div>
            </div>
          </section>

          <section className="chapter presence-chapter" id="presence">
            <div className="section-shell">
              <header className="chapter-heading" data-reveal>
                <div>
                  <p className="chapter-index">04 / Expand</p>
                  <h2>Geographic presence and market status ledger.</h2>
                </div>
                <p>
                  Operations, partner distribution, signed agreements, sourcing channels, and planned target markets are distinct realities. This ledger groups verified presence by company and source.
                </p>
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
                                  ? "Signed agreement (2024 expected consignment)"
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
                      <h4 className="presence-subhead">Target markets (Brochure plans)</h4>
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
                      Sourcing hub: {walGreenChemicalsProfile.sourcingNetwork.localSourcing.hub}, Pakistan (procurement/sourcing, not an operating facility)
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
                <article className="presence-ledger-card glass-panel" data-reveal>
                  <div className="presence-card-header">
                    <span className="presence-card-company">Goodman Billing & Geron Pharma</span>
                    <h3>Service Reach & Boundary Status</h3>
                  </div>
                  <div className="presence-market-subsections">
                    <div className="presence-market-subsection">
                      <h4 className="presence-subhead">Goodman Billing (United States)</h4>
                      <p className="presence-market-detail">
                        <strong>Contact address:</strong> {goodmanGroup.contacts.usContactAddress} ({goodmanBillingProfile.identity.contactAddressLabel}; website-listed contact, not an inspected service centre).
                      </p>
                      <p className="presence-market-detail">
                        <strong>Service reach:</strong> {goodmanBillingProfile.customersServed[goodmanBillingProfile.customersServed.length - 1]}.
                      </p>
                    </div>
                    <div className="presence-market-subsection">
                      <h4 className="presence-subhead">Geron Pharma (Scope Boundary)</h4>
                      <p className="presence-market-detail">
                        Legal identity and CEO documented; source profile does not substantiate separate operating facilities, distribution markets, or customer locations.
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
                <p className="chapter-index">05 / Remember</p>
                <h2>Heritage, told with the precision it deserves.</h2>
                <p>
                  {goodmanGroup.leadership.name} serves as {goodmanGroup.leadership.role}.
                  Group source materials distinguish specific historical leadership claims
                  rather than merging them into a single unverified census.
                </p>

                <div className="heritage-executive-contacts glass-panel">
                  <span className="executive-contacts-badge">Executive Contact</span>
                  <h3>{goodmanGroup.executiveContacts.leaderName}</h3>
                  <p className="executive-contacts-role">{goodmanGroup.leadership.role}</p>
                  <p className="executive-contacts-note">
                    {goodmanGroup.executiveContacts.note}
                  </p>
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
                  <p className="executive-contacts-provenance">
                    Source: {goodmanGroup.executiveContacts.provenance}
                  </p>
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
                      {goodmanGroup.leadership.moreThan30Years}. Separately, historical profile text cites {goodmanGroup.leadership.manufacturingExperience.toLowerCase()}.
                    </p>
                  </div>
                </li>
                <li data-reveal>
                  <span>Scale claim</span>
                  <div>
                    <h3>Legacy managed workforce claim</h3>
                    <p>
                      {goodmanGroup.leadership.moreThan360Managed}. Separately, company-specific materials cite more than 150 team members historically managed, preserved on its own surface.
                    </p>
                  </div>
                </li>
                <li data-reveal>
                  <span>Now</span>
                  <div>
                    <h3>Documented leadership appointments</h3>
                    <p>
                      Goodman Laboratories was founded in 2008 (CEO since 2012 or 2016 per conflicting sources), followed by appointments at Geron Pharma (CEO since 2019), Wal Green Chemicals (CEO since 2021), and Goodman Medical Equipment Trading (Director since July 2024).
                    </p>
                  </div>
                </li>
              </ol>
            </div>
          </section>

          <section className="chapter activity-chapter" id="news">
            <div className="section-shell">
              <header className="chapter-heading" data-reveal>
                <div>
                  <p className="chapter-index">06 / Advance</p>
                  <h2>A Group understood through what it does next.</h2>
                </div>
                <p>
                  A future editorial feed will surface launches,
                  investments, partnerships, and company milestones without
                  inventing activity to fill a layout.
                </p>
              </header>

              <div className="activity-grid">
                <article className="activity-feature glass-panel" data-reveal>
                  <div className="activity-art" aria-hidden="true">
                    <span />
                    <i />
                  </div>
                  <div className="activity-copy">
                    <span>Editorial framework</span>
                    <h3>Updates will become part of the Group story.</h3>
                    <p>
                      Each item will identify its company, publication date,
                      content owner, and source.
                    </p>
                  </div>
                </article>
                <div className="activity-notes">
                  {[
                    "Company milestones",
                    "Partnership updates",
                    "Investments and launches",
                  ].map((item, index) => (
                    <div key={item} data-reveal>
                      <span>0{index + 1}</span>
                      <p>{item}</p>
                      <Check aria-hidden="true" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="connect-chapter" id="connect">
            <div className="section-shell">
              <div className="connect-intro" data-reveal>
                <p className="chapter-index">07 / Connect</p>
                <h2>Inquiries, partnerships and career opportunities.</h2>
                <p>
                  Contact Goodman Group for inquiries, partnerships, or career
                  opportunities.
                </p>
                <div className="connect-general-cta">
                  <a
                    href={`mailto:${goodmanGroup.contacts.email}?subject=${encodeURIComponent("Goodman Group General Inquiry")}`}
                    className="connect-general-link"
                  >
                    <Mail aria-hidden="true" className="w-4 h-4" />
                    <span>General inquiry: {goodmanGroup.contacts.email}</span>
                  </a>
                </div>
              </div>

              <div className="audience-grid">
                <Link
                  href="/companies"
                  className="audience-route audience-route-link"
                  data-reveal
                >
                  <span>01</span>
                  <div>
                    <h3>Procurement</h3>
                    <p>
                      Government hospitals, private hospitals, retailers and national distributors
                    </p>
                  </div>
                  <ArrowUpRight aria-hidden="true" />
                </Link>

                <a
                  href={`mailto:${goodmanGroup.contacts.email}?subject=${encodeURIComponent("Goodman Group Partnerships Inquiry")}`}
                  className="audience-route audience-route-link"
                  data-reveal
                >
                  <span>02</span>
                  <div>
                    <h3>Partnerships</h3>
                    <p>Inquiries and partnership opportunities</p>
                  </div>
                  <ArrowUpRight aria-hidden="true" />
                </a>

                <a
                  href={`mailto:${goodmanGroup.contacts.email}?subject=${encodeURIComponent("Goodman Group Careers Inquiry")}`}
                  className="audience-route audience-route-link"
                  data-reveal
                >
                  <span>03</span>
                  <div>
                    <h3>Careers</h3>
                    <p>Career opportunities across the Group</p>
                  </div>
                  <ArrowUpRight aria-hidden="true" />
                </a>

                <a
                  href={`mailto:${goodmanGroup.contacts.email}?subject=${encodeURIComponent("Goodman Group Press Inquiry")}`}
                  className="audience-route audience-route-link"
                  data-reveal
                >
                  <span>04</span>
                  <div>
                    <h3>Press</h3>
                    <p>Group profile, leadership and business areas</p>
                  </div>
                  <ArrowUpRight aria-hidden="true" />
                </a>
              </div>
            </div>
          </section>
        </main>

        <SiteFooter />
      </div>
    </ScrollExperience>
  );
}
