import Image from "next/image";
import Link from "next/link";

import { goodmanGroup } from "@/data/goodman-group";
const footerLinks = [
  ["About the Group", "/#about"],
  ["Our Companies", "/companies"],
  ["Our Presence", "/#presence"],
  ["Responsibility", "/#responsibility"],
  ["News", "/#news"],
  ["Careers", "/#connect"],
] as const;

export function SiteFooter() {
  return (
    <footer className="site-footer" id="contact">
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
        <nav className="footer-nav" aria-label="Footer navigation">
          {footerLinks.map(([label, href]) => (
            <Link key={label} href={href}>
              {label}
            </Link>
          ))}
        </nav>
        <div className="footer-action footer-action-status">
          <p className="footer-action-heading">
            Contact us for inquiries, partnerships, or career opportunities:
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
