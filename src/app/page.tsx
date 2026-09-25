import {
  ArrowUpRight,
  Check,
  Clock3,
  FileCheck2,
  MapPin,
  Network,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { CompanyCard } from "@/components/company-card";
import { ScrollExperience } from "@/components/scroll-experience";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { companies } from "@/data/companies";

const presenceStates = [
  {
    label: "Active operation",
    copy: "An operating location with an effective date.",
    className: "state-active",
  },
  {
    label: "Partner market",
    copy: "A market served through a commercial partner.",
    className: "state-partner",
  },
  {
    label: "Agreement stage",
    copy: "A signed agreement that is not yet an active operation.",
    className: "state-agreement",
  },
  {
    label: "Planned market",
    copy: "Future intent, always shown separately from current presence.",
    className: "state-planned",
  },
] as const;

const audienceRoutes = [
  [
    "Procurement",
    "Government hospitals, private hospitals, retailers and national distributors",
  ],
  ["Partnerships", "Inquiries and partnership opportunities"],
  ["Careers", "Career opportunities across the Group"],
  ["Press", "Group profile, leadership and business areas"],
] as const;

export default function Home() {
  return (
    <ScrollExperience>
      <div className="site-shell" id="top">
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
                <span>A parent framework connecting distinct businesses</span>
                <Link href="/companies">
                  View complete company index <ArrowUpRight aria-hidden="true" />
                </Link>
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
                  <h2>{companies.length} operating companies. No false sameness.</h2>
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
                  <h2>Every point on the map says what it means.</h2>
                </div>
                <p>
                  Operations, partners, agreements, and plans are four different
                  realities. The presence system makes that distinction visible.
                </p>
              </header>

              <div className="presence-layout">
                <div className="presence-map glass-panel" data-presence-map data-reveal>
                  <div className="map-grid" aria-hidden="true" />
                  <svg
                    viewBox="0 0 760 520"
                    role="img"
                    aria-labelledby="presence-map-title presence-map-description"
                  >
                    <title id="presence-map-title">Market status visualization</title>
                    <desc id="presence-map-description">
                      A market status illustration using distinct markers for
                      active, partner, agreement-stage, and planned markets.
                    </desc>
                    <path
                      className="map-route map-route-muted"
                      d="M75 375 C180 305, 230 405, 336 300 S515 125, 684 175"
                    />
                    <path
                      className="map-route"
                      d="M75 375 C180 305, 230 405, 336 300 S515 125, 684 175"
                      pathLength="1"
                      strokeDasharray="1"
                      data-map-route
                    />
                    <g className="map-marker state-active" transform="translate(75 375)">
                      <circle r="17" />
                      <circle r="5" />
                    </g>
                    <g className="map-marker state-partner" transform="translate(336 300)">
                      <circle r="17" />
                      <circle r="5" />
                    </g>
                    <g className="map-marker state-agreement" transform="translate(515 176)">
                      <circle r="17" />
                      <circle r="5" />
                    </g>
                    <g className="map-marker state-planned" transform="translate(684 175)">
                      <circle r="17" />
                      <circle r="5" />
                    </g>
                  </svg>
                  <div className="map-label glass-overlay">
                    <MapPin aria-hidden="true" />
                    <span>
                      Status-aware geography
                      <small>Active, partner, agreement-stage, and planned markets</small>
                    </span>
                  </div>
                </div>

                <ul className="presence-legend" aria-label="Market status definitions">
                  {presenceStates.map((state) => (
                    <li key={state.label} className={state.className} data-reveal>
                      <span className="legend-marker" aria-hidden="true" />
                      <div>
                        <h3>{state.label}</h3>
                        <p>{state.copy}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <section className="chapter heritage-chapter">
            <div className="section-shell heritage-layout">
              <div className="heritage-copy" data-reveal>
                <p className="chapter-index">05 / Remember</p>
                <h2>Heritage, told with the precision it deserves.</h2>
                <p>
                  The current site describes a family-business origin and a
                  leadership journey spanning more than three decades in
                  pharmaceutical manufacturing.
                </p>
              </div>

              <ol className="timeline" aria-label="Group history">
                <li data-reveal>
                  <span>Origin</span>
                  <div>
                    <h3>A family-business beginning</h3>
                    <p>
                      Syed Talib Hussain Hashmi says he took over the family
                      business at age 16.
                    </p>
                  </div>
                </li>
                <li data-reveal>
                  <span>Growth</span>
                  <div>
                    <h3>Healthcare and beyond</h3>
                    <p>
                      The current site names Goodman Laboratories, Geron Pharma,
                      Wal Green Chemicals, and medical equipment operations.
                    </p>
                  </div>
                </li>
                <li data-reveal>
                  <span>Now</span>
                  <div>
                    <h3>Leadership across the Group</h3>
                    <p>
                      Goodman Laboratories was founded in 2008, followed by
                      subsequent documented appointments across Geron Pharma,
                      Wal Green Chemicals, and Goodman Medical Equipment through
                      July 2024.
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
              </div>

              <div className="audience-grid">
                {audienceRoutes.map(([title, copy], index) => (
                  <article key={title} className="audience-route" data-reveal>
                    <span>0{index + 1}</span>
                    <div>
                      <h3>{title}</h3>
                      <p>{copy}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        </main>

        <SiteFooter />
      </div>
    </ScrollExperience>
  );
}
