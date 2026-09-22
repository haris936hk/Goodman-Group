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
      "A Pakistan-based pharmaceutical manufacturer and national distributor serving government hospitals, private hospitals, retailers, and national distributors, with customers across Afghanistan, Cambodia, Ghana, Tajikistan, and Yemen.",
    logo: "/assets/logos/GoodmanLabLogo.png",
    logoWidth: 575,
    logoHeight: 279,
    accent: "#46b7e8",
    founded: null,
    locations: [
      "Head office: Flat No. 4, Block No. 26, Street No. 100, FGEHF Apartments, Sector G-11, Islamabad, Pakistan",
      "Factory: Plot No. 5, Street S-5, National Industrial Zone, Rawat, Islamabad, Pakistan",
    ],
    leadership: [
      {
        name: "Syed Talib Hussain Hashmi",
        role: "Chief Executive Officer",
        detail: "Chief Executive Officer since 2016.",
      },
    ],
    capabilities: [
      "Pharmaceutical production",
      "Bulk production",
      "Pharmaceutical marketing",
      "Sales",
      "Urgent-order fulfilment",
      "Bulk-order fulfilment",
    ],
    contacts: [
      "director.goodman786@gmail.com",
      "www.goodmangoc.com",
      "+92 51 4455193–195",
      "+92 51 4499156",
    ],
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
    legalName: "Wal Green Chemicals (Pvt.) Ltd.",
    relationship: null,
    business:
      "Indenting and trading of pharmaceutical raw materials and chemicals",
    summary:
      "A Pakistan-based bridge between international manufacturers and local industry, supplying globally sourced pharmaceutical raw materials, intermediates, and chemicals nationwide.",
    logo: "/assets/logos/walgreenLogo.png",
    logoWidth: 528,
    logoHeight: 259,
    accent: "#5fbf92",
    founded: null,
    locations: ["Pakistan"],
    leadership: [
      {
        name: "Syed Talib Hussain Hashmi",
        role: "Chief Executive Officer",
        detail: "Chief Executive Officer since 2021.",
      },
    ],
    capabilities: [
      "Indenting and trading",
      "Pharmaceutical raw materials and chemicals",
      "International import channels",
      "Nationwide customer and delivery coverage",
      "Dual-channel procurement",
    ],
    contacts: [],
  },
] as const satisfies readonly CompanyProfile[];
export function getCompanyBySlug(slug: string) {
  return companies.find((company) => company.slug === slug);
}
