import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { MouseGlowCard } from "@/components/mouse-glow-card";
import type { CompanyProfile } from "@/data/companies";

type CompanyCardProps = {
  company: CompanyProfile;
  compact?: boolean;
};

export function CompanyCard({ company, compact = false }: CompanyCardProps) {
  return (
    <MouseGlowCard
      accent={company.accent}
      className={`company-card glass-panel${compact ? " company-card-compact" : ""}`}
    >
      <Link
        className="company-card-link"
        href={`/companies/${company.slug}`}
        aria-label={`View ${company.displayName}`}
      >
        <div className="company-card-topline">
          <span>{company.business}</span>
        </div>
        <div className="company-logo-frame glass-opaque">
          <Image
            src={company.logo}
            alt={`${company.displayName} logo`}
            width={company.logoWidth}
            height={company.logoHeight}
            sizes="(max-width: 720px) calc(100vw - 68px), (max-width: 1180px) 42vw, 220px"
          />
        </div>
        <div className="company-card-copy">
          <div>
            <h3>{company.displayName}</h3>
            {!compact ? <p>{company.summary}</p> : null}
          </div>
          <span className="round-link" aria-hidden="true">
            <ArrowUpRight />
          </span>
        </div>
      </Link>
    </MouseGlowCard>
  );
}
