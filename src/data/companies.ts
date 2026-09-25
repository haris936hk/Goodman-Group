
export type CompanyLogo = {
  src: string;
  width: number;
  height: number;
};

export type CompanyProfile = {
  slug: string;
  displayName: string;
  legalName: string | null;
  relationship: string | null;
  business: string;
  summary: string;
  logo: CompanyLogo | null;
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
      "A Pakistan-based pharmaceutical manufacturer and national distributor serving government hospitals, private hospitals, retailers, and national distributors, with source-cited international activity across Afghanistan, Cambodia, Ghana, Tajikistan, and Yemen at different stages.",
    logo: {
      src: "/assets/logos/GoodmanLabLogo.png",
      width: 575,
      height: 279,
    },
    accent: "#46b7e8",
    founded: "2008",
    locations: [
      "Head office: Flat No. 4, Block No. 26, Street No. 100, FGEHF Apartments, Sector G-11, Islamabad, Pakistan",
      "Factory: Plot No. 5, Street S-5, National Industrial Zone, Rawat, Islamabad, Pakistan",
    ],
    leadership: [
      {
        name: "Syed Talib Hussain Hashmi",
        role: "Chief Executive Officer",
        detail:
          "GOODMAN.pdf reports 2012; Profile Syed Talib Hussain Hashmi.pdf reports 2016; start year unresolved.",
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
    legalName: "Geron Pharma (Pvt.) Ltd.",
    relationship: null,
    business: "Pharmaceutical business",
    summary:
      "Geron Pharma (Pvt.) Ltd. is a pharmaceutical business led by Chief Executive Officer Syed Talib Hussain Hashmi, who has served as CEO since 2019.",
    logo: {
      src: "/assets/logos/geronlogo.png",
      width: 684,
      height: 357,
    },
    accent: "#58c6f0",
    founded: null,
    locations: [],
    leadership: [
      {
        name: "Syed Talib Hussain Hashmi",
        role: "Chief Executive Officer",
        detail: "Chief Executive Officer since 2019.",
      },
    ],
    capabilities: ["Pharmaceutical business"],
    contacts: [],
  },
  {
    slug: "goodman-medical-equipment",
    displayName: "Goodman Medical Equipment Trading",
    legalName: "Goodman Medical Equipment Trading LLC",
    relationship: null,
    business: "Medical equipment trading",
    summary:
      "A Dubai-based healthcare supplier with a Pakistan supply presence, specializing in surgical products, medical equipment, and medical devices.",
    logo: {
      src: "/assets/logos/GG3.png",
      width: 2450,
      height: 1961,
    },
    accent: "#4dc0e8",
    founded: "July 2024",
    locations: ["Dubai, United Arab Emirates", "Islamabad, Pakistan"],
    leadership: [
      {
        name: "Syed Talib Hussain Hashmi",
        role: "Founder and Director",
        detail:
          "Founder and board director effective July 2024; also cited as CEO in a personal profile.",
      },
    ],
    capabilities: [
      "Surgical products",
      "Medical equipment",
      "Medical devices",
    ],
    contacts: [
      "+92 336 777 0770",
      "afgoodmangoc@gmail.com",
      "goodmangoc.com/goodman-medical-equipment",
    ],
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
    logo: {
      src: "/assets/logos/walgreenLogo.png",
      width: 528,
      height: 259,
    },
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
  {
    slug: "goodman-billing",
    displayName: "Goodman Billing",
    legalName: "Goodman Billing (Pvt.) Ltd.",
    relationship: null,
    business: "Medical billing and revenue-cycle management",
    summary:
      "A medical billing and revenue-cycle management company serving healthcare providers, physicians, clinics, and multi-provider practices across the United States.",
    logo: null,
    accent: "#22d3ee",
    founded: null,
    locations: [
      "15650 Grosvenor Lane, Macomb, Michigan 48044, United States",
    ],
    leadership: [
      {
        name: "Syed Talib Hussain Hashmi",
        role: "Chief Executive Officer",
        detail: "Chief Executive Officer.",
      },
    ],
    capabilities: [
      "Front-desk support",
      "Claim submission and medical billing",
      "Denial and accounts-receivable management",
      "Credentialing and enrolments",
      "Patient billing",
      "Audit and underpayment support",
    ],
    contacts: ["goodman@goodmangoc.com"],
  },
] as const satisfies readonly CompanyProfile[];
export function getCompanyBySlug(slug: string): CompanyProfile | undefined {
  return companies.find((company) => company.slug === slug);
}
