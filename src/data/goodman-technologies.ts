export type GoodmanTechnologiesProfile = {
  readonly tagline: string;
  readonly headline: string;
  readonly introduction: string;
  readonly director: {
    readonly name: string;
    readonly role: string;
    readonly profession: string;
    readonly portrait: { readonly src: string; readonly width: number; readonly height: number };
    readonly portfolio: string;
    readonly linkedIn: string;
    readonly expertise: readonly {
      readonly id: string;
      readonly category: string;
      readonly title: string;
      readonly stack: string;
      readonly description: string;
    }[];
  };
  readonly metrics: readonly { readonly value: string; readonly label: string }[];
  readonly services: readonly {
    readonly id: string;
    readonly title: string;
    readonly description: string;
    readonly items: readonly string[];
  }[];
  readonly technologyGroups: readonly {
    readonly title: string;
    readonly items: readonly string[];
  }[];
  readonly process: readonly { readonly title: string; readonly description: string }[];
  readonly differentiators: readonly { readonly title: string; readonly description: string }[];
  readonly support: { readonly value: string; readonly label: string };
};

export const goodmanTechnologiesProfile = {
  tagline: "Smart solutions. Stronger future.",
  headline: "From idea to software that ships.",
  introduction:
    "We design and build custom websites, web applications, mobile apps, and desktop software—from the first sketch to production launch.",
  director: {
    name: "Haris Khan",
    role: "Director, Goodman Technologies",
    profession: "Senior Software Engineer",
    portrait: { src: "/assets/technologies/haris-khan.webp", width: 800, height: 800 },
    portfolio: "https://hariskhan-portfolio-chi.vercel.app/",
    linkedIn: "https://www.linkedin.com/in/haris936hk/",
    expertise: [
      {
        id: "engineering",
        category: "Engineering",
        title: "Full-stack engineering",
        stack: "Interfaces · Application logic · Data",
        description: "Connecting the layers of the software stack.",
      },
      {
        id: "intelligence",
        category: "Intelligence",
        title: "Applied AI",
        stack: "AI integration · Intelligent workflows",
        description: "Integrating AI into practical digital workflows.",
      },
      {
        id: "data",
        category: "Data",
        title: "Data & systems",
        stack: "Databases · APIs · Connected systems",
        description: "Working with the systems that connect data.",
      },
      {
        id: "delivery",
        category: "Delivery",
        title: "Software delivery",
        stack: "Development · Testing · Deployment",
        description: "Working across the software lifecycle.",
      },
    ],
  },
  metrics: [
    { value: "3+", label: "Years of experience" },
    { value: "20+", label: "Projects delivered" },
    { value: "12+", label: "Clients served" },
    { value: "25", label: "Technologies in our stack" },
  ],
  services: [
    {
      id: "web",
      title: "Web development",
      description: "Business websites, applications, and connected online experiences.",
      items: [
        "Custom business websites",
        "Web applications & dashboards",
        "E-commerce stores",
        "API design & third-party integrations",
      ],
    },
    {
      id: "mobile",
      title: "Mobile app development",
      description: "Mobile experiences for iOS and Android, from interface to app-store deployment.",
      items: ["iOS & Android apps", "Cross-platform builds", "App-store deployment"],
    },
    {
      id: "desktop",
      title: "Desktop applications",
      description: "Desktop applications built around the way your business works.",
      items: ["Desktop application development"],
    },
    {
      id: "design",
      title: "UI/UX design",
      description: "User-friendly interfaces that bring clarity to your digital products.",
      items: ["UI/UX design"],
    },
    {
      id: "qa",
      title: "Testing & QA",
      description: "Testing and quality assurance throughout development.",
      items: ["Testing & quality assurance"],
    },
    {
      id: "performance",
      title: "Performance optimization",
      description: "Performance optimization for the software you rely on.",
      items: ["Application performance optimization"],
    },
    {
      id: "support",
      title: "Maintenance & support",
      description: "Maintenance and ongoing support beyond launch.",
      items: ["Maintenance & support"],
    },
  ],
  technologyGroups: [
    {
      title: "Languages & foundations",
      items: ["C++", "Python", "Java", "JavaScript", "TypeScript", "HTML", "CSS"],
    },
    {
      title: "Frameworks & runtimes",
      items: ["React.js", "Next.js", "Node.js", "Express.js", "FastAPI", "Tailwind CSS", "AngularJS"],
    },
    {
      title: "Data & persistence",
      items: ["MongoDB", "MySQL", "PostgreSQL", "Supabase", "SQLite", "Prisma"],
    },
    {
      title: "Tools & delivery",
      items: ["Git", "GitHub", "Vercel", "Docker", "GitHub Actions"],
    },
  ],
  process: [
    { title: "Discovery", description: "Understand your needs and define the direction." },
    { title: "Design", description: "Shape the user experience and interface." },
    { title: "Development", description: "Build the application around the agreed requirements." },
    { title: "Testing & QA", description: "Test the application and review its quality." },
    { title: "Deployment", description: "Prepare and release the software to production." },
    { title: "Support", description: "Maintain, support, and improve after launch." },
  ],
  differentiators: [
    { title: "Direct communication", description: "Work directly with the team building your software." },
    { title: "Fixed pricing & timelines", description: "Agree on pricing and delivery timelines before development." },
    { title: "Full code ownership", description: "Keep ownership of the code created for your project." },
    { title: "Dedicated support window", description: "Continue with a dedicated post-launch support window." },
  ],
  support: { value: "30", label: "days of post-launch support" },
} as const satisfies GoodmanTechnologiesProfile;
