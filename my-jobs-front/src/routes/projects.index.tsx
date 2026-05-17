import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import type { ProjectCategory } from "@/lib/projects";
import { fallbackProjectList, fetchProjectsWithFallback } from "@/lib/content-api";
import { normalizeLanguage } from "@/i18n";
import "./styles/projects-index.scss";

export const Route = createFileRoute("/projects/")({
  head: () => ({
    meta: [
      { title: "Projects Library — my-brand.dev" },
      {
        name: "description",
        content:
          "A library of projects: web apps, AI integrations, cross-platform apps, microservices and C# backends.",
      },
      { property: "og:title", content: "Projects Library — my-brand.dev" },
      { property: "og:description", content: "Selected work across web, AI, mobile and backend." },
    ],
  }),
  component: ProjectsPage,
});

type Filter = "all" | ProjectCategory;
const categories: Filter[] = ["all", "Web", "AI", "Mobile", "Backend", "API"];

function ProjectsPage() {
  const { t, i18n } = useTranslation();
  const [filter, setFilter] = useState<Filter>("all");
  const [items, setItems] = useState(fallbackProjectList);
  const visible = items.filter((p) => filter === "all" || p.category === filter);

  useEffect(() => {
    const locale = normalizeLanguage(i18n.resolvedLanguage);
    void fetchProjectsWithFallback(locale).then(setItems);
  }, [i18n.resolvedLanguage]);

  return (
    <div className="container projects-page">
      <span className="chip">{t("projects.chip")}</span>
      <h1 className="projects-page__title text-display">{t("projects.title")}</h1>
      <p className="projects-page__intro">{t("projects.intro")}</p>

      <div className="projects-page__filters">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`projects-page__filter text-mono ${filter === c ? "projects-page__filter--active" : ""}`}
          >
            {t(`projects.categories.${c}`)}
          </button>
        ))}
      </div>

      <div className="projects-page__grid">
        {visible.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: i * 0.04 }}
            className="projects-page__grid-item"
          >
            <Link to="/projects/$slug" params={{ slug: p.slug }} className="project-card">
              <div className="project-card__top">
                <span className="project-card__meta text-mono">
                  {p.id} / {p.year}
                </span>
                <span className="chip">{p.category}</span>
              </div>
              <h3 className="project-card__title text-display">{p.title}</h3>
              <p className="project-card__client text-mono">{p.client}</p>
              <p className="project-card__summary">{p.summary}</p>
              <div className="project-card__tags">
                {p.stack.map((s) => (
                  <span key={s} className="project-card__tag text-mono">
                    {s}
                  </span>
                ))}
              </div>
              <div className="project-card__bottom">
                {p.metric && <div className="project-card__metric text-mono">◆ {p.metric}</div>}
                <span className="project-card__case text-mono">{t("projects.caseStudy")}</span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="projects-page__next">
        <h2 className="projects-page__next-title text-display">
          {t("projects.nextTitle")}{" "}
          <span className="projects-page__accent">{t("projects.nextAccent")}</span>
          {t("projects.nextEnd")}
        </h2>
        <Link to="/pricing" className="projects-page__next-cta text-mono">
          {t("projects.nextCta")}
        </Link>
      </div>
    </div>
  );
}
