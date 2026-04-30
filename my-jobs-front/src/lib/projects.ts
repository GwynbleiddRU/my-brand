export type ProjectCategory = "Web" | "AI" | "Mobile" | "Backend" | "API";

export type Project = {
  id: string;
  slug: string;
  title: string;
  client: string;
  year: string;
  category: ProjectCategory;
  summary: string;
  stack: string[];
  metric?: string;
  cover: string;
  gallery: string[];
  problem: string;
  approach: string[];
  outcome: string[];
  references: { name: string; role: string; quote: string }[];
};

const img = (seed: string, w = 1600, h = 900) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;

export const projects: Project[] = [
  {
    id: "p01",
    slug: "helix-analytics-console",
    title: "Helix — analytics console",
    client: "Series-A SaaS",
    year: "2025",
    category: "Web",
    summary:
      "Rebuilt a slow Rails admin into a typed React console with real-time dashboards.",
    stack: ["React", "TanStack", "Postgres", "Websockets"],
    metric: "12× faster TTI",
    cover: img("helix-cover"),
    gallery: [img("helix-1"), img("helix-2"), img("helix-3")],
    problem:
      "The legacy Rails admin took 8+ seconds to render core dashboards and crumbled under concurrent operator load. Customers were churning on a tooling problem.",
    approach: [
      "Audited slow queries and replaced N+1 hot paths with materialized views.",
      "Rebuilt the UI on TanStack Router + Query with strict typing end-to-end.",
      "Streamed live operational metrics via a thin Websocket gateway.",
    ],
    outcome: [
      "Time-to-interactive dropped from 8.4s to 0.7s on median dashboards.",
      "Operator throughput increased ~3× with no infra cost change.",
      "Zero p1 incidents in the 90 days following launch.",
    ],
    references: [
      {
        name: "M. Larsen",
        role: "VP Engineering",
        quote:
          "Shipped what our internal team had been dreading for two years — in six weeks, with tests.",
      },
    ],
  },
  {
    id: "p02",
    slug: "lex-rag-legal-assistant",
    title: "Lex — RAG legal assistant",
    client: "EU law firm",
    year: "2025",
    category: "AI",
    summary:
      "Document-grounded chat over 200k contracts with citations and audit trails.",
    stack: ["OpenAI", "pgvector", "Next.js"],
    metric: "↓ 70% review time",
    cover: img("lex-cover"),
    gallery: [img("lex-1"), img("lex-2"), img("lex-3")],
    problem:
      "Associates spent days locating clauses across a 200k-document archive. Existing search returned noise; nothing was citable.",
    approach: [
      "Built a chunking + embedding pipeline tuned for legal prose.",
      "Wired pgvector retrieval with deterministic citation spans.",
      "Added an audit log so every answer is reproducible six months later.",
    ],
    outcome: [
      "Median clause lookup dropped from ~4 hours to ~12 minutes.",
      "Compliance signed off thanks to deterministic citations.",
      "Adopted firm-wide within one quarter of the pilot.",
    ],
    references: [
      {
        name: "C. Dubois",
        role: "Partner",
        quote:
          "First AI tool our compliance team didn't immediately veto. That alone is rare.",
      },
    ],
  },
  {
    id: "p03",
    slug: "trail-outdoor-tracking",
    title: "Trail — outdoor tracking app",
    client: "Solo founder",
    year: "2024",
    category: "Mobile",
    summary:
      "Cross-platform app with offline maps, background GPS and a tiny Stripe paywall.",
    stack: ["Expo", "React Native", "SQLite"],
    metric: "4.8★ on App Store",
    cover: img("trail-cover"),
    gallery: [img("trail-1"), img("trail-2"), img("trail-3")],
    problem:
      "A solo founder needed a polished iOS + Android app that worked off-grid, without a 12-month native build budget.",
    approach: [
      "Shipped on Expo with custom native modules for background GPS.",
      "Designed an offline-first SQLite store with conflict-free sync.",
      "Integrated a minimal Stripe paywall and review-prompt flow.",
    ],
    outcome: [
      "Launched on both stores in 11 weeks, end-to-end.",
      "4.8★ average across 1.2k reviews in the first six months.",
      "Conversion to paid sits at a healthy 6.4%.",
    ],
    references: [
      {
        name: "J. Park",
        role: "Founder",
        quote: "Felt like having a senior mobile team without the headcount.",
      },
    ],
  },
  {
    id: "p04",
    slug: "forge-payments-microservices",
    title: "Forge — payments microservices",
    client: "Fintech scale-up",
    year: "2024",
    category: "API",
    summary:
      "5 services, Docker Compose dev env, API gateway with rate-limits and tracing.",
    stack: ["C#", ".NET 8", "Docker", "RabbitMQ"],
    metric: "99.98% uptime",
    cover: img("forge-cover"),
    gallery: [img("forge-1"), img("forge-2"), img("forge-3")],
    problem:
      "A monolith was blocking the payments roadmap. Deploys took 40 minutes and one bad migration meant downtime for everyone.",
    approach: [
      "Carved out 5 bounded services around payment lifecycle events.",
      "Stood up an API gateway with auth, rate limits and OpenTelemetry tracing.",
      "Wrote a one-command Docker Compose dev env so engineers ramp in an hour.",
    ],
    outcome: [
      "99.98% uptime across the first 9 months in production.",
      "Deploy time cut from 40 min to under 4.",
      "Onboarding time for new engineers fell from a week to a day.",
    ],
    references: [
      {
        name: "S. Aydin",
        role: "Head of Platform",
        quote:
          "The gateway and tracing setup paid for the whole engagement on its own.",
      },
    ],
  },
  {
    id: "p05",
    slug: "beacon-landing-page",
    title: "Beacon — landing page",
    client: "Hardware startup",
    year: "2025",
    category: "Web",
    summary:
      "Pre-launch landing with waitlist, A/B testing and a perfect Lighthouse score.",
    stack: ["TanStack Start", "Tailwind"],
    metric: "100/100 Lighthouse",
    cover: img("beacon-cover"),
    gallery: [img("beacon-1"), img("beacon-2"), img("beacon-3")],
    problem:
      "A hardware team needed a launch site that loaded instantly on flaky conference Wi-Fi and converted cold traffic.",
    approach: [
      "Server-rendered with TanStack Start; zero client JS for the hero.",
      "Built a typed A/B test harness for headline + CTA experiments.",
      "Wired a waitlist endpoint with abuse protection and email confirmation.",
    ],
    outcome: [
      "Lighthouse 100/100 across performance, a11y, SEO and best practices.",
      "Waitlist conversion landed at 14% on cold paid traffic.",
      "Site survived a HN front-page spike with zero scaling work.",
    ],
    references: [
      {
        name: "R. Iqbal",
        role: "CEO",
        quote: "Cleanest launch we've ever shipped. Felt suspiciously easy.",
      },
    ],
  },
  {
    id: "p06",
    slug: "ledger-csharp-refactor",
    title: "Ledger — C# refactor",
    client: "B2B accounting",
    year: "2023",
    category: "Backend",
    summary:
      "Rescued a 6-year-old monolith. Added tests, observability and a sane CI pipeline.",
    stack: ["C#", "EF Core", "xUnit", "OpenTelemetry"],
    metric: "↓ 60% incidents",
    cover: img("ledger-cover"),
    gallery: [img("ledger-1"), img("ledger-2"), img("ledger-3")],
    problem:
      "A six-year-old C# monolith had no tests, opaque failures, and a CI pipeline nobody trusted. Every release was a Friday-night ritual.",
    approach: [
      "Introduced a characterization test suite around the highest-risk modules.",
      "Layered OpenTelemetry traces and metrics for the silent failure paths.",
      "Rebuilt CI on disposable runners with caching and required checks.",
    ],
    outcome: [
      "Production incidents dropped 60% within two release cycles.",
      "Mean time to diagnose fell from hours to single-digit minutes.",
      "Team finally ships on Tuesdays again.",
    ],
    references: [
      {
        name: "T. Novak",
        role: "CTO",
        quote: "Gave us back the ability to move. That's the whole story.",
      },
    ],
  },
];

export const getProjectBySlug = (slug: string) =>
  projects.find((p) => p.slug === slug);
