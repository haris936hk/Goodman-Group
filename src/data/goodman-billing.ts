export type BillingWorkflowStep = {
  readonly step: number;
  readonly name: string;
  readonly description: string;
};

export type BillingTask = {
  readonly title: string;
  readonly category: "front-desk" | "billing-rcm";
};

export type ServiceCatalogueItem = {
  readonly heading: string;
  readonly items: readonly string[];
};

export type ServiceCategoryGroup = {
  readonly groupName: string;
  readonly description: string;
  readonly services: readonly ServiceCatalogueItem[];
};

export type SpecialtyItem = {
  readonly name: string;
  readonly focus: string;
};

export type SoftwarePlatform = {
  readonly name: string;
  readonly category: string;
};

export type BrochureMetric = {
  readonly metric: string;
  readonly value: string;
  readonly detail: string;
};

export type PerformanceIndicator = {
  readonly indicator: string;
  readonly value: string;
  readonly context: string;
};

export type EvidenceBlock = {
  readonly title: string;
  readonly sourceLabel: string;
  readonly disclaimer: string;
};

export type GoodmanBillingProfile = {
  readonly identity: {
    readonly legalName: string;
    readonly headline: string;
    readonly positioning: string;
    readonly positioningStatement: string;
    readonly objective: string;
    readonly complianceClaim: string;
    readonly groupEndorsement: string;
    readonly contactAddressLabel: string;
  };
  readonly customersServed: readonly string[];
  readonly workflowSteps: readonly BillingWorkflowStep[];
  readonly coreTasks: readonly BillingTask[];
  readonly serviceGroups: readonly ServiceCategoryGroup[];
  readonly specialties: readonly SpecialtyItem[];
  readonly platforms: readonly SoftwarePlatform[];
  readonly platformDisclaimer: string;
  readonly brochureHistory: {
    readonly evidenceBlock: EvidenceBlock;
    readonly metrics: readonly BrochureMetric[];
  };
  readonly specialtyProvenance: {
    readonly evidenceBlock: EvidenceBlock;
    readonly websiteClaim: string;
    readonly listedCount: number;
    readonly contactFormCount: number;
    readonly explanation: string;
  };
  readonly performanceIndicators: {
    readonly evidenceBlock: EvidenceBlock;
    readonly indicators: readonly PerformanceIndicator[];
  };
  readonly differentiators: readonly string[];
};

