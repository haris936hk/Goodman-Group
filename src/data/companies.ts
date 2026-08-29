export type Sector =
  | "Healthcare & Pharmaceuticals"
  | "Medical Equipment"
  | "Chemicals";

export type CompanyProfile = {
  slug: string;
  publicationStatus: "provisional" | "published";
  displayName: string;
  legalName: string | null;
  relationship: null;
  relationshipLabel: "Relationship under verification";
  sector: Sector;
  summary: string;
  logo: string;
  logoWidth: number;
  logoHeight: number;
  accent: string;
  founded: null;
  locations: readonly [];
  leadership: readonly [];
  capabilities: readonly [];
  contacts: readonly [];
  lastReviewed: "Pending business approval";
};

export const companies = [
  {
    slug: "goodman-laboratories",
    publicationStatus: "provisional",
    displayName: "Goodman Laboratories",
    legalName: null,
    relationship: null,
    relationshipLabel: "Relationship under verification",
    sector: "Healthcare & Pharmaceuticals",
    summary:
      "A provisional discovery record associated with healthcare and pharmaceuticals source material. Its Group relationship and operating details await business and legal approval.",
    logo: "/assets/logos/GoodmanLabLogo.png",
    logoWidth: 575,
    logoHeight: 279,
    accent: "#46b7e8",
    founded: null,
    locations: [],
    leadership: [],
    capabilities: [],
    contacts: [],
    lastReviewed: "Pending business approval",
  },
  {
    slug: "hygeia-pharmaceuticals",
    publicationStatus: "provisional",
    displayName: "Hygeia Pharmaceuticals",
    legalName: null,
    relationship: null,
    relationshipLabel: "Relationship under verification",
    sector: "Healthcare & Pharmaceuticals",
    summary:
      "A provisional discovery record associated with healthcare and pharmaceuticals source material. Its Group relationship and operating details await business and legal approval.",
    logo: "/assets/logos/HygeiaLogo.png",
    logoWidth: 585,
    logoHeight: 254,
    accent: "#79d4b3",
    founded: null,
    locations: [],
    leadership: [],
    capabilities: [],
    contacts: [],
    lastReviewed: "Pending business approval",
  },
  {
    slug: "geron-pharma",
    publicationStatus: "provisional",
    displayName: "Geron Pharma",
    legalName: null,
    relationship: null,
    relationshipLabel: "Relationship under verification",
    sector: "Healthcare & Pharmaceuticals",
    summary:
      "A provisional discovery record associated with healthcare and pharmaceuticals source material. Its Group relationship and operating details await business and legal approval.",
    logo: "/assets/logos/geronlogo.png",
    logoWidth: 684,
    logoHeight: 357,
    accent: "#58c6f0",
    founded: null,
    locations: [],
    leadership: [],
    capabilities: [],
    contacts: [],
    lastReviewed: "Pending business approval",
  },
  {
    slug: "medwell-pharmaceuticals",
    publicationStatus: "provisional",
    displayName: "Medwell Pharmaceuticals",
    legalName: null,
    relationship: null,
    relationshipLabel: "Relationship under verification",
    sector: "Healthcare & Pharmaceuticals",
    summary:
      "A provisional discovery record associated with healthcare and pharmaceuticals source material. Its Group relationship and operating details await business and legal approval.",
    logo: "/assets/logos/medwellLogo.png",
    logoWidth: 516,
    logoHeight: 261,
    accent: "#7b9cff",
    founded: null,
    locations: [],
    leadership: [],
    capabilities: [],
    contacts: [],
    lastReviewed: "Pending business approval",
  },
  {
    slug: "goodman-medical-equipment",
    publicationStatus: "provisional",
    displayName: "Goodman Medical Equipment Trading",
    legalName: null,
    relationship: null,
    relationshipLabel: "Relationship under verification",
    sector: "Medical Equipment",
    summary:
      "A provisional discovery record associated with medical equipment source material. Its Group relationship and operating details await business and legal approval.",
    logo: "/assets/logos/GG3.png",
    logoWidth: 2450,
    logoHeight: 1961,
    accent: "#4dc0e8",
    founded: null,
    locations: [],
    leadership: [],
    capabilities: [],
    contacts: [],
    lastReviewed: "Pending business approval",
  },
  {
    slug: "wal-green-chemicals",
    publicationStatus: "provisional",
    displayName: "Wal Green Chemicals",
    legalName: null,
    relationship: null,
    relationshipLabel: "Relationship under verification",
    sector: "Chemicals",
    summary:
      "A provisional discovery record associated with chemicals source material. Its Group relationship and operating details await business and legal approval.",
    logo: "/assets/logos/walgreenLogo.png",
    logoWidth: 528,
    logoHeight: 259,
    accent: "#5fbf92",
    founded: null,
    locations: [],
    leadership: [],
    capabilities: [],
    contacts: [],
    lastReviewed: "Pending business approval",
  },
] as const satisfies readonly CompanyProfile[];

export const sectors = [
  {
    name: "Healthcare & Pharmaceuticals",
    index: "01",
    description:
      "Distinct company identities presented with room for manufacturing, quality, product, and compliance evidence once approved.",
  },
  {
    name: "Medical Equipment",
    index: "02",
    description:
      "A dedicated operating-company pathway for equipment capabilities, service information, and direct inquiry routing.",
  },
  {
    name: "Chemicals",
    index: "03",
    description:
      "A separate sector context that prevents chemical operations from being misrepresented as pharmaceutical activity.",
  },
  {
    name: "Automotive",
    index: "04",
    description:
      "Entity register under review. No operating company is presented until the relationship is confirmed.",
  },
  {
    name: "Real Estate",
    index: "05",
    description:
      "Entity register under review. Future profiles will use property-relevant modules rather than a generic template.",
  },
] as const;

export function getCompanyBySlug(slug: string) {
  return companies.find((company) => company.slug === slug);
}

export function isCompanyPublished(company: CompanyProfile): boolean {
  return company.publicationStatus === "published";
}
