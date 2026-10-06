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
  readonly icon: string;
  readonly items: readonly string[];
};

export type SpecialtyItem = {
  readonly name: string;
  readonly icon: string;
  readonly focus: string;
};

export type SoftwarePlatform = {
  readonly name: string;
  readonly category: string;
  readonly logo: {
    readonly src: string;
    readonly width: number;
    readonly height: number;
  };
};

export type BillingBenefit = {
  readonly heading: string;
  readonly icon: string;
  readonly description: string;
};

export type BillingDifferentiator = {
  readonly heading: string;
  readonly description: string;
};

export type BillingTestimonial = {
  readonly name: string;
  readonly context: string;
  readonly report: string;
};

export type GoodmanBillingProfile = {
  readonly identity: {
    readonly legalName: string;
    readonly headline: string;
    readonly positioning: string;
    readonly positioningStatement: string;
    readonly objective: string;
    readonly complianceClaim: string;
    readonly contactAddressLabel: string;
    readonly introduction: string;
    readonly servicesIntroduction: string;
    readonly servicesDetail: string;
    readonly specialtiesIntroduction: string;
    readonly commitment: string;
  };
  readonly customersServed: readonly string[];
  readonly workflowSteps: readonly BillingWorkflowStep[];
  readonly coreTasks: readonly BillingTask[];
  readonly services: readonly ServiceCatalogueItem[];
  readonly specialties: readonly SpecialtyItem[];
  readonly platforms: readonly SoftwarePlatform[];
  readonly benefits: readonly BillingBenefit[];
  readonly differentiators: readonly BillingDifferentiator[];
  readonly testimonials: readonly BillingTestimonial[];
};

