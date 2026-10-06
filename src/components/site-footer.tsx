import Image from "next/image";
import Link from "next/link";

import { companies } from "@/data/companies";
import { goodmanGroup } from "@/data/goodman-group";
import { goodmanLaboratoriesProfile } from "@/data/goodman-laboratories";
const footerLinks = [
  ["About the Group", "/#about"],
  ["Our Presence", "/#presence"],
] as const;

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-brand">
          <Image
            src="/assets/logos/GG-white.png"
            alt="Goodman Group"
            width={5555}
            height={2368}
            sizes="(max-width: 640px) 170px, 200px"
          />
          <p>
            {goodmanGroup.description}
          </p>
        </div>
        <nav aria-label="Footer navigation">
          <h2 className="footer-section-label">Explore the Group</h2>
          <div className="footer-nav">
            {footerLinks.map(([label, href]) => (
              <Link key={label} href={href}>
                {label}
              </Link>
            ))}
            {companies.map((company) => (
              <Link key={company.slug} href={`/companies/${company.slug}`}>
                {company.displayName}
              </Link>
            ))}
          </div>
        </nav>
        <div className="footer-action">
          <h2 className="footer-section-label">Get in touch</h2>
          <p className="footer-action-heading">
            Inquiries, partnerships, and career opportunities.
          </p>
          <a
            href={`mailto:${goodmanGroup.contacts.email}?subject=${encodeURIComponent("Goodman Group General Inquiry")}`}
            className="footer-email-link"
          >
            {goodmanGroup.contacts.email}
          </a>
          <address className="footer-address">
            <span className="footer-address-label">US contact address:</span>
            <span>{goodmanGroup.contacts.usContactAddress}</span>
            <a
              className="footer-map-link"
              href="https://maps.app.goo.gl/hnyVHMW6GQLpt8d16"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View US contact address on Google Maps (opens in a new tab)"
            >
              View on Google Maps <span aria-hidden="true">↗</span>
            </a>
          </address>
          <address className="footer-address">
            <span className="footer-address-label">Pakistan office:</span>
            <span>{goodmanLaboratoriesProfile.contactAndLocations.headOffice}</span>
            <a
              className="footer-map-link"
              href="https://maps.app.goo.gl/ziGKsNTZPDgn5NL27"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View Pakistan office on Google Maps (opens in a new tab)"
            >
              View on Google Maps <span aria-hidden="true">↗</span>
            </a>
          </address>
          <address className="footer-address">
            <span className="footer-address-label">Pakistan factory:</span>
            <span>{goodmanLaboratoriesProfile.contactAndLocations.factory}</span>
            <a
              className="footer-map-link"
              href="https://maps.app.goo.gl/JGmf7zXhDnuS7L3Y7"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View Pakistan factory on Google Maps (opens in a new tab)"
            >
              View on Google Maps <span aria-hidden="true">↗</span>
            </a>
          </address>
        </div>
      </div>
      <div className="footer-meta">
        <p>Goodman Group</p>
        <Link href="#top">Back to top ↑</Link>
      </div>
    </footer>
  );
}
