import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { CompanyGroupFrame } from "@/components/company-group-frame";
import { getCompanyBySlug } from "@/data/companies";
import { goodmanLaboratoriesProfile } from "@/data/goodman-laboratories";
import "./laboratories.css";

const company = getCompanyBySlug("goodman-laboratories")!;
const profile = goodmanLaboratoriesProfile;

export const metadata: Metadata = {
  title: company.displayName,
  description: `${profile.identity.legalName} — ${company.summary}`,
};

export default function GoodmanLaboratoriesPage() {
  const leader = profile.leadership;
  const certifications = profile.certifications;
  const contact = profile.contactAndLocations;

  return (
    <CompanyGroupFrame company={company} className="laboratories-page">
      <header className="lab-hero">
        <div className="lab-shell lab-hero-grid">
          <div className="lab-hero-copy">
            <p className="lab-eyebrow">{profile.identity.legalName}</p>
            <p className="lab-descriptor">{company.business}</p>
            <h1>{company.displayName}</h1>
            <p className="lab-purpose">{profile.identity.purpose}</p>
            <p className="lab-summary">{company.summary}</p>
          </div>
          <div className="lab-logo-stage">
            {company.logo ? (
              <Image
                src={company.logo.src}
                alt={`${company.displayName} logo`}
                width={company.logo.width}
                height={company.logo.height}
                priority
                sizes="(max-width: 640px) 240px, 320px"
              />
            ) : null}
          </div>
        </div>
      </header>

      <nav className="lab-profile-nav" aria-label="Goodman Laboratories profile navigation">
        <ul className="lab-shell lab-nav-list">
          <li><a href="#company">Company</a></li>
          <li><a href="#leadership">Leadership</a></li>
          <li><a href="#operations-reach">Operations &amp; reach</a></li>
          <li><a href="#products">Products</a></li>
          <li><a href="#certifications">Certifications</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </nav>

      <div className="lab-shell lab-main-sections">
        <section id="company" className="lab-section" aria-labelledby="company-heading">
          <header className="lab-section-heading">
            <p className="lab-kicker">Company</p>
            <h2 id="company-heading">Purpose, activity, and principles</h2>
          </header>
          <div className="lab-lead-split">
            <div>
              <h3>Mission</h3>
              <p className="lab-lead">{profile.mission}</p>
            </div>
            <div>
              <h3>Vision</h3>
              <p className="lab-lead">{profile.vision}</p>
            </div>
          </div>
          <dl className="lab-fact-rows">
            <div><dt>Founded</dt><dd>{profile.identity.founded} by Syed Talib Hussain Hashmi</dd></div>
            <div><dt>Industry and activities</dt><dd>{profile.identity.industry}</dd></div>
            <div><dt>Stakeholder relationships</dt><dd>{profile.identity.stakeholderRelationships}</dd></div>
          </dl>
          <div className="lab-two-column">
            <div>
              <h3>Values</h3>
              <ul className="lab-ruled-list">
                {profile.values.map((value) => <li key={value}>{value}</li>)}
              </ul>
            </div>
            <div>
              <h3>Sustainability and growth</h3>
              <ul className="lab-ruled-list">
                <li>{profile.sustainabilityAndGrowth.foundationSummary}</li>
                <li>{profile.sustainabilityAndGrowth.leadershipFoundationClaim}</li>
                <li>{profile.sustainabilityAndGrowth.expansionObjective}</li>
              </ul>
            </div>
          </div>
          <div className="lab-subsection">
            <h3>Corporate social responsibility</h3>
            <ul className="lab-ruled-list">
              {profile.socialResponsibility.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
        </section>

        <section id="leadership" className="lab-section" aria-labelledby="leadership-heading">
          <header className="lab-section-heading">
            <p className="lab-kicker">Leadership</p>
            <h2 id="leadership-heading">Executive leadership</h2>
          </header>
          <div className="lab-leader-heading">
            <div><h3>{leader.name}</h3><p>{leader.role}</p></div>
            <p className="lab-leader-tenure">{leader.tenureNote}</p>
          </div>
          <p className="lab-prose">{leader.biography}</p>
          <dl className="lab-metrics">
            <div><dt>Industry and entrepreneurship</dt><dd>{leader.totalExperience}</dd></div>
            <div><dt>Manufacturing experience</dt><dd>{leader.manufacturingExperience}</dd></div>
            <div><dt>Family enterprise responsibility</dt><dd>From age {leader.familyBusinessStartAge}</dd></div>
            <div><dt>Team scale</dt><dd>{leader.teamSizeClaim}</dd></div>
          </dl>
          <div className="lab-subsection">
            <h3>Executive expertise</h3>
            <ul className="lab-chip-list">
              {leader.expertise.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
        </section>

        <section id="operations-reach" className="lab-section" aria-labelledby="operations-heading">
          <header className="lab-section-heading">
            <p className="lab-kicker">Operations &amp; reach</p>
            <h2 id="operations-heading">Manufacturing, customers, and markets</h2>
          </header>
          <div className="lab-two-column">
            <div>
              <h3>Core capabilities</h3>
              <ul className="lab-chip-list">
                {profile.identity.capabilities.map((capability) => <li key={capability}>{capability}</li>)}
              </ul>
            </div>
            <div>
              <h3>Customer segments</h3>
              <ul className="lab-ruled-list">
                {profile.customers.map((customer) => <li key={customer}>{customer}</li>)}
              </ul>
            </div>
          </div>
          <div className="lab-subsection">
            <h3>Facilities and manufacturing standards</h3>
            <ul className="lab-ruled-list">
              {profile.facilitiesAndOperations.map((statement) => <li key={statement}>{statement}</li>)}
            </ul>
          </div>
          <div className="lab-subsection">
            <h3>Approved production sections</h3>
            <dl className="lab-fact-rows">
              {profile.productionSections.map((section) => (
                <div key={section.name}>
                  <dt>{section.name}</dt>
                  <dd>{section.description}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="lab-two-column lab-subsection">
            <div>
              <h3>Website-reported departments</h3>
              <ul className="lab-chip-list">
                {profile.websiteFunctions.map((dept) => <li key={dept}>{dept}</li>)}
              </ul>
              <p className="lab-note">Website-reported departmental structure and Quality Control testing functions (undated source workforce figures withheld per verification policy).</p>
            </div>
            <div>
              <h3>Governance structure</h3>
              <ul className="lab-chip-list">
                {profile.governance.map((role) => <li key={role}>{role}</li>)}
              </ul>
            </div>
          </div>
          <div className="lab-subsection">
            <h3>Organizational roles</h3>
            <ul className="lab-chip-list">
              {profile.organizationalFunctions.map((role) => <li key={role}>{role}</li>)}
            </ul>
          </div>
          <div className="lab-two-column lab-market-groups">
            <div>
              <h3>National coverage</h3>
              <p>Distribution network coverage across Pakistan&apos;s administrative regions.</p>
              <ul className="lab-chip-list">
                {profile.geographicPresence.nationalCoverage.map((area) => <li key={area}>{area}</li>)}
              </ul>
            </div>
            <div>
              <h3>International activity &amp; reach</h3>
              <p>Website-reported international activity; market statuses differ.</p>
              <ul className="lab-ruled-list">
                {profile.internationalActivity.map((activity) => (
                  <li key={activity.market}>
                    <strong>{activity.market}:</strong> {activity.status}
                  </li>
                ))}
              </ul>
              <p className="lab-note">Website-reported international activity reflects differing stages of distribution, inquiries, agreements, and conditional supply; it does not represent confirmed shipments to all markets or foreign manufacturing facilities.</p>
            </div>
          </div>
          <div className="lab-subsection">
            <h3>Therapeutic areas</h3>
            <ul className="lab-chip-list">
              {profile.therapeuticAreas.map((area) => <li key={area}>{area}</li>)}
            </ul>
          </div>
        </section>

        <section id="products" className="lab-section" aria-labelledby="products-heading">
          <header className="lab-section-heading">
            <p className="lab-kicker">Products</p>
            <h2 id="products-heading">Registered and marketed products</h2>
          </header>
          <p className="lab-prose">Pack variants are grouped under their product name. Registration numbers are included where supplied.</p>
          <div className="lab-disclosures">
            {profile.productCategories.map((category) => (
              <details key={category.name} className="lab-disclosure">
                <summary>
                  <span>{category.name}</span>
                  <small>{category.products.length} {category.products.length === 1 ? "product" : "products"}</small>
                </summary>
                <div className="lab-product-list">
                  {category.products.map((product) => (
                    <article key={product.name}>
                      <h3>{product.name}</h3>
                      <p>{product.details}</p>
                    </article>
                  ))}
                </div>
              </details>
            ))}
          </div>

          <div className="lab-subsection lab-literature">
            <h2>Product literature and stated clinical positioning</h2>
            <div className="lab-warning" role="note" aria-label="Manufacturer literature disclosure">
              <strong>Manufacturer literature disclosure</strong>
              <p>{profile.productLiteratureQualifier}</p>
            </div>
            <div className="lab-disclosures">
              {profile.productLiterature.map((literature) => (
                <details key={literature.title} className="lab-disclosure">
                  <summary>
                    <span>{literature.title}</span>
                    <small>{literature.genericOrSubtitle ?? "Product literature"}</small>
                  </summary>
                  <div className="lab-literature-body">
                    <ul className="lab-ruled-list">
                      {literature.points.map((point) => <li key={point}>{point}</li>)}
                    </ul>
                    {literature.dosageTable ? (
                      <div className="lab-table-wrapper" tabIndex={0} role="region" aria-label={`${literature.title} dosage and regimen table`}>
                        <table>
                          <caption className="sr-only">{literature.title} dosage and regimen table</caption>
                          <thead><tr><th scope="col">Patient group</th><th scope="col">Stated regimen</th></tr></thead>
                          <tbody>{literature.dosageTable.map((row) => <tr key={row.patientGroup}><td>{row.patientGroup}</td><td>{row.regimen}</td></tr>)}</tbody>
                        </table>
                      </div>
                    ) : null}
                    {literature.references?.length ? (
                      <div className="lab-references"><h3>Printed literature references</h3><ol>{literature.references.map((reference) => <li key={reference}>{reference}</li>)}</ol></div>
                    ) : null}
                  </div>
                </details>
              ))}
            </div>
          </div>
          <div className="lab-subsection">
            <h3>Packaging and dispensing statements shown on product artwork</h3>
            <ul className="lab-ruled-list">
              {profile.packagingAndDispensing.map((statement) => <li key={statement}>{statement}</li>)}
            </ul>
          </div>
        </section>

        <section id="certifications" className="lab-section" aria-labelledby="certifications-heading">
          <header className="lab-section-heading">
            <p className="lab-kicker">Certifications</p>
            <h2 id="certifications-heading">Management-system certifications</h2>
          </header>
          <dl className="lab-fact-rows">
            <div><dt>Issuer</dt><dd>{certifications.issuer}</dd></div>
            <div><dt>Certified company</dt><dd>{certifications.companyName}</dd></div>
            <div><dt>Registration number</dt><dd>{certifications.registrationNumber}</dd></div>
            <div><dt>Certified scope</dt><dd>{certifications.commonScope}</dd></div>
            <div><dt>Certified address</dt><dd>{certifications.certifiedAddress}</dd></div>
            <div><dt>Registration date</dt><dd>{certifications.commonDates.registrationDate}</dd></div>
            <div><dt>Issue date</dt><dd>{certifications.commonDates.issueDate}</dd></div>
            <div><dt>Certificate expiry</dt><dd>{certifications.commonDates.expiryDate}</dd></div>
            <div><dt>Recertification due</dt><dd>{certifications.commonDates.recertificationDueDate}</dd></div>
          </dl>
          <div className="lab-certificates">
            {certifications.certificates.map((certificate) => (
              <article key={certificate.certificateNumber}>
                <strong>{certificate.standard}</strong>
                <h3>{certificate.managementSystem}</h3>
                <p>Certificate {certificate.certificateNumber}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="contact" className="lab-section" aria-labelledby="contact-heading">
          <header className="lab-section-heading">
            <p className="lab-kicker">Contact</p>
            <h2 id="contact-heading">Contact and locations</h2>
          </header>
          <div className="lab-two-column">
            <div><h3>Head office</h3><address>{contact.headOffice}</address></div>
            <div><h3>Factory</h3><address>{contact.factory}</address><p>Manufacturing licence no. shown on product artwork: <strong>{contact.manufacturingLicenceNumber}</strong></p></div>
          </div>
          <dl className="lab-fact-rows lab-contact-rows">
            <div><dt>Email</dt><dd><a href={`mailto:${contact.email}`}>{contact.email}</a></dd></div>
            <div><dt>Official website</dt><dd><a href={contact.websiteUrl} target="_blank" rel="noopener noreferrer">{contact.website}<ArrowUpRight aria-hidden="true" /></a></dd></div>
            <div><dt>Factory telephone range</dt><dd><a href={`tel:${contact.factoryPhonePrimary}`}>{contact.factoryPhoneRange}</a></dd></div>
            <div><dt>Alternate factory telephone</dt><dd><a href={`tel:${contact.factoryPhoneAlternate}`}>{contact.factoryPhoneAlternateDisplay}</a></dd></div>
          </dl>
          <Link href="/companies" className="lab-all-companies-link">View all Goodman Group companies<ArrowUpRight aria-hidden="true" /></Link>
        </section>
      </div>
    </CompanyGroupFrame>
  );
}
