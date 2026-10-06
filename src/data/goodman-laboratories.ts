export type ProductEntry = {
  readonly name: string;
  readonly details: string;
};

export type ProductCategory = {
  readonly name: string;
  readonly products: readonly ProductEntry[];
};


export type Certificate = {
  readonly standard: string;
  readonly managementSystem: string;
  readonly certificateNumber: string;
};

export type ProductionSection = {
  readonly name: string;
  readonly description: string;
};

export type InternationalActivityReport = {
  readonly market: string;
  readonly status: string;
};

export type GoodmanLaboratoriesProfile = {
  readonly identity: {
    readonly legalName: string;
    readonly tagline: string;
    readonly founded: string;
    readonly industry: string;
    readonly purpose: string;
    readonly capabilities: readonly string[];
    readonly stakeholderRelationships: string;
  };
  readonly mission: string;
  readonly vision: string;
  readonly values: readonly string[];
  readonly leadership: {
    readonly name: string;
    readonly role: string;
    readonly biography: string;
    readonly expertise: readonly string[];

    readonly manufacturingExperience: string;
    readonly totalExperience: string;
    readonly familyBusinessStartAge: number;
  };
  readonly productionSections: readonly ProductionSection[];
  readonly websiteFunctions: readonly string[];
  readonly governance: readonly string[];
  readonly organizationalFunctions: readonly string[];
  readonly socialResponsibility: readonly string[];
  readonly facilitiesAndOperations: readonly string[];
  readonly customers: readonly string[];
  readonly geographicPresence: {
    readonly nationalCoverage: readonly string[];
    readonly internationalCustomerMarkets: readonly string[];
  };
  readonly internationalActivity: readonly InternationalActivityReport[];
  readonly sustainabilityAndGrowth: {
    readonly foundationSummary: string;

    readonly expansionObjective: string;
  };
  readonly therapeuticAreas: readonly string[];
  readonly productCategories: readonly ProductCategory[];
  readonly certifications: {
    readonly issuer: string;
    readonly companyName: string;
    readonly registrationNumber: string;
    readonly commonScope: string;
    readonly certifiedAddress: string;
    readonly certificates: readonly Certificate[];
    readonly commonDates: {
      readonly registrationDate: string;
      readonly issueDate: string;
      readonly expiryDate: string;
      readonly recertificationDueDate: string;
    };
  };
  readonly contactAndLocations: {
    readonly headOffice: string;
    readonly factory: string;
    readonly factoryPhoneRange: string;
    readonly factoryPhonePrimary: string;
    readonly factoryPhoneAlternate: string;
    readonly factoryPhoneAlternateDisplay: string;
    readonly email: string;
    readonly website: string;
    readonly websiteUrl: string;
    readonly manufacturingLicenceNumber: string;
  };
};

