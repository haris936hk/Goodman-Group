export type CompanyEntity = {
  legalName: string;
  jurisdiction: string;
  leadership: readonly {
    name: string;
    role: string;
    detail: string;
  }[];
  description: string | null;
  messaging?: readonly {
    label: string;
    value: string;
  }[];
  products: readonly {
    name: string;
    description: string;
  }[];
  strengths: readonly string[];
  customerPromise?: readonly string[];
  customers: readonly string[];
  domesticMarkets: readonly string[];
  targetMarkets: readonly string[];
  contacts: readonly {
    label: string;
    value: string;
    href: string | null;
  }[];
  sourceNote?: string;
};

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
  entities?: readonly CompanyEntity[];
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
    legalName: "Geron Pharma (Pvt.) Ltd.",
    relationship: null,
    business: "Pharmaceutical business",
    summary:
      "Geron Pharma (Pvt.) Ltd. is a pharmaceutical business led by Chief Executive Officer Syed Talib Hussain Hashmi, who has served as CEO since 2019.",
    logo: "/assets/logos/geronlogo.png",
    logoWidth: 684,
    logoHeight: 357,
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
    legalName: null,
    relationship: null,
    business: "Medical equipment trading",
    summary:
      "Goodman Medical Equipment Trading brings together three separately documented records: Goodman Medical & Surgical Equipment (Pvt.) Ltd. in Pakistan, Goodman Medical Equipment Trading LLC in the United Arab Emirates, and Goodman Medical Equipment Trading (Pvt.) Ltd. in Pakistan.",
    logo: "/assets/logos/GG3.png",
    logoWidth: 2450,
    logoHeight: 1961,
    accent: "#4dc0e8",
    founded: null,
    locations: ["United Arab Emirates", "Pakistan"],
    leadership: [
      {
        name: "Syed Talib Hussain Hashmi",
        role: "Leadership documented by entity",
        detail:
          "Leadership and tenure are recorded separately for each legal entity below.",
      },
    ],
    capabilities: [
      "Healthcare equipment, surgical instruments, and medical devices",
      "Medical equipment trading",
    ],
    contacts: [],
    entities: [
      {
        legalName: "Goodman Medical & Surgical Equipment (Pvt.) Ltd.",
        jurisdiction: "Pakistan",
        leadership: [],
        description:
          "A healthcare supplier focused on product quality, safety, innovation, reliable service, and broad national access.",
        messaging: [
          {
            label: "Primary headline",
            value: "Delivering Excellence in Healthcare Solutions",
          },
          {
            label: "Tagline",
            value: "Partnering for a Healthier Tomorrow",
          },
          {
            label: "Supporting message",
            value: "Better Health, Better Life",
          },
          {
            label: "Trust statement",
            value: "Trust, Quality, Commitment",
          },
        ],
        products: [
          {
            name: "Surgical instruments",
            description:
              "A complete range of surgical instruments designed for precision, durability, and high quality.",
          },
          {
            name: "Medical devices",
            description:
              "A broad range of advanced medical devices intended to support modern healthcare needs and improve patient outcomes.",
          },
        ],
        strengths: [
          "Premium quality",
          "International standards",
          "Competitive prices",
          "After-sales support",
          "Quality-assured products",
          "Reliable partnership",
          "Innovative solutions",
          "Nationwide supply",
          "Experienced professional team with specialized industry knowledge and commitment",
          "Five years of industry experience",
          "Understanding of healthcare-provider requirements",
          "Reliable healthcare solutions",
          "Product compliance with international quality standards and regulatory requirements",
          "Supply to healthcare facilities throughout Pakistan, including large cities and remote areas",
          "Timely delivery and dependable service",
        ],
        customerPromise: [
          "High-quality surgical instruments and medical devices",
          "Broad product selection for varied healthcare needs",
          "Trusted service for hospitals, clinics, and healthcare professionals",
          "Customer satisfaction as the highest priority",
        ],
        customers: ["Hospitals", "Clinics", "Healthcare professionals"],
        domesticMarkets: ["Nationwide coverage across Pakistan"],
        targetMarkets: ["Africa", "Europe", "Japan", "United States of America"],
        contacts: [
          {
            label: "Office",
            value: "Islamabad, Pakistan",
            href: null,
          },
          {
            label: "Telephone",
            value: "+92 336 777 0770",
            href: "tel:+923367770770",
          },
          {
            label: "Email",
            value: "afgoodmangoc@gmail.com",
            href: "mailto:afgoodmangoc@gmail.com",
          },
          {
            label: "Website",
            value: "www.goodmangoc.com",
            href: "https://www.goodmangoc.com",
          },
        ],
      },
      {
        legalName: "Goodman Medical Equipment Trading LLC",
        jurisdiction: "United Arab Emirates",
        leadership: [
          {
            name: "Syed Talib Hussain Hashmi",
            role: "Director",
            detail: "Directorship effective July 2024.",
          },
        ],
        description:
          "The supplied documents do not provide a separate product catalogue, address, customer list, or operational description for this company.",
        products: [],
        strengths: [],
        customers: [],
        domesticMarkets: [],
        targetMarkets: [],
        contacts: [],
      },
      {
        legalName: "Goodman Medical Equipment Trading (Pvt.) Ltd.",
        jurisdiction: "Pakistan",
        leadership: [
          {
            name: "Syed Talib Hussain Hashmi",
            role: "Chief Executive Officer",
            detail: "Chief Executive Officer since 2024.",
          },
        ],
        description:
          "The supplied documents do not provide a separate product catalogue, address, customer list, or operational description for this company.",
        products: [],
        strengths: [],
        customers: [],
        domesticMarkets: [],
        targetMarkets: [],
        contacts: [],
        sourceNote:
          "A supplied personal business profile identifies Syed Talib Hussain Hashmi as Chief Executive Officer from 2024, while the Goodman Laboratories company profile identifies him as a Director of the Pakistan-based operation from July 2024. The supplied PDFs do not establish whether these are concurrent roles, a role change, or a documentation error.",
      },
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
export function getCompanyBySlug(slug: string): CompanyProfile | undefined {
  return companies.find((company) => company.slug === slug);
}
