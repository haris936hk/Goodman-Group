export type CompanyProfile = {
  slug: string;
  displayName: string;
  legalName: string | null;
  relationship: string | null;
  business: string;
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
};

export const companies = [
  {
    slug: "goodman-laboratories",
    displayName: "Goodman Laboratories",
    legalName: "Goodman Laboratories (Pvt.) Ltd.",
    relationship: null,
    business: "Pharmaceutical manufacturing",
    summary:
      "A pharmaceutical manufacturing company. Syed Talib Hussain Hashmi is its CEO since 2012.",
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
        detail: "Leads the company as CEO.",
      },
    ],
    capabilities: ["Pharmaceutical manufacturing"],
    contacts: [],
  },
  {
    slug: "geron-pharma",
    displayName: "Geron Pharma",
    legalName: "Geron Pharma Pvt. Ltd.",
    relationship: null,
    business: "Pharmaceuticals",
    summary:
      "A pharmaceutical company. Syed Talib Hussain Hashmi is its CEO since 2019.",
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
        detail: "Leads the company as CEO.",
      },
    ],
    capabilities: ["Pharmaceuticals"],
    contacts: [],
  },
  {
    slug: "goodman-medical-equipment",
    displayName: "Goodman Medical Equipment Trading",
    legalName: null,
    relationship: null,
    business: "Medical equipment trading",
    summary:
      "A medical equipment trading operation in the United Arab Emirates and Pakistan. Syed Talib Hussain Hashmi is its director from July 2024.",
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
        detail: "Directs the United Arab Emirates and Pakistan operations.",
      },
    ],
    capabilities: ["Medical equipment trading"],
    contacts: [],
  },
  {
    slug: "wal-green-chemicals",
    displayName: "Wal Green Chemicals",
    legalName: "Wal Green Chemical Pvt. Ltd.",
    relationship: null,
    business: "Chemicals",
    summary:
      "A chemicals business. Syed Talib Hussain Hashmi is its CEO since 2021.",
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
        detail: "Leads the company as CEO.",
      },
    ],
    capabilities: ["Chemicals"],
    contacts: [],
  },
] as const satisfies readonly CompanyProfile[];
export function getCompanyBySlug(slug: string) {
  return companies.find((company) => company.slug === slug);
}
