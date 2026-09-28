export interface GroupLeadership {
  readonly name: string;
  readonly role: string;
  readonly familyBusinessEntry: string;
  readonly moreThan30Years: string;
  readonly manufacturingExperience: string;
  readonly moreThan360Managed: string;
}

export interface ExecutiveContacts {
  readonly leaderName: string;
  readonly phones: readonly string[];
  readonly email: string;
  readonly note: string;
  readonly provenance: string;
}

export interface GoodmanGroupFacts {
  readonly websiteTitle: string;
  readonly message: string;
  readonly description: string;
  readonly operatingPrinciples: readonly string[];
  readonly mission: string;
  readonly sectors: readonly string[];
  readonly businessInterests: readonly string[];
  readonly customerTypes: readonly string[];
  readonly contacts: {
    readonly website: string;
    readonly email: string;
    readonly usContactAddress: string;
  };
  readonly leadership: GroupLeadership;
  readonly executiveContacts: ExecutiveContacts;
}

export const SITE_ORIGIN = "https://goodmangoc.com";

export const goodmanGroup: GoodmanGroupFacts = {
  websiteTitle: "Goodman Group — Seeking for Best",
  message: "Empowering Health, Wellness, Progress",
  description: "A diversified conglomerate operating across healthcare and non-healthcare sectors.",
  operatingPrinciples: [
    "Innovation",
    "Excellence",
    "Growth",
    "Social responsibility",
  ],
  mission:
    "To improve lives through innovative products, services, and solutions while fostering growth, excellence, and social responsibility.",
  sectors: [
    "Medical billing",
    "Pharmaceuticals",
    "Medical equipment",
    "Chemicals",
    "Laboratory operations",
    "Automotive",
    "Real estate",
  ],
  businessInterests: [
    "Pharmaceutical products",
    "Medical devices",
    "Nutraceutical products",
    "Surgical equipment",
    "Medical equipment",
    "Real estate",
    "Restaurants",
    "Automobiles",
  ],
  customerTypes: [
    "Government hospitals",
    "Private hospitals",
    "Retailers",
    "National distributors",
  ],
  contacts: {
    website: "https://goodmangoc.com/",
    email: "goodman@goodmangoc.com",
    usContactAddress: "15650 Grosvenor Lane, Macomb, MI 48044",
  },
  leadership: {
    name: "Syed Talib Hussain Hashmi",
    role: "Chief Executive Officer",
    familyBusinessEntry: "Took responsibility for the family business at age 16",
    moreThan30Years:
      "More than 30 years of administrative, marketing, and pharmaceutical-sector experience",
    manufacturingExperience:
      "34 years of pharmaceutical-manufacturing experience",
    moreThan360Managed:
      "The legacy Group website states that he managed more than 360 office and field team members (historical claim; date not supplied, not a current census)",
  },
  executiveContacts: {
    leaderName: "Syed Talib Hussain Hashmi",
    phones: ["+92 336 777 0770", "+92 311 154 8859"],
    email: "director.goodman786@gmail.com",
    note: "Executive direct contacts from consolidated leadership profile; not a Group switchboard number.",
    provenance:
      "Verified Information/Goodman_Group_Consolidated_Company_Information.md:1083-1088",
  },
} as const;
