import type { SupportedLanguage } from "@/i18n";
import { getProjectBySlug, projects, type Project } from "@/lib/projects";

export type PricingTier = {
  key: string;
  name: string;
  price: string;
  duration: string;
  description: string;
  bullets: string[];
  cta: string;
};

export type PricingFaq = {
  question: string;
  answer: string;
};

export type PricingContent = {
  tiers: PricingTier[];
  faqs: PricingFaq[];
};

type ApiLocaleResponse<T> = {
  locale: string;
  data: T;
};

type ApiProjectListItem = Omit<Project, "gallery" | "problem" | "approach" | "outcome" | "references">;
type ApiProjectDetail = Project & { related: ApiProjectListItem[] };

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, "") ?? "";
const REQUEST_TIMEOUT_MS = 4500;

async function requestJson<T>(path: string, locale: SupportedLanguage): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${API_BASE_URL}${path}?locale=${locale}`, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }

    return (await response.json()) as T;
  } finally {
    clearTimeout(timeout);
  }
}

export async function fetchProjectsWithFallback(locale: SupportedLanguage): Promise<Project[]> {
  try {
    const response = await requestJson<ApiLocaleResponse<ApiProjectListItem[]>>("/api/content/projects", locale);
    return response.data;
  } catch {
    return projects;
  }
}

export async function fetchProjectDetailWithFallback(
  slug: string,
  locale: SupportedLanguage,
): Promise<{ project: Project; related: Project[] } | null> {
  const fallbackProject = getProjectBySlug(slug);
  if (!fallbackProject) {
    return null;
  }

  const fallbackRelated = projects
    .filter((x) => x.slug !== fallbackProject.slug && x.category === fallbackProject.category)
    .slice(0, 2);

  try {
    const response = await requestJson<ApiLocaleResponse<ApiProjectDetail>>(
      `/api/content/projects/${encodeURIComponent(slug)}`,
      locale,
    );

    const { related, ...project } = response.data;
    return { project, related: related as Project[] };
  } catch {
    return { project: fallbackProject, related: fallbackRelated };
  }
}

export async function fetchPricingWithFallback(
  locale: SupportedLanguage,
  fallback: PricingContent,
): Promise<PricingContent> {
  try {
    const response = await requestJson<ApiLocaleResponse<PricingContent>>("/api/content/pricing", locale);
    return response.data;
  } catch {
    return fallback;
  }
}
