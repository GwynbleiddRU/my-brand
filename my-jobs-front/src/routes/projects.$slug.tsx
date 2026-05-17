import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getProjectBySlug, projects, type Project } from "@/lib/projects";
import { fetchProjectDetailWithFallback } from "@/lib/content-api";
import { normalizeLanguage } from "@/i18n";
import "./styles/projects-slug.scss";

export const Route = createFileRoute("/projects/$slug")({
  loader: ({ params }): { project: Project } => {
    const project = getProjectBySlug(params.slug);
    if (!project) throw notFound();
    return { project };
  },
  head: ({ loaderData }) => {
    const p = loaderData?.project;
    if (!p) return { meta: [{ title: "Project — my-brand.dev" }] };
    return {
      meta: [
        { title: `${p.title} — my-brand.dev` },
        { name: "description", content: p.summary },
        { property: "og:title", content: `${p.title} — my-brand.dev` },
        { property: "og:description", content: p.summary },
        { property: "og:image", content: p.cover },
        { name: "twitter:image", content: p.cover },
      ],
    };
  },
  notFoundComponent: NotFound,
  errorComponent: ErrorView,
  component: ProjectDetailPage,
});

function NotFound() {
  const { t } = useTranslation();
  return (
    <div className="container project-detail-not-found">
      <span className="chip">{t("projects.detail.notFoundChip")}</span>
      <h1 className="project-detail-not-found__title text-display">
        {t("projects.detail.notFoundTitle")}
      </h1>
      <Link to="/projects" className="project-detail-not-found__cta text-mono">
        {t("projects.detail.notFoundBack")}
      </Link>
    </div>
  );
}

function ErrorView({ error }: { error: Error }) {
  const { t } = useTranslation();
  return (
    <div className="container project-detail-not-found">
      <h1 className="project-detail-error__title text-display">
        {t("projects.detail.errorTitle")}
      </h1>
      <p className="project-detail-error__desc">{error.message}</p>
    </div>
  );
}

