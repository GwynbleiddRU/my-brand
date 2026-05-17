import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { fetchPricingWithFallback, type PricingContent } from "@/lib/content-api";
import { normalizeLanguage } from "@/i18n";
import "./styles/pricing.scss";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing & FAQ — my-brand.dev" },
      {
        name: "description",
        content:
          "Transparent pricing for websites, AI apps, cross-platform apps, C# backends and API/microservice work.",
      },
      { property: "og:title", content: "Pricing & FAQ — my-brand.dev" },
      {
        property: "og:description",
        content: "Engagement options, pricing and answers to common questions.",
      },
    ],
  }),
  component: PricingPage,
});

function PricingPage() {
  const { t, i18n } = useTranslation();
  const tierKeys = ["sprint", "project", "retainer"] as const;
  const featuredKey = "project";
  const fallback: PricingContent = {
    tiers: tierKeys.map((key) => {
      const tier = t(`pricing.tiers.${key}`, { returnObjects: true }) as {
        name: string;
        price: string;
        duration: string;
        desc: string;
        bullets: string[];
        cta: string;
      };
      return {
        key,
        name: tier.name,
        price: tier.price,
        duration: tier.duration,
        description: tier.desc,
        bullets: tier.bullets,
        cta: tier.cta,
      };
    }),
    faqs: (t("pricing.faqs", { returnObjects: true }) as Array<{ q: string; a: string }>).map((item) => ({
      question: item.q,
      answer: item.a,
    })),
  };
  const [content, setContent] = useState<PricingContent>(fallback);

  useEffect(() => {
    const locale = normalizeLanguage(i18n.resolvedLanguage);
    void fetchPricingWithFallback(locale, fallback).then(setContent);
  }, [i18n.resolvedLanguage]);

  return (
    <div className="container pricing-page">
      <span className="chip">{t("pricing.chip")}</span>
      <h1 className="pricing-page__title text-display">
        {t("pricing.title1")}{" "}
        <span className="pricing-page__title-acid">{t("pricing.titleAccent")}</span>
        {t("pricing.title2")}
      </h1>
      <p className="pricing-page__intro">{t("pricing.intro")}</p>

      <div className="pricing-page__tiers">
        {tierKeys.map((key) => {
          const tier = content.tiers.find((x) => x.key === key);
          if (!tier) return null;
          const featured = key === featuredKey;
          return (
            <div key={key} className={`pricing-tier ${featured ? "pricing-tier--featured" : ""}`}>
              {featured && (
                <span className="pricing-tier__badge text-mono">{t("pricing.featured")}</span>
              )}
              <h3 className="pricing-tier__name text-display">{tier.name}</h3>
              <p className="pricing-tier__duration text-mono">{tier.duration}</p>
              <p className="pricing-tier__price text-display">{tier.price}</p>
              <p className="pricing-tier__desc">{tier.description}</p>
              <ul className="pricing-tier__bullets">
                {tier.bullets.map((b) => (
                  <li key={b} className="pricing-tier__bullet">
                    <span className="pricing-tier__bullet-icon">▹</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <a
                href="mailto:hello@my-brand.dev"
                className={`pricing-tier__cta text-mono ${featured ? "pricing-tier__cta--featured" : "pricing-tier__cta--outline"}`}
              >
                {tier.cta} →
              </a>
            </div>
          );
        })}
      </div>

      <section className="pricing-page__faq">
        <span className="chip">{t("pricing.faqChip")}</span>
        <h2 className="pricing-page__faq-title text-display">{t("pricing.faqHeading")}</h2>
        <div className="pricing-page__faq-list">
          {content.faqs.map((f, i) => (
            <FaqItem key={i} q={f.question} a={f.answer} />
          ))}
        </div>
      </section>

      <div className="pricing-page__final">
        <h2 className="pricing-page__final-title text-display">
          {t("pricing.finalTitle")}{" "}
          <span className="pricing-page__title-acid">{t("pricing.finalAccent")}</span>
          {t("pricing.finalEnd")}
        </h2>
        <p className="pricing-page__final-desc">{t("pricing.finalDesc")}</p>
        <a href="mailto:hello@my-brand.dev" className="pricing-page__final-cta text-mono">
          {t("common.email")}
        </a>
      </div>
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="faq-item">
      <button onClick={() => setOpen((v) => !v)} className="faq-item__trigger">
        <span className="faq-item__question text-display">{q}</span>
        <span className={`faq-item__plus ${open ? "faq-item__plus--open" : ""}`}>+</span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="faq-item__content"
          >
            <p className="faq-item__answer">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