export const goodmanLaboratoriesProfile: GoodmanLaboratoriesProfile = {
  identity: {
    legalName: "Goodman Laboratories (Pvt.) Ltd.",
    tagline: "Seeking for the Best",
    founded: "2008",
    industry:
      "Pharmaceutical manufacturing, marketing, sales, supply, distribution, export, wholesale, retail, and trading.",
    purpose:
      "To serve humanity by making affordable and approachable healthcare solutions available in Pakistan and internationally.",
    capabilities: [
      "Pharmaceutical production",
      "Bulk production",
      "Pharmaceutical marketing",
      "Sales",
      "Urgent-order fulfilment",
      "Bulk-order fulfilment",
    ],
    stakeholderRelationships:
      "The company reports strong working relationships with the Drug Regulatory Authority of Pakistan (DRAP) and other relevant departments, supporting regulatory work and future exports.",
  },
  mission: "To provide affordable pharmaceutical products across the globe.",
  vision:
    "To become a global pharmaceutical-industry participant and give ordinary people access to advanced, life-saving medicines in Pakistan and every international market the company can reach.",
  values: [
    "Equal access to healthcare for humanity.",
    "Continuous organizational and geographic expansion.",
    "Teamwork as the means of achieving the company’s ultimate goals.",
    "Quality, affordability, accessibility, and dependable service.",
  ],
  leadership: {
    name: "Syed Talib Hussain Hashmi",
    role: "Chief Executive Officer",
    biography:
      "Syed Talib Hussain Hashmi is a pharmaceutical entrepreneur and industry executive with more than 30 years of industry experience, including approximately 34 years in pharmaceutical manufacturing. He took responsibility for his family business at age 16.",
    expertise: [
      "Pharmaceutical manufacturing and operations",
      "Administration, marketing, and sales",
      "Business strategy and investment planning",
      "Regulatory compliance and quality assurance",
      "Healthcare-product development",
      "Distribution-network expansion",
      "Leadership and corporate management",
    ],
    manufacturingExperience: "Approximately 34 years in pharmaceutical manufacturing",
    totalExperience: "More than 30 years of industry and entrepreneurial experience",
    familyBusinessStartAge: 16,
  },
  productionSections: [
    {
      name: "Tablet",
      description: "High-quality tablets with precise dosing and effectiveness.",
    },
    {
      name: "Capsule",
      description: "Capsules designed for targeted delivery.",
    },
    {
      name: "Cephalosporin",
      description: "Cephalosporin products for different infections.",
    },
    {
      name: "Dry Suspension",
      description: "Reliable dry-suspension dosage forms.",
    },
    {
      name: "Liquid Syrup",
      description: "Liquid syrups designed for administration and absorption.",
    },
  ],
  websiteFunctions: [
    "Production",
    "Sales and Marketing",
    "Operations and Finance",
    "Quality Control (testing and record keeping)",
  ],
  governance: [
    "Board of Directors",
    "Chief Executive Officer and primary shareholder",
    "Partners and secondary shareholders",
    "Operations and Finance",
    "Legal Department",
    "Quality Control",
    "Internal Audit",
    "Plant Manager",
  ],
  organizationalFunctions: [
    "Chief Executive Officer",
    "Operations and Finance",
    "Administration and Accounts",
    "Sales and Marketing",
    "Sales Team",
    "Export Sales Team",
    "Quality Control",
    "Plant Manager",
    "Pharmacist",
    "Production Staff",
    "Store In-Charge",
    "Logistics Officers",
  ],
  socialResponsibility: [
    "Provides medicines, life-saving drugs, and medical equipment free of charge to government charitable hospitals.",
    "Provides medicines required for patients during emergencies.",
    "Seeks to maintain low medicine prices and bids minimum prices in tenders to reach vulnerable populations.",
    "Organizes free medical camps in rural areas with limited healthcare facilities.",
    "Provides free medicine, health-and-hygiene awareness, and clean drinking water through rural medical camps.",
  ],
  facilitiesAndOperations: [
    "Supplies products at competitive prices in both minimum and maximum quantities according to customer requirements.",
    "Handles urgent and bulk requirements.",
    "Manufactures through qualified professionals using suitable-quality raw materials and international quality standards.",
    "Supplies and exports quality-assured pharmaceutical products.",
    "Makes products available at market-competitive prices within agreed timeframes.",
    "Supplies, distributes, exports, wholesales, retails, and trades pharmaceutical products, surgical products, and allied medical products.",
    "Maintains dedicated pharmaceutical-production and pharmaceutical marketing and sales teams.",
  ],
  customers: [
    "Government hospitals",
    "Private hospitals",
    "Retailers",
    "National distributors",
  ],
  geographicPresence: {
    nationalCoverage: [
      "Islamabad",
      "Punjab",
      "Sindh",
      "Balochistan",
      "Khyber Pakhtunkhwa",
      "Gilgit-Baltistan",
      "Azad Kashmir",
    ],
    internationalCustomerMarkets: [
      "Afghanistan",
      "Cambodia",
      "Ghana",
      "Tajikistan",
      "Yemen",
    ],
  },
  internationalActivity: [
    {
      market: "Afghanistan",
      status:
        "Pharmaceutical products are supplied through local stakeholders and distributors.",
    },
    {
      market: "Cambodia",
      status:
        "Expansion began after local demand generated supply inquiries.",
    },
    {
      market: "Ghana",
      status:
        "An exclusive distributorship agreement for pharmaceutical products was signed in Ghana in 2024 for a five-year term.",
    },
    {
      market: "Tajikistan",
      status:
        "A demand-based supply chain was developed in response to limited basic health facilities in several areas, with local stakeholders supporting development of healthcare units.",
    },
    {
      market: "Yemen",
      status:
        "A contract or memorandum of understanding was signed for bulk production, with supply stated to begin after Yemeni partners complete local legal requirements.",
    },
  ],
  sustainabilityAndGrowth: {
    foundationSummary:
      "The company presents its long operating history, experienced leadership, national reach, and international business expansion as the foundation of its sustainability.",
    expansionObjective:
      "Continued geographic expansion reflects its stated intention to grow into a larger global pharmaceutical business.",
  },
  therapeuticAreas: [
    "Analgesics",
    "Anti-acne medicines",
    "Anti-allergic medicines",
    "Anthelmintics",
    "Anti-asthmatic medicines",
    "Antibacterials and antibiotics",
    "Antidepressants",
    "Antidiabetics",
    "Antiemetics",
    "Antiepileptics",
    "Antifungals",
    "Anti-gout medicines",
    "Antihypertensives",
    "Antimalarials",
    "Antipsychotics",
    "Antivirals",
    "Central nervous system stimulants",
    "Immunosuppressants",
    "Muscle relaxants",
    "Proton-pump inhibitors",
    "Vitamins and nutritional products",
  ],
  productCategories: [
    {
      name: "Neurology, psychiatry, and central nervous system",
      products: [
        {
          name: "Gavatin",
          details:
            "levetiracetam; 250 mg and 500 mg tablets; 10- and 30-tablet packs; registrations 107090 and 107091.",
        },
        {
          name: "Teparo",
          details:
            "topiramate; 25 mg tablets in a 60-tablet pack and 200 mg tablets in 30- and 60-tablet packs; registrations 107094 and 108140.",
        },
        {
          name: "Gehlin",
          details:
            "pregabalin; 75 mg and 100 mg capsules; 14-capsule packs; registrations 108143 and 108144.",
        },
        {
          name: "Modafa",
          details:
            "modafinil; 100 mg and 200 mg tablets; 20-tablet packs; registrations 107092 and 107093.",
        },
        {
          name: "Citacip",
          details:
            "citalopram; 10 mg and 20 mg tablets; 14-tablet packs; registrations 56182 and 65489.",
        },
        {
          name: "Pineflux",
          details:
            "olanzapine 3 mg with fluoxetine HCl 25 mg capsules; 14- and 30-capsule packs; registration 107105.",
        },
        {
          name: "Luoxo Plus",
          details:
            "olanzapine with fluoxetine HCl capsules: 6 mg/25 mg in 14- and 30-capsule packs and 12 mg/25 mg in 10-, 20-, and 30-capsule packs; registrations 107106 and 107194.",
        },
        {
          name: "Sulpitac",
          details:
            "amisulpride 100 mg tablets; 10-tablet pack; registration 108126.",
        },
        {
          name: "Roporak",
          details:
            "ropinirole HCl 0.25 mg tablets; 20-tablet pack; registration 108132.",
        },
        {
          name: "Estla",
          details:
            "escitalopram; 10 mg and 20 mg tablets; 14- and 28-tablet packs; registrations 60173 and 107089.",
        },
        {
          name: "Sulpir",
          details:
            "levosulpiride; 25 mg and 50 mg tablets; 20-tablet packs; registrations 66551 and 66552.",
        },
        {
          name: "Eprobe",
          details:
            "levosulpiride; 25 mg and 50 mg tablets; 20-tablet packs; registration 66552.",
        },
        {
          name: "Tiaquin",
          details:
            "quetiapine fumarate 300 mg tablets; 10-tablet pack; registration 108133.",
        },
        {
          name: "Gertra",
          details:
            "sertraline HCl; 50 mg tablets in a 30-tablet pack and 100 mg tablets in a 20-tablet pack; registrations 108138 and 108139.",
        },
        {
          name: "Olense",
          details:
            "olanzapine citrate 10 mg tablets; 10-tablet pack; registration 108142.",
        },
        {
          name: "Luox",
          details:
            "fluoxetine 20 mg capsules; 30-capsule pack; registration 52549.",
        },
        {
          name: "GToline",
          details:
            "citicoline sodium equivalent to citicoline 1,000 mg/4 ml; IV/IM injection; single-unit pack; registration 103631.",
        },
      ],
    },
    {
      name: "Cardiovascular products",
      products: [
        {
          name: "Amlogood",
          details:
            "amlodipine/valsartan tablets: 5 mg/80 mg, 5 mg/160 mg, and 10 mg/320 mg; 14- and 28-tablet packs; registrations 107095, 107096, and 107097.",
        },
        {
          name: "Tazloc",
          details:
            "telmisartan 20 mg tablets; 10-tablet pack; registration 108127.",
        },
        {
          name: "Larstan",
          details:
            "losartan potassium; 25 mg and 50 mg tablets; 20-tablet packs; registrations 108129 and 108130.",
        },
      ],
    },
    {
      name: "Antimalarial products",
      products: [
        {
          name: "Armer",
          details:
            "artemether 20 mg/lumefantrine 120 mg tablets; 16-tablet pack; registration 52542.",
        },
        {
          name: "Armer DS",
          details:
            "artemether 40 mg/lumefantrine 240 mg tablets; 8-tablet pack; registration 59410.",
        },
        {
          name: "Armer DS Dispersible",
          details:
            "artemether 40 mg/lumefantrine 240 mg dispersible tablets; 8-tablet pack; registration 65273.",
        },
        {
          name: "Armer Dry Suspension",
          details: "artemether/lumefantrine; 60 ml; registration 72941.",
        },
      ],
    },
    {
      name: "Antibiotics and antibacterials",
      products: [
        {
          name: "Azithro",
          details:
            "azithromycin tablets: 250 mg and 500 mg, each in a 6-tablet pack; dry suspension: 200 mg/5 ml, 15 ml; registrations 65270, 107067, and 72173.",
        },
        {
          name: "AziGood",
          details:
            "azithromycin 250 mg capsules; 10-capsule pack; registration 52550.",
        },
        {
          name: "Ciprogood",
          details:
            "ciprofloxacin tablets: 250 mg and 500 mg, each in a 10-tablet pack; dry suspension/syrup: 125 mg/5 ml, 60 ml; registrations 52537, 52538, and 72940.",
        },
        {
          name: "Sifrop",
          details:
            "ciprofloxacin tablets; 250 mg and 500 mg; 10-tablet packs.",
        },
        {
          name: "Levogood",
          details:
            "levofloxacin; 250 mg and 500 mg tablets; 10-tablet packs; registrations 52540 and 52535.",
        },
        {
          name: "Gemirex",
          details:
            "gemifloxacin 320 mg tablets; 7-tablet pack; registration 68572.",
        },
        {
          name: "Klargo",
          details:
            "clarithromycin; 250 mg and 500 mg tablets in 10-tablet packs; 125 mg/5 ml dry suspension in a 60 ml bottle; registrations 62352, 60867, and 72174.",
        },
        {
          name: "Moxirex",
          details:
            "moxifloxacin 400 mg tablets; 5-tablet pack; registration 60866.",
        },
        {
          name: "Zolidin",
          details:
            "linezolid; 400 mg and 600 mg tablets in 12-tablet packs; 100 mg/5 ml suspension in 60 ml and 120 ml bottles; registrations 107098, 107099, and 107100.",
        },
      ],
    },
    {
      name: "Cephalosporins and other injectable antibiotics",
      products: [
        {
          name: "Goodcef",
          details:
            "cephradine; 250 mg/6 capsules and 500 mg/12 capsules; 125 mg and 250 mg dry suspensions in 60 ml bottles; registrations 46106, 46107, 46121, and 46122.",
        },
        {
          name: "Rafix",
          details:
            "cefixime; 200 mg capsules in a 10-capsule pack; 400 mg capsules in a 5-capsule pack; 100 mg/5 ml and 200 mg/5 ml dry suspensions in 30 ml bottles, in with-water and without-water presentations; registrations 46108, 46109, 46123, and 46124.",
        },
        {
          name: "Hidrox",
          details:
            "cefadroxil; 500 mg capsules in a 12-capsule pack and 250 mg dry suspension in a 60 ml bottle; registrations 46114 and 46117.",
        },
        {
          name: "Salar",
          details:
            "cefoperazone/sulbactam; 1 g and 2 g IV/IM injections; single-unit packs; registrations 56673 and 56674.",
        },
        {
          name: "Martazone",
          details:
            "ceftriaxone; 250 mg IV, 500 mg IV, 500 mg IM, and 1 g IV injections; single-unit packs; registrations 56677, 56678, 103633, and 56679.",
        },
        {
          name: "Penemera",
          details:
            "meropenem with sodium carbonate; 500 mg and 1 g IV injections; single-unit packs; registrations 103634 and 103635.",
        },
      ],
    },
    {
      name: "Allergy and respiratory products",
      products: [
        {
          name: "Besta",
          details:
            "ebastine 10 mg tablets; 10-tablet pack; registration 56811.",
        },
        {
          name: "Desgood",
          details:
            "desloratadine 5 mg tablets; 10-tablet pack; registration 52536.",
        },
        {
          name: "Seasonex",
          details:
            "levocetirizine dihydrochloride 5 mg tablets; 30-tablet pack; registration 56184.",
        },
        {
          name: "Zingo",
          details:
            "cetirizine 10 mg tablets; 30-tablet pack; registration 56188.",
        },
        {
          name: "Clear 10",
          details:
            "montelukast sodium 10 mg tablets; 14-tablet pack; registration 56181.",
        },
      ],
    },
    {
      name: "Gastrointestinal products",
      products: [
        {
          name: "Mepsal",
          details:
            "omeprazole; 20 mg and 40 mg tablets; 14-tablet packs; registrations 56192 and 60875.",
        },
        {
          name: "Hamzome",
          details:
            "omeprazole; 20 mg and 40 mg capsules; 14-capsule packs.",
        },
        {
          name: "Omigood",
          details:
            "omeprazole pellets; 20 mg and 40 mg capsules; 14-capsule packs; registrations 52588 and 52587.",
        },
        {
          name: "Rogit",
          details:
            "pantoprazole 40 mg tablets; 14-tablet pack; registration 56179.",
        },
        {
          name: "Ropent",
          details:
            "pantoprazole sodium 40 mg capsules; 14-capsule pack; registration 66288.",
        },
        {
          name: "Somicid",
          details:
            "esomeprazole; 20 mg and 40 mg tablets; 14-tablet packs; registrations 56189 and 56180.",
        },
        {
          name: "Esogood",
          details:
            "esomeprazole pellets; 20 mg and 40 mg capsules; 14-capsule packs; registrations 52590 and 52589.",
        },
        {
          name: "Lapis",
          details:
            "lansoprazole 30 mg capsules; 14-capsule pack; registration 52591.",
        },
        {
          name: "Itopri",
          details:
            "itopride hydrochloride 50 mg tablets; 10-tablet pack; registration 65268.",
        },
        {
          name: "Domset",
          details:
            "domperidone 1 mg/ml suspension; 120 ml bottle; registration 72938.",
        },
      ],
    },
    {
      name: "Pain, inflammation, musculoskeletal, and muscle-relaxant products",
      products: [
        {
          name: "Goodgesic",
          details:
            "paracetamol 450 mg with orphenadrine citrate; tablets; 100-tablet pack; registration 66554.",
        },
        {
          name: "Goodgesic Plus",
          details:
            "paracetamol 325 mg with tramadol HCl 37.5 mg tablets; 10-tablet pack; registration 107101.",
        },
        {
          name: "Sang SR",
          details:
            "diclofenac sodium 100 mg sustained-release tablets; 20-tablet pack; registration 66557.",
        },
        {
          name: "Diclonic DR",
          details:
            "diclofenac sodium 75 mg capsules; 20-capsule pack; registration 65390.",
        },
        {
          name: "Lifdic",
          details:
            "diclofenac sodium 50 mg capsules; 100-capsule pack; registration 52586.",
        },
        {
          name: "Aeconec",
          details: "aceclofenac 100 mg tablets; 30-tablet pack.",
        },
        {
          name: "Florip",
          details:
            "flurbiprofen 100 mg tablets; 30-tablet pack; registration 56177.",
        },
        {
          name: "Peerox",
          details:
            "piroxicam beta-cyclodextrin 20 mg tablets; 20-tablet pack; registration 52539.",
        },
        {
          name: "Loxigood",
          details:
            "meloxicam; 7.5 mg and 15 mg tablets; 20-tablet packs; registrations 52533 and 52541.",
        },
        {
          name: "Xibto",
          details:
            "etoricoxib 60 mg tablets; 10-tablet pack; registration 108131.",
        },
        {
          name: "Noximol",
          details:
            "lornoxicam; 4 mg and 8 mg tablets; 10-tablet packs; registrations 108136 and 108137.",
        },
        {
          name: "Tizigood",
          details:
            "tizanidine; 2 mg and 4 mg tablets; 10-tablet packs; registrations 52543 and 65486.",
        },
        {
          name: "Bretafin",
          details:
            "baclofen 10 mg tablets; 30-tablet pack; registration 108141.",
        },
        {
          name: "K-Tor",
          details:
            "ketorolac tromethamine 30 mg/ml injection; five 1 ml ampoules; registration 103630.",
        },
      ],
    },
    {
      name: "Antifungal and dermatological products",
      products: [
        {
          name: "Consal",
          details:
            "fluconazole 150 mg capsule; single-capsule pack; registration 56186.",
        },
        {
          name: "Trucon",
          details:
            "itraconazole BP 100 mg capsules; 4-capsule pack; registration 65276.",
        },
        {
          name: "Tenicine",
          details:
            "terbinafine HCl; 125 mg and 250 mg tablets; 10-tablet packs; registrations 108134 and 108135.",
        },
        {
          name: "Isolit",
          details:
            "isotretinoin 20 mg capsules; listed in 10- and 30-capsule presentations; registration 69812.",
        },
      ],
    },
    {
      name: "Metabolic, bone-health, nutritional, and haematological products",
      products: [
        {
          name: "SitaGood DS",
          details:
            "sitagliptin, as phosphate monohydrate, 50 mg with metformin HCl 1,000 mg tablets; 10- and 14-tablet packs; registrations 107102 and 107103.",
        },
        {
          name: "Febuxogood",
          details:
            "febuxostat; 40 mg and 80 mg tablets; 20-tablet packs; registrations 107103 and 107104.",
        },
        {
          name: "Endro Plus",
          details:
            "alendronate sodium with cholecalciferol; 4-tablet pack; registration 66620.",
        },
        {
          name: "Comibal",
          details:
            "mecobalamin 0.5 mg tablets; 20-tablet pack; registration 56813.",
        },
        {
          name: "Malgro",
          details:
            "iron hydroxide polymaltose complex with folic acid; 30-tablet pack; registration 59409.",
        },
        {
          name: "Osak",
          details:
            "iron polysaccharide complex 150 mg capsules; 30-capsule pack; registration 66621.",
        },
        {
          name: "Iro Malt",
          details:
            "iron polymaltose complex with folic acid; 20 mg presentation; 40-capsule pack; registration 66559.",
        },
        {
          name: "Alfagood",
          details:
            "alfacalcidol 0.5 mcg tablets; 20-tablet pack; registration 52545.",
        },
        {
          name: "Ivcroc",
          details:
            "intravenous elemental iron 100 mg/5 ml; five 5 ml units; registration 103632.",
        },
      ],
    },
    {
      name: "Antiviral, antiparasitic, antiemetic, and other products",
      products: [
        {
          name: "Entec",
          details:
            "entecavir 0.5 mg tablets; 30-tablet pack; registration 66556.",
        },
        {
          name: "Odiver",
          details:
            "ivermectin; 3 mg tablets in a 20-tablet pack and 6 mg tablets in a 10-tablet pack; registrations 65266 and 65267.",
        },
        {
          name: "Ondigo",
          details: "ondansetron 4 mg/5 ml syrup; 50 ml bottle.",
        },
        {
          name: "Osume",
          details: "letrozole 2.5 mg tablets; 30-tablet pack.",
        },
        {
          name: "Lodamal",
          details:
            "leflunomide 20 mg tablets; 30-tablet pack; registration 108128.",
        },
      ],
    },
  ],
  certifications: {
    issuer: "American International Standards LLC",
    companyName: "Goodman Laboratories (Pvt.) Ltd.",
    registrationNumber: "24PL10324",
    commonScope: "Manufacturing of Pharmaceutical Products",
    certifiedAddress:
      "Plot No. 5, Street S-5, Rawat Industrial Zone, Islamabad, Pakistan",
    commonDates: {
      registrationDate: "February 1, 2024",
      issueDate: "February 1, 2024",
      expiryDate: "January 31, 2027",
      recertificationDueDate: "January 31, 2027",
    },
    certificates: [
      {
        standard: "ISO 9001:2015",
        managementSystem: "Quality Management System",
        certificateNumber: "AISGM210632Q",
      },
      {
        standard: "ISO 14001:2015",
        managementSystem: "Environment Management System",
        certificateNumber: "AISGM210633E",
      },
      {
        standard: "ISO 45001:2018",
        managementSystem:
          "Occupational Health and Safety Management System",
        certificateNumber: "AISGM210634O",
      },
    ],
  },
  contactAndLocations: {
    headOffice:
      "Flat No. 4, Block No. 26, Street No. 100, FGEHF Apartments, Sector G-11, Islamabad, Pakistan",
    factory:
      "Plot No. 5, Street S-5, National Industrial Zone, Rawat, Islamabad, Pakistan",
    factoryPhoneRange: "+92 51 4455193–195",
    factoryPhonePrimary: "+92514455193",
    factoryPhoneAlternate: "+92514499156",
    factoryPhoneAlternateDisplay: "+92 51 4499156",
    email: "director.goodman786@gmail.com",
    website: "www.goodmangoc.com",
    websiteUrl: "https://www.goodmangoc.com",
    manufacturingLicenceNumber: "000613",
  },
} as const;
