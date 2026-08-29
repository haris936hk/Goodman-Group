export type Sector =
  | "Healthcare & Pharmaceuticals"
  | "Medical Equipment"
  | "Chemicals";

export type CompanyProfile = {
  slug: string;
  publicationStatus: "provisional" | "published";
  displayName: string;
  legalName: string | null;
  relationship: string | null;
  relationshipLabel: string;
  sector: Sector;
  summary: string;
  logo: string;
  logoWidth: number;
  logoHeight: number;
  accent: string;
  founded: string | null;
  locations: readonly string[];
  leadership: readonly {
    name: string;
    role: string;
    detail: string;
  }[];
  capabilities: readonly string[];
  contacts: readonly string[];
  lastReviewed: string;
};

export const companies = [
  {
    slug: "goodman-laboratories",
    publicationStatus: "provisional",
    displayName: "Goodman Laboratories",
    legalName: "Goodman Laboratories (Pvt.) Ltd.",
    relationship: null,
    relationshipLabel: "Named on the current Goodman Group site",
    sector: "Healthcare & Pharmaceuticals",
    summary:
      "A pharmaceutical manufacturing company named on the current Goodman Group site. Syed Talib Hussain Hashmi is listed as its CEO since 2012.",
    logo: "/assets/logos/GoodmanLabLogo.png",
    logoWidth: 575,
    logoHeight: 279,
    accent: "#46b7e8",
    founded: null,
    locations: [],
    leadership: [
      {
        name: "Syed Talib Hussain Hashmi",
        role: "CEO since 2012",
        detail: "Listed on the current Goodman Group site.",
      },
    ],
    capabilities: ["Pharmaceutical manufacturing"],
    contacts: [],
    lastReviewed: "Current Goodman Group site",
  },
  {
    slug: "hygeia-pharmaceuticals",
    publicationStatus: "provisional",
    displayName: "Hygeia Pharmaceuticals",
    legalName: null,
    relationship: null,
    relationshipLabel: "Included in migration source material",
    sector: "Healthcare & Pharmaceuticals",
    summary:
      "A pharmaceutical company represented in the migration source material. Its relationship to Goodman Group is not stated on the current Goodman Group homepage.",
    logo: "/assets/logos/HygeiaLogo.png",
    logoWidth: 585,
    logoHeight: 254,
    accent: "#79d4b3",
    founded: null,
    locations: [],
    leadership: [],
    capabilities: ["Pharmaceuticals"],
    contacts: [],
    lastReviewed: "Current Goodman Group source review",
  },
  {
    slug: "geron-pharma",
    publicationStatus: "provisional",
    displayName: "Geron Pharma",
    legalName: "Geron Pharma Pvt. Ltd.",
    relationship: null,
    relationshipLabel: "Named on the current Goodman Group site",
    sector: "Healthcare & Pharmaceuticals",
    summary:
      "A pharmaceutical company named on the current Goodman Group site. Syed Talib Hussain Hashmi is listed as its CEO since 2019.",
    logo: "/assets/logos/geronlogo.png",
    logoWidth: 684,
    logoHeight: 357,
    accent: "#58c6f0",
    founded: null,
    locations: [],
    leadership: [
      {
        name: "Syed Talib Hussain Hashmi",
        role: "CEO since 2019",
        detail: "Listed on the current Goodman Group site.",
      },
    ],
    capabilities: ["Pharmaceuticals"],
    contacts: [],
    lastReviewed: "Current Goodman Group site",
  },
  {
    slug: "medwell-pharmaceuticals",
    publicationStatus: "provisional",
    displayName: "Medwell Pharmaceuticals",
    legalName: null,
    relationship: null,
    relationshipLabel: "Included in migration source material",
    sector: "Healthcare & Pharmaceuticals",
    summary:
      "A pharmaceutical company represented in the migration source material. Its relationship to Goodman Group is not stated on the current Goodman Group homepage.",
    logo: "/assets/logos/medwellLogo.png",
    logoWidth: 516,
    logoHeight: 261,
    accent: "#7b9cff",
    founded: null,
    locations: [],
    leadership: [],
    capabilities: ["Pharmaceuticals"],
    contacts: [],
    lastReviewed: "Current Goodman Group source review",
  },
  {
    slug: "goodman-medical-equipment",
    publicationStatus: "provisional",
    displayName: "Goodman Medical Equipment Trading",
    legalName: null,
    relationship: null,
    relationshipLabel: "Named on the current Goodman Group site",
    sector: "Medical Equipment",
    summary:
      "A medical equipment trading operation named on the current Goodman Group site in both UAE and Pakistan. Syed Talib Hussain Hashmi is listed as director from July 2024.",
    logo: "/assets/logos/GG3.png",
    logoWidth: 2450,
    logoHeight: 1961,
    accent: "#4dc0e8",
    founded: null,
    locations: ["United Arab Emirates", "Pakistan"],
    leadership: [
      {
        name: "Syed Talib Hussain Hashmi",
        role: "Director since July 2024",
        detail: "Listed for the UAE and Pakistan operations.",
      },
    ],
    capabilities: ["Medical equipment trading"],
    contacts: [],
    lastReviewed: "Current Goodman Group site",
  },
  {
    slug: "wal-green-chemicals",
    publicationStatus: "provisional",
    displayName: "Wal Green Chemicals",
    legalName: "Wal Green Chemical Pvt. Ltd.",
    relationship: null,
    relationshipLabel: "Named on the current Goodman Group site",
    sector: "Chemicals",
    summary:
      "A chemicals business named on the current Goodman Group site. Syed Talib Hussain Hashmi is listed as its CEO since 2021.",
    logo: "/assets/logos/walgreenLogo.png",
    logoWidth: 528,
    logoHeight: 259,
    accent: "#5fbf92",
    founded: null,
    locations: [],
    leadership: [
      {
        name: "Syed Talib Hussain Hashmi",
        role: "CEO since 2021",
        detail: "Listed on the current Goodman Group site.",
      },
    ],
    capabilities: ["Chemicals"],
    contacts: [],
    lastReviewed: "Current Goodman Group site",
  },
] as const satisfies readonly CompanyProfile[];

export const sectors = [
  {
    name: "Healthcare & Pharmaceuticals",
    index: "01",
    description:
      "The Group's healthcare areas include medical billing, pharmaceuticals, and laboratory services.",
  },
  {
    name: "Medical Equipment",
    index: "02",
    description:
      "The Group deals in medical equipment, medical devices, and surgical equipment.",
  },
  {
    name: "Chemicals",
    index: "03",
    description:
      "Chemicals are listed among Goodman Group's areas of activity.",
  },
  {
    name: "Automotive",
    index: "04",
    description:
      "Automobiles are listed among Goodman Group's areas of activity; no entity details are published on the current site.",
  },
  {
    name: "Real Estate",
    index: "05",
    description:
      "Real estate is listed among Goodman Group's areas of activity; no entity details are published on the current site.",
  },
] as const;

export function getCompanyBySlug(slug: string) {
  return companies.find((company) => company.slug === slug);
}

export function isCompanyPublished(company: CompanyProfile): boolean {
  return company.publicationStatus === "published";
}
