import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import "./styles/index.scss";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Independent Engineer // my-brand.dev — Web, AI & C# Backends" },
      {
        name: "description",
        content:
          "Independent engineer for hire: websites, landing pages, AI-integrated apps, cross-platform apps, C# backend improvements and API/microservice work.",
      },
      { property: "og:title", content: "Independent Engineer // my-brand.dev" },
      {
        property: "og:description",
        content: "Websites, AI apps, cross-platform & C# backend engineering.",
      },
    ],
  }),
  component: Index,
});

const serviceKeys = ["web", "ai", "cross", "csharp", "api", "long"] as const;
const serviceTags: Record<(typeof serviceKeys)[number], string[]> = {
  web: ["React", "TanStack", "SSR", "SEO"],
  ai: ["OpenAI", "RAG", "Agents", "Vector DB"],
  cross: ["React Native", "Expo", "PWA"],
  csharp: [".NET", "ASP.NET", "EF Core", "xUnit"],
  api: ["Microservices", "Docker", "Gateway", "gRPC"],
  long: ["Retainer", "Consulting", "Architecture"],
};

const stack = [
  "AI",
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "C#",
  ".NET 8",
  "ASP.NET Core",
  "ADO.NET",
  "EF Core",
  "Postgres",
  "Docker",
  "Kubernetes",
  "OpenAI",
  "LangChain",
  "MongoDB",
  "SQLite",
  "Supabase",
];

function Index() {
  const { t } = useTranslation();

  const metrics: Array<[string, string]> = [
    ["9+", t("home.metrics.years")],
    ["20+", t("home.metrics.delivered")],
    ["5", t("home.metrics.countries")],
    ["100%", t("home.metrics.code")],
  ];

  return (
    <div className="home-page">
      <section className="home-hero">
        <div className="container home-hero__container">
          <div className="home-hero__chips">
            <span className="chip-acid">
              <span className="home-hero__status-dot" />
              {t("home.chip")}
            </span>
            <span className="chip">{t("home.chipVersion")}</span>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
            className="home-hero__title text-display"
          >
            {t("home.titleA")}{" "}
            <span className="home-hero__title-acid">{t("home.titleSoftware")}</span>
            <br />
            {t("home.titleB")}
          </motion.h1>

          <div className="home-hero__intro-grid">
            <p className="home-hero__intro">{t("home.intro")}</p>
          </div>

          <div className="home-hero__actions">
            <Link to="/projects" className="home-btn home-btn--solid">
              {t("home.viewProjects")}
              <span className="home-btn__arrow">→</span>
            </Link>
            <Link to="/pricing" className="home-btn home-btn--outline">
              {t("home.pricing")}
            </Link>
          </div>

          <div className="home-metrics">
            {metrics.map(([k, v]) => (
              <div key={v} className="home-metrics__item">
                <p className="home-metrics__value text-display">{k}</p>
                <p className="home-metrics__label text-mono">{v}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="home-services">
        <div className="container home-services__container">
          <div className="home-services__head">
            <div>
              <span className="chip">{t("home.services.chip")}</span>
              <h2 className="home-services__title text-display">{t("home.services.heading")}</h2>
            </div>
            <p className="home-services__intro">
              {t("home.services.intro")}
              <Link to="/pricing" className="home-services__intro-link">
                {t("home.services.askLink")}
              </Link>
              .
            </p>
          </div>

          <div className="home-services__grid">
            {serviceKeys.map((key, idx) => (
              <motion.div
                key={key}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.25 }}
                className="home-service-card"
              >
                <div className="home-service-card__top">
                  <span className="home-service-card__index text-mono">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <span className="home-service-card__icon">↗</span>
                </div>
                <h3 className="home-service-card__title text-display">
                  {t(`home.services.items.${key}.title`)}
                </h3>
                <p className="home-service-card__desc">{t(`home.services.items.${key}.desc`)}</p>
                <div className="home-service-card__tags">
                  {serviceTags[key].map((tag) => (
                    <span key={tag} className="home-service-card__tag text-mono">
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="home-stack">
        <div className="home-stack__track text-display">
          {[...stack, ...stack].map((s, i) => (
            <span key={i} className="home-stack__item">
              {s}
              <span className="home-stack__star">✦</span>
            </span>
          ))}
        </div>
      </section>

      <section className="container home-cta-section">
        <div className="home-cta">
          <div className="home-cta__glow" />
          <span className="chip">{t("home.cta.chip")}</span>
          <h2 className="home-cta__title text-display">
            {t("home.cta.title")}{" "}
            <span className="home-cta__title-acid">{t("home.cta.titleAccent")}</span>
            {t("home.cta.titleEnd")}
          </h2>
          <p className="home-cta__desc">{t("home.cta.desc")}</p>
          <a href="mailto:hello@my-brand.dev" className="home-btn home-btn--solid home-cta__button">
            {t("common.email")}
          </a>
        </div>
      </section>
    </div>
  );
}
