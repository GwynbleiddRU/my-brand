import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { createIsomorphicFn } from "@tanstack/react-start";
import { useLayoutEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { useTranslation } from "react-i18next";

import ScrollToTop from "@/components/ScrollToTop";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { getStoredLanguage, normalizeLanguage, setI18nLanguage } from "@/i18n";

import "../styles.scss";
import "./styles/root.scss";

const getInitialLanguage = createIsomorphicFn()
  .server(async () => {
    const { getCookie } = await import("@tanstack/react-start/server");
    return normalizeLanguage(getCookie("lang"));
  })
  .client(() => getStoredLanguage());

function NotFoundComponent() {
  const { t } = useTranslation();
  return (
    <div className="not-found">
      <div className="not-found__content">
        <p className="not-found__label">{t("notFound.label")}</p>
        <h1 className="not-found__title">{t("notFound.title")}</h1>
        <p className="not-found__desc">{t("notFound.desc")}</p>
        <Link to="/" className="not-found__cta">
          {t("notFound.back")}
        </Link>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  loader: async () => ({ lang: await getInitialLanguage() }),
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Independent Engineer // my-brand.dev— Web, AI & C# Backends" },
      {
        name: "description",
        content:
          "Independent engineer building landing pages and complex websites, AI-integrated apps, cross-platform apps and C# backends.",
      },
      { name: "author", content: "Independent Engineer" },
      { property: "og:title", content: "Independent Engineer // my-brand.dev" },
      {
        property: "og:description",
        content: "Websites, AI apps, cross-platform & C# backend engineering — for hire.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  const { lang: loaderLang } = Route.useLoaderData();
  const [htmlLang, setHtmlLang] = useState(loaderLang);

  // Sync once from storage; do not call setI18nLanguage(loaderLang) on every render —
  // that overwrote the user's choice after LanguageSwitcher updated i18n.
  useLayoutEffect(() => {
    const synced = setI18nLanguage(getStoredLanguage());
    setHtmlLang(synced);
  }, [loaderLang]);

  return (
    <html lang={htmlLang} className="app-shell dark">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <div className="root-layout">
      <ScrollToTop />
      <SiteHeader />
      <main>
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  );
}

function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  return (
    <header className="site-header">
      <div className="site-header__inner container">
        <Link to="/" onClick={() => setOpen(false)} className="site-header__brand">
          <span className="site-header__logo">//</span>
          <span className="site-header__brand-text">my-brand.dev</span>
        </Link>
        <nav className="site-header__nav">
          <Link
            to="/"
            className="site-header__nav-link"
            activeOptions={{ exact: true }}
            activeProps={{ className: "site-header__nav-link--active" }}
          >
            {t("nav.index")}
          </Link>
          <Link
            to="/about"
            className="site-header__nav-link"
            activeProps={{ className: "site-header__nav-link--active" }}
          >
            {t("nav.about")}
          </Link>
          <Link
            to="/projects"
            className="site-header__nav-link"
            activeProps={{ className: "site-header__nav-link--active" }}
          >
            {t("nav.projects")}
          </Link>
          <Link
            to="/pricing"
            className="site-header__nav-link"
            activeProps={{ className: "site-header__nav-link--active" }}
          >
            {t("nav.pricing")}
          </Link>
        </nav>
        <div className="site-header__actions">
          <LanguageSwitcher />
          <a href="mailto:hello@my-brand.dev" className="site-header__cta">
            {t("nav.cta")}
          </a>
        </div>
        <button
          type="button"
          aria-label={open ? t("nav.closeMenu") : t("nav.openMenu")}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="site-header__menu-btn"
        >
          {open ? (
            <X className="site-header__menu-icon" />
          ) : (
            <Menu className="site-header__menu-icon" />
          )}
        </button>
      </div>
      {open && (
        <div className="site-header__mobile">
          <nav className="site-header__mobile-nav container">
            <Link
              to="/"
              onClick={() => setOpen(false)}
              className="site-header__mobile-link"
              activeOptions={{ exact: true }}
              activeProps={{ className: "site-header__mobile-link--active" }}
            >
              {t("nav.index")}
            </Link>
            <Link
              to="/about"
              onClick={() => setOpen(false)}
              className="site-header__mobile-link"
              activeProps={{ className: "site-header__mobile-link--active" }}
            >
              {t("nav.about")}
            </Link>
            <Link
              to="/projects"
              onClick={() => setOpen(false)}
              className="site-header__mobile-link"
              activeProps={{ className: "site-header__mobile-link--active" }}
            >
              {t("nav.projects")}
            </Link>
            <Link
              to="/pricing"
              onClick={() => setOpen(false)}
              className="site-header__mobile-link"
              activeProps={{ className: "site-header__mobile-link--active" }}
            >
              {t("nav.pricing")}
            </Link>
            <div className="site-header__mobile-lang">
              <LanguageSwitcher />
            </div>
            <a
              href="mailto:hello@my-brand.dev"
              onClick={() => setOpen(false)}
              className="site-header__mobile-cta"
            >
              {t("nav.cta")}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}

function SiteFooter() {
  const { t } = useTranslation();
  return (
    <footer className="site-footer">
      <div className="site-footer__main container">
        <div className="site-footer__brand-col">
          <div className="site-footer__brand">
            <span className="site-footer__logo">//</span>
            <span className="site-footer__brand-text">my-brand.dev</span>
          </div>
          <p className="site-footer__tagline">{t("footer.tagline")}</p>
        </div>
        <div>
          <p className="site-footer__heading">{t("footer.sitemap")}</p>
          <ul className="site-footer__list">
            <li>
              <Link to="/about" className="site-footer__link">
                {t("nav.about")}
              </Link>
            </li>
            <li>
              <Link to="/projects" className="site-footer__link">
                {t("nav.projects")}
              </Link>
            </li>
            <li>
              <Link to="/pricing" className="site-footer__link">
                {t("nav.pricing")}
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="site-footer__heading">{t("footer.contact")}</p>
          <ul className="site-footer__list">
            <li>
              <a href="mailto:hello@my-brand.dev" className="site-footer__link">
                hello@my-brand.dev
              </a>
            </li>
            <li>
              <a href="#" className="site-footer__link">
                github
              </a>
            </li>
            <li>
              <a href="#" className="site-footer__link">
                telegram
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="site-footer__bottom-wrap">
        <div className="site-footer__bottom container">
          <span className="site-footer__meta">
            {t("footer.rights", { year: new Date().getFullYear() })}
          </span>
          <span className="site-footer__meta">{t("footer.availability")}</span>
        </div>
      </div>
    </footer>
  );
}
