import Image from "next/image";
import Link from "next/link";

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
            A clearer way to understand the Group, its companies, and the
            evidence behind each operation.
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
          Contact routes pending approval
        </div>
      </div>
      <div className="footer-meta">
        <p>Goodman Group</p>
        <p>Portfolio information is subject to business and legal validation.</p>
        <Link href="#top">Back to top ↑</Link>
      </div>
    </footer>
  );
}