function ProjectDetailPage() {
  const { project: initialProject } = Route.useLoaderData();
  const { t, i18n } = useTranslation();
  const { slug } = Route.useParams();
  const [p, setProject] = useState(initialProject);
  const [related, setRelated] = useState(
    projects.filter((x) => x.slug !== initialProject.slug && x.category === initialProject.category).slice(0, 2),
  );

  useEffect(() => {
    const locale = normalizeLanguage(i18n.resolvedLanguage);
    void fetchProjectDetailWithFallback(slug, locale).then((result) => {
      if (!result) return;
      setProject(result.project);
      setRelated(result.related);
    });
  }, [slug, i18n.resolvedLanguage]);

  return (
    <article>
      <header className="project-detail__header">
        <div className="container project-detail__header-inner">
          <Link to="/projects" className="project-detail__back text-mono">
            {t("projects.detail.backLink")}
          </Link>
          <div className="project-detail__meta-row">
            <span className="chip">{p.category}</span>
            <span className="project-detail__meta text-mono">
              {p.id} · {p.client} · {p.year}
            </span>
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="project-detail__title text-display"
          >
            {p.title}
          </motion.h1>
          <p className="project-detail__summary">{p.summary}</p>
          {p.metric && <div className="project-detail__metric text-mono">◆ {p.metric}</div>}
        </div>
        <div className="container project-detail__cover-wrap">
          <div className="project-detail__cover">
            <img
              src={p.cover}
              alt={`${p.title} cover`}
              className="project-detail__img"
              loading="eager"
            />
          </div>
        </div>
      </header>

      <section className="container project-detail__body">
        <div className="project-detail__body-grid">
          <aside className="project-detail__facts">
            <div>
              <p className="project-detail__fact-label text-mono">{t("projects.detail.client")}</p>
              <p className="project-detail__fact-value">{p.client}</p>
            </div>
            <div>
              <p className="project-detail__fact-label text-mono">{t("projects.detail.year")}</p>
              <p className="project-detail__fact-value">{p.year}</p>
            </div>
            <div>
              <p className="project-detail__fact-label text-mono">{t("projects.detail.stack")}</p>
              <div className="project-detail__stack">
                {p.stack.map((s: string) => (
                  <span key={s} className="project-detail__stack-item text-mono">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </aside>
          <div className="project-detail__content">
            <div>
              <h2 className="project-detail__section-title text-display">
                {t("projects.detail.problem")}
              </h2>
              <p className="project-detail__section-text">{p.problem}</p>
            </div>
            <div>
              <h2 className="project-detail__section-title text-display">
                {t("projects.detail.approach")}
              </h2>
              <ul className="project-detail__list">
                {p.approach.map((a: string, i: number) => (
                  <li key={i} className="project-detail__list-item">
                    <span className="project-detail__list-index text-mono">0{i + 1}</span>
                    <span>{a}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="project-detail__section-title text-display">
                {t("projects.detail.outcome")}
              </h2>
              <ul className="project-detail__list">
                {p.outcome.map((o: string, i: number) => (
                  <li key={i} className="project-detail__list-item">
                    <span className="project-detail__diamond">◆</span>
                    <span>{o}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="project-detail__gallery-section">
        <div className="container project-detail__gallery-wrap">
          <span className="chip">{t("projects.detail.gallery")}</span>
          <div className="project-detail__gallery-grid">
            {p.gallery.map((src: string, i: number) => (
              <div
                key={src}
                className={`project-detail__gallery-item ${i === 0 ? "project-detail__gallery-item--wide" : ""}`}
              >
                <img
                  src={src}
                  alt={`${p.title} screenshot ${i + 1}`}
                  className="project-detail__img"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {p.references.length > 0 && (
        <section className="container project-detail__references">
          <span className="chip">{t("projects.detail.references")}</span>
          <div className="project-detail__references-grid">
            {p.references.map((r: Project["references"][number]) => (
              <figure key={r.name} className="project-detail__reference">
                <blockquote className="project-detail__quote text-display">“{r.quote}”</blockquote>
                <figcaption className="project-detail__quote-meta text-mono">
                  {r.name} · {r.role}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      <RequestForm projectTitle={p.title} />

      {related.length > 0 && (
        <section className="container project-detail__related">
          <span className="chip">{t("projects.detail.related")}</span>
          <div className="project-detail__related-grid">
            {related.map((r: Project) => (
              <Link
                key={r.id}
                to="/projects/$slug"
                params={{ slug: r.slug }}
                className="project-detail__related-card"
              >
                <span className="chip">{r.category}</span>
                <h3 className="project-detail__related-title text-display">{r.title}</h3>
                <p className="project-detail__related-desc">{r.summary}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}

function RequestForm({ projectTitle }: { projectTitle: string }) {
  const { t } = useTranslation();
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Project request: ${projectTitle}`);
    const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`);
    window.location.href = `mailto:hello@my-brand.dev?subject=${subject}&body=${body}`;
    setSent(true);
  };

  return (
    <section className="project-detail-form">
      <div className="container project-detail-form__inner">
        <span className="chip chip-acid">{t("projects.detail.formChip")}</span>
        <h2 className="project-detail-form__title text-display">
          {t("projects.detail.formTitle")}{" "}
          <span className="project-detail-form__title-acid">{projectTitle.split(" — ")[0]}</span>?
        </h2>
        <p className="project-detail-form__desc">{t("projects.detail.formDesc")}</p>
        <form onSubmit={onSubmit} className="project-detail-form__form">
          <div className="project-detail-form__row">
            <input
              required
              placeholder={t("projects.detail.yourName")}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="project-detail-form__input"
            />
            <input
              required
              type="email"
              placeholder={t("projects.detail.yourEmail")}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="project-detail-form__input"
            />
          </div>
          <textarea
            required
            rows={5}
            placeholder={t("projects.detail.messagePlaceholder", { title: projectTitle })}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="project-detail-form__input project-detail-form__textarea"
          />
          <div className="project-detail-form__actions">
            <button type="submit" className="project-detail-form__submit text-mono">
              {t("projects.detail.send")}
            </button>
            <a href="mailto:hello@my-brand.dev" className="project-detail-form__email text-mono">
              {t("projects.detail.orEmail")}
            </a>
            {sent && (
              <span className="project-detail-form__sent text-mono">
                {t("projects.detail.sent")}
              </span>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
