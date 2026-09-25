export type MedicalProduct = {
  readonly name: string;
  readonly description: string;
};

export type MedicalMessaging = {
  readonly label: string;
  readonly value: string;
};

export type BoardMember = {
  readonly name: string;
  readonly sourceName?: string;
};

export type MedicalContact = {
  readonly label: string;
  readonly value: string;
  readonly href: string | null;
};

export type GoodmanMedicalEquipmentProfile = {
  readonly officialLegalName: string;
  readonly websiteHeadline: string;
  readonly alternatePdfLabel: string;
  readonly personalProfileLabel: string;
  readonly established: string;
  readonly base: string;
  readonly pakistanOffice: string;
  readonly founders: readonly string[];
  readonly board: readonly BoardMember[];
  readonly mission: string;
  readonly vision: string;
  readonly values: readonly string[];
  readonly messaging: readonly MedicalMessaging[];
  readonly products: readonly MedicalProduct[];
  readonly strengths: readonly string[];
  readonly customerPromise: readonly string[];
  readonly customers: readonly string[];
  readonly currentMarkets: readonly string[];
  readonly targetMarkets: readonly string[];
  readonly instrumentHandling: readonly string[];
  readonly supplyChain: readonly string[];
  readonly governanceFunctions: readonly string[];
  readonly organizationRoles: readonly string[];
  readonly leadershipSourceNote: string;
  readonly contacts: readonly MedicalContact[];
};

export const goodmanMedicalEquipmentProfile: GoodmanMedicalEquipmentProfile = {
  officialLegalName: "Goodman Medical Equipment Trading LLC",
  websiteHeadline: "Goodman Medical Equipment LLC",
  alternatePdfLabel: "Goodman Medical & Surgical Equipment (Pvt.) Ltd.",
  personalProfileLabel: "Goodman Medical Equipment Trading (Pvt.) Ltd.",
  established: "July 2024",
  base: "Dubai, United Arab Emirates",
  pakistanOffice: "Islamabad, Pakistan",
  founders: [
    "Malik Munir Awan",
    "Syed Talib Hussain Hashmi",
    "Taj Muhammad",
    "Syed Ahmed Ali",
  ],
  board: [
    { name: "Malik Munir Awan" },
    { name: "Syed Talib Hussain Hashmi" },
    { name: "Taj Muhammad" },
    {
      name: "Ahmed Ali",
      sourceName: "Founders section names Syed Ahmed Ali",
    },
  ],
  mission:
    "To provide clients with the highest-quality products and improve patient care across the globe.",
  vision:
    "Through innovation, ingenuity, dedication, and customer focus, to become a diversified healthcare company providing best-in-class products and services that improve patient care and enhance quality of life.",
  values: [
    "Focus on goals and results in every thought and action.",
    "Accept responsibility for assigned tasks and projects.",
    "Build working relationships based on trust and the belief that trusted relationships can grow.",
    "Maintain quality, safety, innovation, reliability, and customer satisfaction.",
  ],
  messaging: [
    {
      label: "Primary headline",
      value: "Delivering Excellence in Healthcare Solutions",
    },
    {
      label: "Website statement",
      value: "Quality Health Solutions",
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
      name: "Medical equipment and devices",
      description:
        "A broad range of advanced medical equipment and medical devices intended to support modern healthcare requirements and improve patient outcomes.",
    },
  ],
  strengths: [
    "Experienced professional team with specialized industry knowledge and commitment.",
    "Brochure-stated five years of industry experience.",
    "Understanding of healthcare-provider requirements.",
    "Product compliance with international quality standards and regulatory requirements.",
    "Timely delivery and dependable service.",
    "Contracted relationships with manufacturers and suppliers.",
    "Quality-control, internal-audit, logistics, sales, marketing, and export-sales functions.",
    "Nationwide supply in Pakistan from major cities to remote areas.",
    "International supply capability operating from Dubai.",
  ],
  customerPromise: [
    "High-quality surgical instruments, medical equipment, and medical devices.",
    "Broad product selection for diverse healthcare needs.",
    "Trusted service for hospitals, clinics, and healthcare professionals.",
    "Customer satisfaction as the highest priority.",
    "Best-in-class products and services intended to improve patient care and quality of life.",
  ],
  customers: [
    "Hospitals",
    "Clinics",
    "Healthcare professionals",
    "Other healthcare facilities and buyers requiring surgical instruments, medical equipment, or medical devices",
  ],
  currentMarkets: [
    "United Arab Emirates, with the company based in Dubai",
    "Pakistan, with nationwide supply from large cities to remote areas",
  ],
  targetMarkets: [
    "Africa",
    "Europe",
    "Japan",
    "United States of America",
  ],
  instrumentHandling: [
    "1. Soiled surgical instruments are collected.",
    "2. Instruments are transported to a STERIS Offsite Reprocessing Center (ORC).",
    "3. Instruments are cleaned and decontaminated according to manufacturer instructions for use, then placed in a washer.",
    "4. A technician inspects and assembles the instruments.",
    "5. Sterilized instruments are cooled and returned to transport carts.",
    "6. Sterilized instruments are transported back to the facility.",
    "7. Instruments are stored in a temperature- and humidity-controlled environment until ready for use.",
  ],
  supplyChain: [
    "1. Production orders are generated for manufacturers and received for processing.",
    "2. Finished items are received into the Goodman Medical Equipment Trading warehouse.",
    "3. Quality-control staff examine product samples for quality assurance.",
    "4. Marketing staff generate customer orders.",
    "5. Items are transported from the port through dispatch for delivery against customer demand.",
  ],
  governanceFunctions: [
    "Legal Department",
    "Quality Control",
    "Internal Audit",
    "Sales and Marketing Head",
    "International Sales Team",
  ],
  organizationRoles: [
    "Managing Director",
    "Operations and Finance",
    "Administration and Accounts",
    "Store In-Charge",
    "Logistics Officers",
    "Quality Control",
    "Sales and Marketing Head",
    "Sales Team",
    "Export Sales Team",
  ],
  leadershipSourceNote:
    "The official website identifies Syed Talib Hussain Hashmi as a founder and board director, supporting the director designation in GOODMAN.pdf. Profile Syed Talib Hussain Hashmi.pdf separately describes him as Chief Executive Officer of Goodman Medical Equipment Trading (Pvt.) Ltd. from 2024; that title may refer to the Pakistan operation or an earlier internal designation, but the supplied sources do not resolve it.",
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
      value: "goodmangoc.com/goodman-medical-equipment",
      href: "https://goodmangoc.com/goodman-medical-equipment",
    },
  ],
} as const;