export const goodmanBillingProfile: GoodmanBillingProfile = {
  identity: {
    legalName: "Goodman Billing (Pvt.) Ltd.",
    headline: "Medical Billing. Redefined.",
    positioning: "Maximizing Revenue, Improving Care",
    positioningStatement: "Your Partner in Better Revenue and Better Healthcare.",
    objective:
      "To optimize revenue-cycle management and streamline medical-billing operations while helping providers improve revenue performance and patient care.",
    complianceClaim: "HIPAA-compliant medical-billing and revenue-cycle services",
    contactAddressLabel: "US contact address",
    introduction:
      "At Goodman Billing, we don’t just process claims — we elevate your entire revenue cycle. With precision, discretion, and unmatched compliance expertise, we ensure healthcare providers are reimbursed faster, cleaner, and without the noise. Experience billing as it should be — seamless, secure, and sophisticated.",
    servicesIntroduction:
      "We support healthcare organizations by transforming clinical encounters into accurate, compliant insurance claims—helping providers focus on patient care while improving financial outcomes.",
    servicesDetail:
      "Our services extend beyond claim submission to include denial management, accounts receivable follow-up, and detailed financial reporting, ensuring a structured and efficient revenue cycle for practices of all sizes.",
    specialtiesIntroduction:
      "Our Specialty-focused Medical Billing serves over 75 specialties across the nation, regardless of your practice size and type. We provide tailored solutions that ensure accurate billing, faster reimbursements, and compliance with healthcare regulations.",
    commitment:
      "At Goodman Billing, we're dedicated to maximizing your revenue while minimizing your administrative burden. Our comprehensive approach ensures that every aspect of your billing process is optimized for success.",
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

  services: [
    {
      heading: "Front Desk Support",
      icon: "/assets/billing/services/original-telemedicine-credentialing-services-iconss.svg",
      items: [
        "Prior Authorizations",
        "Eligibility and Coverage verification",
        "Verification of Benefits",
      ],
    },
    {
      heading: "Medical Coding",
      icon: "/assets/billing/services/original-medical-coding-ser.svg",
      items: [
        "Remove coding inaccuracies",
        "Boost reimbursement rates",
        "Comprehensive claims coding coverage",
      ],
    },
    {
      heading: "Medical Billing",
      icon: "/assets/billing/services/original-medical-bill-ser.svg",
      items: [
        "Accurate, secure, and fast billing",
        "Tailored solutions for your practice",
        "Streamlined payment processing",
      ],
    },
    {
      heading: "Patient Help Desk",
      icon: "/assets/billing/services/original-behavioral-health-icon.svg",
      items: [
        "Patient billing review",
        "Inbound & outbound patient calls",
        "COB updates with payers",
        "Itemized billing emails",
      ],
    },
    {
      heading: "Credentialing and Enrollments",
      icon: "/assets/billing/services/original-statements.svg",
      items: [
        "Credentialing and Enrollment with all Government and commercial payers",
        "EDI (electronic data interchange) / EFT (electronic funds transfer) setups and agreements",
        "Payer Re-credentialing and Revalidation of Provider Profile",
        "Demographics Update",
      ],
    },
    {
      heading: "Denial Management",
      icon: "/assets/billing/services/original-denial-management.svg",
      items: [
        "Recover rightfully denied claims",
        "Expert denial analysis and appeals",
        "Free A/R analysis to get started",
      ],
    },
    {
      heading: "Medical Accounts Receivable",
      icon: "/assets/billing/services/original-statements.svg",
      items: [
        "Reduce A/R days and improve cash flow",
        "Proven A/R management strategies",
        "Recover lost revenue efficiently",
      ],
    },
    {
      heading: "Durable Medical Equipment Credentialing",
      icon: "/assets/billing/services/original-durable-medical-equipment-credentialing.svg",
      items: [
        "Get credentialed to sell CPAPs, diabetic strips, and braces",
        "Avoid thousands in denied claims due to incomplete files",
        "Expert handling of all credentialing requirements",
      ],
    },
    {
      heading: "Nurse Practitioner Credentialing",
      icon: "/assets/billing/services/original-np-credentialing-services.svg",
      items: [
        "Cut approval delays and start billing sooner",
        "Secure payer panel access quickly",
        "Stop losing time and income with slow approvals",
      ],
    },
    {
      heading: "Telemedicine Credentialing",
      icon: "/assets/billing/services/original-telemedicine-credentialing-services-iconss.svg",
      items: [
        "Fast-track telehealth provider credentialing",
        "CAQH, payers, and licensing all managed",
        "Get approved and start virtual care faster",
      ],
    },
    {
      heading: "Audit Services",
      icon: "/assets/billing/services/original-audit-services.svg",
      items: [
        "Prepare for payer audits before they happen",
        "Identify billing vulnerabilities and fix them",
        "Protect against recoupments and penalties",
      ],
    },
    {
      heading: "Medical Underpayment Recovery",
      icon: "/assets/billing/services/original-underpaymentcard.svg",
      items: [
        "Recover millions in underpaid claims",
        "Expert analysis of payment discrepancies",
        "Maximize your rightful reimbursements",
      ],
    },
    {
      heading: "RCM Services",
      icon: "/assets/billing/services/original-revenue-cycle-management-services.svg",
      items: [
        "Achieve 98% clean claim rates",
        "Faster cash flow with expert support",
        "24/7 revenue cycle management",
      ],
    },
    {
      heading: "Behavioral Health Credentialing",
      icon: "/assets/billing/services/original-behavioral-health-icon.svg",
      items: [
        "Accelerate approval process for mental health providers",
        "Partner with major insurance networks",
        "Start growing your practice faster",
      ],
    },
    {
      heading: "Prior Authorization",
      icon: "/assets/billing/services/original-prior-authorization-services.svg",
      items: [
        "Cut patient delays by 75%",
        "Streamline prior auth requests",
        "Reduce administrative burden on staff",
      ],
    },
    {
      heading: "Physician Billing",
      icon: "/assets/billing/services/original-physician-billing-icon.svg",
      items: [
        "Peak financial efficiency for physicians",
        "Accurate and timely claim submission",
        "Maximize revenue with expert billing",
      ],
    },
    {
      heading: "Claim Submission",
      icon: "/assets/billing/services/original-statements.svg",
      items: [
        "Get paid faster with HMS services",
        "Accurate claim submission every time",
        "Reduce rejection rates significantly",
      ],
    },
    {
      heading: "Medical Credentialing",
      icon: "/assets/billing/services/original-medical-credentialing-sers.svg",
      items: [
        "Get credentialed with commercial insurances",
        "Access non-commercial payer networks",
        "Expert credentialing support",
      ],
    },
  ],

  specialties: [
    {
      name: "Orthopedics",
      icon: "/assets/billing/specialties/original-SP-1-150x150.png",
      focus: "Orthopedics billing services that maximize profits and enhance patient satisfaction.",
    },
    {
      name: "Cardiology",
      icon: "/assets/billing/specialties/original-SP-2-1-150x150.png",
      focus: "Cardiology billing service that boost revenue and reduce denials for fast reimbursements.",
    },
    {
      name: "Pediatrics",
      icon: "/assets/billing/specialties/original-SP-3-150x150.png",
      focus: "Tailored billing solutions for pediatric practices that want to upsize their revenue cycles.",
    },
    {
      name: "Anesthesia",
      icon: "/assets/billing/specialties/original-SP-4-150x150.png",
      focus: "Billing services for anesthesiologists who want to hike up their profits and roll back denials.",
    },
    {
      name: "Family Medicine",
      icon: "/assets/billing/specialties/original-SP-5-150x150.png",
      focus: "Family medicine billing services for general practitioners looking to improve their revenue cycle.",
    },
    {
      name: "Oral and Maxillofacial Surgery",
      icon: "/assets/billing/specialties/original-SP-6-150x150.png",
      focus: "Tailor billing solutions for Maxillofacial surgeons with health records management software.",
    },
    {
      name: "General Practice",
      icon: "/assets/billing/specialties/original-SP-8-150x150.png",
      focus: "Customized medical billing and coding services for general practices that want speedy rewards.",
    },
    {
      name: "Chiropractor",
      icon: "/assets/billing/specialties/original-SP-9-150x150.png",
      focus: "Tailor billing solutions for Chiropractors who want better profits and happier patients.",
    },
    {
      name: "Dermatology",
      icon: "/assets/billing/specialties/original-SP-10-150x150.png",
      focus: "Dermatology billing services that boost revenue and reduce denials with fast reimbursements.",
    },
    {
      name: "Podiatry",
      icon: "/assets/billing/specialties/original-SP-11-150x150.png",
      focus: "Billing services for podiatrists (DPMs) who want to hike up their profits and roll back denials.",
    },
    {
      name: "Endocrinology",
      icon: "/assets/billing/specialties/original-SP-12-150x150.png",
      focus: "Endocrinology coding services that reduce denials and boost claim submission rates.",
    },
    {
      name: "Osteopathic",
      icon: "/assets/billing/specialties/original-SP-13-150x150.png",
      focus: "Osteopathic billing services that maximize profits and reduce claim rejections.",
    },
    {
      name: "Gastroenterology",
      icon: "/assets/billing/specialties/original-SP-14-150x150.png",
      focus: "Gastroenterology billing services for digestive health specialists seeking revenue optimization.",
    },
    {
      name: "Neurology",
      icon: "/assets/billing/specialties/original-SP-15-150x150.png",
      focus: "Neurology billing services that streamline claims and maximize reimbursements.",
    },
    {
      name: "Ophthalmology",
      icon: "/assets/billing/specialties/original-SP-16-150x150.png",
      focus: "Ophthalmology billing solutions for eye care professionals focused on revenue growth.",
    },
    {
      name: "Physical Therapy",
      icon: "/assets/billing/specialties/original-SP-17-150x150.png",
      focus: "Physical therapy billing services that reduce administrative burden and increase collections.",
    },
    {
      name: "Psychiatry",
      icon: "/assets/billing/specialties/original-SP-18-150x150.png",
      focus: "Psychiatry billing services for mental health providers seeking efficient revenue cycles.",
    },
    {
      name: "Radiology",
      icon: "/assets/billing/specialties/original-SP-19-150x150.png",
      focus: "Radiology billing services that ensure accurate coding and timely reimbursements.",
    },
    {
      name: "Urology",
      icon: "/assets/billing/specialties/original-SP-20-150x150.png",
      focus: "Urology billing services that maximize revenue and minimize claim denials.",
    },
    {
      name: "Oncology",
      icon: "/assets/billing/specialties/original-SP-21-150x150.png",
      focus: "Oncology billing services for cancer care specialists focused on revenue optimization.",
    },
    {
      name: "Pulmonology",
      icon: "/assets/billing/specialties/original-SP-22-150x150.png",
      focus: "Pulmonology billing services that streamline respiratory care claims processing.",
    },
    {
      name: "Geriatrics",
      icon: "/assets/billing/specialties/original-SP-39-150x150.png",
      focus: "Geriatrics billing services that optimize elderly care revenue cycles.",
    },
    {
      name: "Nephrology",
      icon: "/assets/billing/specialties/original-SP-24-150x150.png",
      focus: "Nephrology billing services that optimize kidney care revenue cycles.",
    },
    {
      name: "Allergy and Immunology",
      icon: "/assets/billing/specialties/original-SP-25-150x150.png",
      focus: "Allergy billing services for immunology specialists seeking efficient claims management.",
    },
    {
      name: "Otolaryngology (ENT)",
      icon: "/assets/billing/specialties/original-SP-26-150x150.png",
      focus: "ENT billing services that maximize reimbursements for ear, nose, and throat specialists.",
    },
    {
      name: "Obstetrics and Gynecology",
      icon: "/assets/billing/specialties/original-SP-27-150x150.png",
      focus: "OB/GYN billing services that optimize women's health care revenue cycles.",
    },
    {
      name: "Emergency Medicine",
      icon: "/assets/billing/specialties/original-SP-28-150x150.png",
      focus: "Emergency medicine billing services for fast-paced ER environments.",
    },
    {
      name: "Pain Management",
      icon: "/assets/billing/specialties/original-SP-29-150x150.png",
      focus: "Pain management billing services that streamline chronic pain treatment claims.",
    },
    {
      name: "Sports Medicine",
      icon: "/assets/billing/specialties/original-SP-30-150x150.png",
      focus: "Sports medicine billing services for athletic injury and performance specialists.",
    },
    {
      name: "Infectious Disease",
      icon: "/assets/billing/specialties/original-SP-31-150x150.png",
      focus: "Infectious disease billing services that optimize claims for complex treatment protocols.",
    },
    {
      name: "Pathology",
      icon: "/assets/billing/specialties/original-SP-32-150x150.png",
      focus: "Pathology billing services for laboratory and diagnostic specialists.",
    },
    {
      name: "Hematology",
      icon: "/assets/billing/specialties/original-SP-33-150x150.png",
      focus: "Hematology billing services that optimize blood disorder treatment claims.",
    },
    {
      name: "Vascular Surgery",
      icon: "/assets/billing/specialties/original-SP-34-150x150.png",
      focus: "Vascular surgery billing services for circulatory system specialists.",
    },
    {
      name: "Plastic Surgery",
      icon: "/assets/billing/specialties/original-SP-35-150x150.png",
      focus: "Plastic surgery billing services that maximize cosmetic and reconstructive surgery revenue.",
    },
    {
      name: "Bariatric Surgery",
      icon: "/assets/billing/specialties/original-SP-36-150x150.png",
      focus: "Bariatric surgery billing services for weight loss surgery specialists.",
    },
    {
      name: "Sleep Medicine",
      icon: "/assets/billing/specialties/original-SP-37-150x150.png",
      focus: "Sleep medicine billing services that optimize sleep disorder treatment claims.",
    },
    {
      name: "Hospice and Palliative Care",
      icon: "/assets/billing/specialties/original-SP-38-150x150.png",
      focus: "Hospice billing services for end-of-life care specialists.",
    },
    {
      name: "Wound Care",
      icon: "/assets/billing/specialties/original-SP-42-150x150.png",
      focus: "Wound care billing services that optimize complex wound treatment claims.",
    },
    {
      name: "Neonatology",
      icon: "/assets/billing/specialties/original-SP-40-150x150.png",
      focus: "Neonatology billing services for newborn intensive care specialists.",
    },
    {
      name: "Occupational Medicine",
      icon: "/assets/billing/specialties/original-SP-41-150x150.png",
      focus: "Occupational medicine billing services for workplace health specialists.",
    },
  ],

  platforms: [
    { name: "Epic", category: "EHR & Practice Management", logo: { src: "/assets/billing/platforms/epic.png", width: 106, height: 41 } },
    { name: "athenahealth", category: "Cloud-Based Medical Solutions", logo: { src: "/assets/billing/platforms/athena.png", width: 2994, height: 717 } },
    { name: "ADP", category: "HR & Payroll Management", logo: { src: "/assets/billing/platforms/adp.svg", width: 300, height: 137 } },
    { name: "NextGen", category: "Medical Billing & EHR", logo: { src: "/assets/billing/platforms/nextgen.svg", width: 300, height: 122 } },
    { name: "ECW", category: "EHR & PM solutions", logo: { src: "/assets/billing/platforms/ecw.svg", width: 300, height: 38 } },
    { name: "Office Ally", category: "Healthcare Software & Solutions For Hospitals", logo: { src: "/assets/billing/platforms/officeally.png", width: 527, height: 95 } },
    { name: "TherapyNotes", category: "Practice management", logo: { src: "/assets/billing/platforms/therapyNotes.webp", width: 920, height: 230 } },
    { name: "Raintree", category: "Rehabilitation and Physical therapy software", logo: { src: "/assets/billing/platforms/raintree.png", width: 2048, height: 631 } },
    { name: "Advance MD", category: "Practice Management, Patient Engagement, and EHR", logo: { src: "/assets/billing/platforms/advancedmd.svg", width: 300, height: 61 } },
    { name: "Trizeetto", category: "Medical Billing & EHR", logo: { src: "/assets/billing/platforms/trizetto.png", width: 600, height: 271 } },
    { name: "Change Healthcare", category: "Medical Billing & Payment Processing", logo: { src: "/assets/billing/platforms/changehealthcare.png", width: 282, height: 123 } },
    { name: "Collaborate MD", category: "Medical billing solution", logo: { src: "/assets/billing/platforms/collaboratemd.webp", width: 2048, height: 673 } },
  ],

  benefits: [
    {
      heading: "Accurate Claims",
      icon: "/assets/billing/benefits/clipboard-check.svg",
      description: "Minimize denials and rejections with expert claim handling.",
    },
    {
      heading: "Faster Reimbursements",
      icon: "/assets/billing/benefits/speedometer2.svg",
      description: "Speed up the payment process with optimized workflows.",
    },
    {
      heading: "HIPAA Compliant",
      icon: "/assets/billing/benefits/shield-lock.svg",
      description: "Ensure your patient data is handled with complete security and compliance.",
    },
  ],

  differentiators: [
    {
      heading: "Experienced Team",
      description:
        "Our team of certified billing specialists has years of experience in medical billing.",
    },
    {
      heading: "Customized Solutions",
      description:
        "We tailor our services to meet the specific needs of your practice.",
    },
    {
      heading: "Transparent Reporting",
      description:
        "Regular reports and analytics to keep you informed about your billing performance.",
    },
  ],

  testimonials: [
    {
      name: "Dr. Sarah Johnson",
      context: "Family Practice, New York",
      report:
        "Goodman Billing has transformed our revenue cycle management. Their team is responsive, knowledgeable, and has significantly improved our collections rate.",
    },
    {
      name: "Michael Chen",
      context: "Practice Manager, California",
      report:
        "Since partnering with Goodman Billing, our denial rate has decreased by 60% and collections increased by 25%. Their expertise is unmatched.",
    },
    {
      name: "Dr. Emily Rodriguez",
      context: "Pediatrics, Texas",
      report:
        "Professional, efficient, and always available. Goodman Billing made billing a seamless process for our practice.",
    },
  ],
} as const;
