import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import "./styles/about.scss";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Independent Engineer // my-brand.dev" },
      {
        name: "description",
        content:
          "About me: an independent engineer specializing in web, AI integrations, cross-platform apps and C# backend systems.",
      },
      { property: "og:title", content: "About — Independent Engineer" },
      { property: "og:description", content: "Background, philosophy and how I work." },
    ],
  }),
  component: AboutPage,
});

type TimelineItem = { year: string; title: string; body: string };
type Principle = { t: string; d: string };

function AboutPage() {
  const { t } = useTranslation();
  const principleKeys = ["p1", "p2", "p3", "p4"] as const;
  const timeline = t("about.timeline.items", { returnObjects: true }) as TimelineItem[];
  const glanceRows: Array<[string, string]> = [
    [t("about.glance.based"), t("about.glance.basedV")],
    [t("about.glance.since"), t("about.glance.sinceV")],
    [t("about.glance.langs"), t("about.glance.langsV")],
    [t("about.glance.stack"), t("about.glance.stackV")],
    [t("about.glance.open"), t("about.glance.openV")],
  ];

  return (
    <div className="container about-page">
      <span className="chip">{t("about.chip")}</span>
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="about-page__title text-display"
      >
        {t("about.title1")}
        <br />
        <span className="about-page__title-acid">{t("about.title2")}</span> {t("about.title3")}
      </motion.h1>

      <div className="about-page__layout">
        <div className="about-page__main">
          <p className="about-page__intro">{t("about.intro1")}</p>
          <p className="about-page__intro-secondary">{t("about.intro2")}</p>

          <div className="about-page__principles">
            {principleKeys.map((k, i) => {
              const p = t(`about.principles.${k}`, { returnObjects: true }) as Principle;
              return (
                <div key={k} className="about-page__principle">
                  <span className="about-page__principle-index text-mono">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="about-page__principle-title text-display">{p.t}</h3>
                  <p className="about-page__principle-desc">{p.d}</p>
                </div>
              );
            })}
          </div>
        </div>

        <aside className="about-page__aside">
          <div className="about-page__glance">
            <p className="about-page__glance-title text-mono">{t("about.glance.title")}</p>
            <dl className="about-page__glance-list">
              {glanceRows.map(([k, v]) => (
                <div key={k} className="about-page__glance-row">
                  <dt className="about-page__glance-key">{k}</dt>
                  <dd className="about-page__glance-value">{v}</dd>
                </div>
              ))}
            </dl>
            <Link to="/projects" className="about-page__glance-cta text-mono">
              {t("about.glance.cta")}
            </Link>
          </div>
        </aside>
      </div>

      <section className="about-page__timeline">
        <span className="chip">{t("about.timeline.chip")}</span>
        <h2 className="about-page__timeline-title text-display">{t("about.timeline.heading")}</h2>
        <ol className="about-page__timeline-list">
          {timeline.map((item) => (
            <li key={item.year} className="about-page__timeline-item">
              <div className="about-page__timeline-year text-display">{item.year}</div>
              <div className="about-page__timeline-item-title-wrap">
                <h3 className="about-page__timeline-item-title text-display">{item.title}</h3>
              </div>
              <p className="about-page__timeline-item-body">{item.body}</p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
