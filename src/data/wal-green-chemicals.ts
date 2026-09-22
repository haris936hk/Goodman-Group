export type WalGreenChemicalsIdentity = {
  readonly legalName: string;
  readonly businessType: string;
  readonly positioning: string;
  readonly coreOffer: string;
};

export type WalGreenChemicalsLeadership = {
  readonly name: string;
  readonly role: string;
  readonly tenure: string;
  readonly tenureStartYear: number;
};

export type OrganizationalFunction = {
  readonly name: string;
  readonly responsibilities: readonly string[];
};

export type CustomerCoverage = {
  readonly customerDescription: string;
  readonly centres: readonly string[];
  readonly distributionObjective: string;
};

export type ImportOrigin = {
  readonly origin: string;
  readonly details: string;
};

export type LocalSourcing = {
  readonly hub: string;
  readonly statement: string;
};

export type SourcingNetwork = {
  readonly internationalImports: readonly ImportOrigin[];
  readonly localSourcing: LocalSourcing;
  readonly modelBenefits: readonly string[];
};

export type WalGreenChemicalsProfile = {
  readonly identity: WalGreenChemicalsIdentity;
  readonly mission: string;
  readonly leadership: WalGreenChemicalsLeadership;
  readonly strengths: readonly string[];
  readonly organizationalFunctions: readonly OrganizationalFunction[];
  readonly productPortfolio: readonly string[];
  readonly customerCoverage: CustomerCoverage;
  readonly sourcingNetwork: SourcingNetwork;
  readonly partnershipStatement: string;
};

export const walGreenChemicalsProfile: WalGreenChemicalsProfile = {
  identity: {
    legalName: "Wal Green Chemicals (Pvt.) Ltd.",
    businessType: "Indenter and trader of pharmaceutical raw materials and chemicals.",
    positioning:
      "A Pakistan-based bridge between international manufacturers and the local pharmaceutical, nutraceutical, chemical, and healthcare industries.",
    coreOffer:
      "Pakistan-wide supply of pharmaceutical raw materials, intermediates, active pharmaceutical ingredients, excipients, and specialty chemicals, sourced globally and delivered locally.",
  },
  mission:
    "To give Pakistan’s pharmaceutical and chemical manufacturing sector timely, compliant, and cost-effective access to high-quality raw materials, supported by responsive sales, business-development, finance, logistics, and after-sales service.",
  leadership: {
    name: "Syed Talib Hussain Hashmi",
    role: "Chief Executive Officer",
    tenure: "Since 2021",
    tenureStartYear: 2021,
  },
  strengths: [
    "Indenting and trading of pharmaceutical raw materials and industrial chemicals.",
    "Established international import channels.",
    "Nationwide customer and delivery coverage.",
    "Long-term relationships with manufacturers and local suppliers.",
    "Reliable supply, competitive pricing, and consistent quality.",
    "Dual-channel procurement through international imports and local Karachi sourcing.",
  ],
  organizationalFunctions: [
    {
      name: "Sales and marketing",
      responsibilities: [
        "Manages client relationships.",
        "Conducts market outreach.",
        "Processes orders across Pakistan’s pharmaceutical and chemical sectors.",
      ],
    },
    {
      name: "Business development",
      responsibilities: [
        "Identifies new sourcing partnerships.",
        "Expands the product portfolio.",
        "Evaluates emerging market opportunities.",
      ],
    },
    {
      name: "Administration and finance",
      responsibilities: [
        "Oversees procurement finance.",
        "Manages regulatory documentation.",
        "Handles import processing.",
        "Manages daily administrative operations.",
      ],
    },
    {
      name: "Shipment and after-sales service",
      responsibilities: [
        "Coordinates logistics.",
        "Coordinates customs clearance.",
        "Supports timely delivery.",
        "Provides post-delivery technical support.",
      ],
    },
  ],
  productPortfolio: [
    "Active pharmaceutical ingredients.",
    "Excipients.",
    "Pharmaceutical intermediates.",
    "Specialty and industrial chemicals.",
    "Analgesic raw materials.",
    "Steroids.",
    "Antifungals.",
    "Antithrombotics.",
    "Antibiotics.",
    "Penicillins.",
    "Antacids.",
    "Enzymes.",
    "Anti-rheumatic materials.",
    "Cephalosporins.",
    "Antidiabetic materials.",
    "Vitamins and nutritional actives.",
    "Antianginal and antihypertensive materials.",
    "Herbal extracts.",
    "Nutraceutical ingredients.",
  ],
  customerCoverage: {
    customerDescription:
      "The company supplies manufacturers and traders throughout Pakistan, including the following industrial and commercial centres:",
    centres: [
      "Faisalabad",
      "Hattar",
      "Islamabad",
      "Lahore",
      "Multan",
      "Peshawar",
      "Rawalpindi",
      "Rawat",
    ],
    distributionObjective:
      "Consistent, on-time supply regardless of customer location.",
  },
  sourcingNetwork: {
    internationalImports: [
      {
        origin: "China",
        details:
          "Bulk active pharmaceutical ingredients, intermediates, and cost-competitive volume supply.",
      },
      {
        origin: "India",
        details:
          "Broad-ranging generics, excipients, and finished raw materials.",
      },
      {
        origin: "Europe",
        details:
          "High-purity, regulatory-compliant specialty chemicals.",
      },
    ],
    localSourcing: {
      hub: "Karachi",
      statement:
        "Karachi is the company’s primary local sourcing hub, giving it access to locally manufactured and warehoused pharmaceutical raw materials and chemicals.",
    },
    modelBenefits: [
      "Reduce lead times for urgent orders.",
      "Preserve pricing flexibility when import costs fluctuate.",
      "Maintain backup supply continuity during shipment delays.",
    ],
  },
  partnershipStatement:
    "Wal Green Chemicals states that it looks forward to building long-term supply partnerships with customers.",
} as const;