export const goodmanBillingProfile: GoodmanBillingProfile = {
  identity: {
    legalName: "Goodman Billing (Pvt.) Ltd.",
    headline: "Medical Billing. Redefined.",
    positioning: "Maximizing Revenue, Improving Care",
    positioningStatement: "Your Partner in Better Revenue and Better Healthcare.",
    objective:
      "To optimize revenue-cycle management and streamline medical-billing operations while helping providers improve revenue performance and patient care.",
    complianceClaim:
      "Company-stated HIPAA compliance (self-represented standard, not an external certification).",
    groupEndorsement:
      "Backed by Goodman Laboratories and Goodman Medical Equipment Trading as an operating company within Goodman Group.",
    contactAddressLabel: "Website-listed contact address",
  },

  customersServed: [
    "Individual physicians",
    "Clinics",
    "Surgeons",
    "Nurse practitioners",
    "Multi-provider practices",
    "Other healthcare providers throughout the United States",
  ],

  workflowSteps: [
    {
      step: 1,
      name: "Verify patient eligibility",
      description:
        "Front-desk coverage and insurance benefit verification before patient visits to prevent downstream claim rejections.",
    },
    {
      step: 2,
      name: "Enter charges",
      description:
        "Accurate entry of patient encounters, procedural codes, and diagnostic coding aligned with payer-specific billing rules.",
    },
    {
      step: 3,
      name: "Submit claims",
      description:
        "Electronic submission through clearinghouses with clean-claim scrubbing to accelerate initial adjudication.",
    },
    {
      step: 4,
      name: "Post payments",
      description:
        "Timely reconciliation and posting of insurance electronic remittance advices (ERAs), paper checks, and patient copays.",
    },
    {
      step: 5,
      name: "Manage denials",
      description:
        "Root-cause analysis of clearinghouse and payer rejections, structured appeals, and aggressive accounts-receivable follow-up.",
    },
    {
      step: 6,
      name: "Bill patients",
      description:
        "Transparent balance billing, patient statement generation, and compassionate help-desk inquiries for self-pay balances.",
    },
  ],

  coreTasks: [
    { title: "Prior authorizations", category: "front-desk" },
    { title: "Eligibility and coverage verification", category: "front-desk" },
    { title: "Verification of benefits", category: "front-desk" },
    { title: "Charge entry", category: "billing-rcm" },
    { title: "Payment posting", category: "billing-rcm" },
    { title: "Clearinghouse rejection management", category: "billing-rcm" },
    { title: "Payer rejection management", category: "billing-rcm" },
    { title: "Denial management", category: "billing-rcm" },
    { title: "Accounts-receivable follow-up", category: "billing-rcm" },
    { title: "Appeals management", category: "billing-rcm" },
    { title: "Analysis and reporting", category: "billing-rcm" },
    { title: "Patient billing", category: "billing-rcm" },
    { title: "Patient statements", category: "billing-rcm" },
  ],

  serviceGroups: [
    {
      groupName: "Front Desk & Coding",
      description:
        "Pre-encounter eligibility checks, authorizations, and compliant medical coding to secure reimbursement before claims are generated.",
      services: [
        {
          heading: "Front-desk support",
          items: [
            "Prior authorizations",
            "Eligibility and coverage verification",
            "Verification of benefits",
          ],
        },
        {
          heading: "Medical coding",
          items: [
            "Removal of coding inaccuracies",
            "Improved reimbursement rates",
            "Comprehensive claims-coding coverage",
          ],
        },
        {
          heading: "Prior authorization",
          items: [
            "Website claim of a 75% reduction in patient delays",
            "Streamlined prior-authorization requests",
            "Reduced administrative burden",
          ],
        },
      ],
    },
    {
      groupName: "Claims & Revenue Cycle",
      description:
        "End-to-end medical billing, electronic claim submission, 24/7 revenue management, denial appeals, and active AR recovery.",
      services: [
        {
          heading: "Medical billing",
          items: [
            "Accurate, secure, and fast billing",
            "Practice-specific solutions",
            "Streamlined payment processing",
          ],
        },
        {
          heading: "Physician billing",
          items: [
            "Financial-efficiency support for physicians",
            "Accurate and timely claim submission",
            "Revenue maximization",
          ],
        },
        {
          heading: "Claim submission",
          items: [
            "Faster payment",
            "Accurate claim submission",
            "Reduced rejection rates",
          ],
        },
        {
          heading: "Revenue-cycle-management services",
          items: [
            "Website claim of a 98% clean-claim rate",
            "Faster cash flow through specialist support",
            "24/7 revenue-cycle management",
          ],
        },
        {
          heading: "Denial management",
          items: [
            "Recovery of rightfully payable denied claims",
            "Denial analysis and appeals",
            "Free accounts-receivable analysis as an entry service",
          ],
        },
        {
          heading: "Medical accounts receivable",
          items: [
            "Reduction of accounts-receivable days and improvement of cash flow",
            "Accounts-receivable management strategies",
            "Recovery of lost revenue",
          ],
        },
      ],
    },
    {
      groupName: "Credentialing & Enrolments",
      description:
        "Comprehensive provider and facility credentialing across commercial insurers, government programs, DME, nursing, and telehealth.",
      services: [
        {
          heading: "Credentialing and enrolments",
          items: [
            "Credentialing and enrolment with government and commercial payers",
            "Electronic data interchange and electronic funds transfer setup and agreements",
            "Payer recredentialing and provider-profile revalidation",
            "Demographic updates",
          ],
        },
        {
          heading: "Medical credentialing",
          items: [
            "Credentialing with commercial insurers",
            "Access to non-commercial payer networks",
            "Specialist credentialing support",
          ],
        },
        {
          heading: "Durable medical equipment credentialing",
          items: [
            "Credentialing for CPAP equipment, diabetic strips, and braces",
            "Prevention of denials caused by incomplete credentialing files",
            "Management of credentialing requirements",
          ],
        },
        {
          heading: "Nurse-practitioner credentialing",
          items: [
            "Reduction of approval delays",
            "Faster payer-panel access",
            "Earlier billing eligibility",
          ],
        },
        {
          heading: "Telemedicine credentialing",
          items: [
            "Accelerated telehealth-provider credentialing",
            "Management of CAQH, payer, and licensing requirements",
            "Faster approval for virtual-care delivery",
          ],
        },
        {
          heading: "Behavioral-health credentialing",
          items: [
            "Faster approval for mental-health providers",
            "Partnership with major insurance networks",
            "Support for practice growth",
          ],
        },
      ],
    },
    {
      groupName: "Patient Support",
      description:
        "Professional patient inquiry resolution, coordination of benefits, and transparent statement review.",
      services: [
        {
          heading: "Patient help desk",
          items: [
            "Patient-billing review",
            "Inbound and outbound patient calls",
            "Coordination-of-benefits updates with payers",
            "Itemized billing emails",
          ],
        },
      ],
    },
    {
      groupName: "Audit & Underpayment Recovery",
      description:
        "Pre-audit compliance inspections, contract discrepancy analyses, and recovery of underpaid clinical claims.",
      services: [
        {
          heading: "Audit services",
          items: [
            "Preparation for payer audits",
            "Identification and correction of billing vulnerabilities",
            "Protection against recoupments and penalties",
          ],
        },
        {
          heading: "Medical underpayment recovery",
          items: [
            "Recovery of underpaid claims",
            "Analysis of payment discrepancies",
            "Maximization of rightful reimbursement",
          ],
        },
      ],
    },
  ],

  specialties: [
    {
      name: "Orthopedics",
      focus: "Billing intended to maximize profit, improve reimbursements, and support patient satisfaction.",
    },
    {
      name: "Cardiology",
      focus: "Accuracy- and compliance-focused billing intended to reduce denials and accelerate payment.",
    },
    {
      name: "Pediatrics",
      focus: "Revenue-cycle support tailored to pediatric practices.",
    },
    {
      name: "Anesthesia",
      focus: "Billing intended to increase revenue and reduce denials for anesthesiologists.",
    },
    {
      name: "Family Medicine",
      focus: "End-to-end billing support for high-volume family and general practices.",
    },
    {
      name: "Oral and Maxillofacial Surgery",
      focus: "Tailored billing and health-record-management support for maxillofacial surgeons.",
    },
    {
      name: "General Practice",
      focus: "Customized billing and coding intended to accelerate reimbursement.",
    },
    {
      name: "Chiropractic",
      focus: "Tailored billing intended to improve revenue and patient satisfaction.",
    },
    {
      name: "Dermatology",
      focus: "Procedure-focused billing intended to reduce denials and improve reimbursement.",
    },
    {
      name: "Podiatry",
      focus: "Billing intended to increase profitability and reduce denials for podiatrists.",
    },
    {
      name: "Endocrinology",
      focus: "Coding intended to reduce denials and improve claim-submission rates.",
    },
    {
      name: "Osteopathic Medicine",
      focus: "Billing intended to improve profitability and reduce claim rejection.",
    },
    {
      name: "Gastroenterology",
      focus: "Revenue-cycle optimization for digestive-health specialists.",
    },
    {
      name: "Neurology",
      focus: "Support for complex diagnostic and treatment claims.",
    },
    {
      name: "Ophthalmology",
      focus: "Revenue-focused billing for eye-care professionals.",
    },
    {
      name: "Physical Therapy",
      focus: "Billing intended to reduce administrative burden and increase collections.",
    },
    {
      name: "Psychiatry",
      focus: "Revenue-cycle services for mental-health providers.",
    },
    {
      name: "Radiology",
      focus: "Accurate coding and timely reimbursement support.",
    },
    {
      name: "Urology",
      focus: "Billing intended to maximize revenue and minimize claim denials.",
    },
    {
      name: "Oncology",
      focus: "Revenue-cycle optimization for cancer-care specialists.",
    },
    {
      name: "Pulmonology",
      focus: "Claims-processing support for respiratory care.",
    },
    {
      name: "Geriatrics",
      focus: "Revenue-cycle optimization for elderly-care services.",
    },
    {
      name: "Nephrology",
      focus: "Revenue-cycle optimization for kidney-care services.",
    },
    {
      name: "Allergy and Immunology",
      focus: "Claims management for allergy and immunology specialists.",
    },
    {
      name: "Otolaryngology (ENT)",
      focus: "Reimbursement support for ear, nose, and throat specialists.",
    },
    {
      name: "Obstetrics and Gynecology",
      focus: "Revenue-cycle support for women’s healthcare providers.",
    },
    {
      name: "Emergency Medicine",
      focus: "Billing for fast-paced emergency-department environments.",
    },
    {
      name: "Pain Management",
      focus: "Claims support for chronic-pain treatment.",
    },
    {
      name: "Sports Medicine",
      focus: "Billing for athletic-injury and performance specialists.",
    },
    {
      name: "Infectious Disease",
      focus: "Claims support for complex treatment protocols.",
    },
    {
      name: "Pathology",
      focus: "Billing for laboratory and diagnostic specialists.",
    },
    {
      name: "Hematology",
      focus: "Claims support for blood-disorder treatment.",
    },
    {
      name: "Vascular Surgery",
      focus: "Billing for circulatory-system specialists.",
    },
    {
      name: "Plastic Surgery",
      focus: "Revenue support for cosmetic and reconstructive procedures.",
    },
    {
      name: "Bariatric Surgery",
      focus: "Billing for weight-loss surgery specialists.",
    },
    {
      name: "Sleep Medicine",
      focus: "Claims support for sleep-disorder treatment.",
    },
    {
      name: "Hospice and Palliative Care",
      focus: "Billing for end-of-life care.",
    },
    {
      name: "Wound Care",
      focus: "Claims support for complex wound treatment.",
    },
    {
      name: "Neonatology",
      focus: "Billing for newborn intensive-care services.",
    },
    {
      name: "Occupational Medicine",
      focus: "Billing for workplace-health specialists.",
    },
  ],

  platforms: [
    { name: "Epic", category: "Electronic health records and practice management" },
    { name: "athenahealth", category: "Cloud-based medical solutions" },
    { name: "ADP", category: "Human-resources and payroll management" },
    { name: "NextGen", category: "Medical billing and electronic health records" },
    { name: "ECW / eClinicalWorks", category: "Electronic health records and practice management" },
    { name: "Office Ally", category: "Healthcare software and hospital solutions" },
    { name: "TherapyNotes", category: "Practice management" },
    { name: "Raintree", category: "Rehabilitation and physical-therapy software" },
    { name: "AdvancedMD", category: "Practice management, patient engagement, and electronic health records" },
    { name: "TriZetto", category: "Medical billing and electronic health records" },
    { name: "Change Healthcare", category: "Medical billing and payment processing" },
    { name: "CollaborateMD", category: "Medical-billing software" },
  ],

  platformDisclaimer:
    "Platform compatibility indicates workflow familiarity and software operational support; it does not establish a commercial partnership, endorsement, or formal integration agreement. Goodman Billing also states support for custom systems and other commercial platforms.",

  brochureHistory: {
    evidenceBlock: {
      title: "Brochure Historical Track Record",
      sourceLabel: "Source: Company promotional brochure",
      disclaimer:
        "Source-published figures with reporting period not provided. Unaudited historical marketing claims.",
    },
    metrics: [
      {
        metric: "Industry Experience",
        value: "7+ years",
        detail: "More than seven years of medical billing industry experience represented in company brochure.",
      },
      {
        metric: "Specialties Managed",
        value: "20+",
        detail: "More than 20 medical specialties managed according to historical brochure data.",
      },
      {
        metric: "Practices Served",
        value: "15+",
        detail: "More than 15 medical practices served across provider networks.",
      },
      {
        metric: "Provider Revenue Generated",
        value: "> USD 2M",
        detail: "More than USD 2 million in provider revenue generated through billing management.",
      },
    ],
  },

  specialtyProvenance: {
    evidenceBlock: {
      title: "Specialty Coverage Provenance",
      sourceLabel: "Source: Official company website audit",
      disclaimer:
        "Website source distinction: The website claims support for more than 75 specialties, while its dedicated specialties page visibly displays 40 specialty profiles and its contact form lists 43 service options. These counts reflect distinct source representations rather than conflicting verified operational audits.",
    },
    websiteClaim: "More than 75 specialties across the United States",
    listedCount: 40,
    contactFormCount: 43,
    explanation:
      "The brochure’s older 20-plus specialty record is retained alongside the website’s 75-plus specialty marketing claim and its 40 listed specialty cards. Each is presented with its distinct source attribution without conflation.",
  },

  performanceIndicators: {
    evidenceBlock: {
      title: "Published Operational Targets",
      sourceLabel: "Source: Company profile performance indicators",
      disclaimer:
        "Source-published figure with reporting period not provided. Operational targets and promotional benchmarks; not an independent outcome audit.",
    },
    indicators: [
      {
        indicator: "Clean-Claim Rate",
        value: "≥ 98%",
        context: "Clean-claim submission rate on first filing",
      },
      {
        indicator: "First-Pass Resolution",
        value: "≥ 98%",
        context: "Claims resolved on initial payer adjudication",
      },
      {
        indicator: "Denial Rate",
        value: "< 5%",
        context: "Targeted overall claim denial rate",
      },
      {
        indicator: "Accounts-Receivable Days",
        value: "< 30 days",
        context: "Target duration for pending revenue collection",
      },
      {
        indicator: "Charge-Entry Accuracy",
        value: "≥ 99%",
        context: "Procedural and diagnostic coding entry precision",
      },
      {
        indicator: "Payment-Posting Accuracy",
        value: "≥ 99%",
        context: "ERA and patient payment posting reconciliation accuracy",
      },
      {
        indicator: "Rejection Rate",
        value: "< 1%",
        context: "Clearinghouse and frontend payer rejection rate",
      },
      {
        indicator: "Timely Filing",
        value: "100%",
        context: "Adherence to statutory and payer filing deadlines",
      },
    ],
  },

  differentiators: [
    "Certified and experienced billing specialists dedicated to practice revenue optimization.",
    "Customized solutions tailored to each clinical practice's size, specialty, and payer mix.",
    "Regular reports and analytics delivering transparent visibility into financial performance.",
    "Commitment to maximizing revenue while reducing provider administrative burden.",
    "Optimization of every stage of the billing lifecycle, from eligibility verification to final collection.",
  ],
} as const;
