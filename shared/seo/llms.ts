import {
  fetchCategorySlugs,
  localePath,
  SITE_LOCALES,
  STATIC_SITEMAP_PATHS,
} from './rendering'

export interface LlmsLink {
  title: string
  description?: string
  href: string
}

export interface LlmsSection {
  title: string
  description?: string
  links: LlmsLink[]
}

const PAGE_LABELS: Record<string, string> = {
  '/': 'Home',
  '/about-us': 'About Us',
  '/contact-us': 'Contact Us',
  '/news': 'News',
}

function slugToTitle(slug: string): string {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export function buildEnglishStaticSection(): LlmsSection {
  return {
    title: 'Main Pages',
    description: 'Primary English pages (default locale).',
    links: STATIC_SITEMAP_PATHS.map(path => ({
      title: PAGE_LABELS[path] || path,
      href: path,
    })),
  }
}

export function buildLocalizedStaticSections(): LlmsSection[] {
  return SITE_LOCALES
    .filter(locale => locale.prefix)
    .map(({ code, prefix }) => ({
      title: `${code} Pages`,
      description: `Localized pages (${code}).`,
      links: STATIC_SITEMAP_PATHS.map(path => ({
        title: PAGE_LABELS[path] || path,
        href: localePath(prefix, path),
      })),
    }))
}

export async function buildProductCategorySection(): Promise<LlmsSection | null> {
  const slugs = await fetchCategorySlugs()
  if (!slugs.length) {
    return null
  }

  return {
    title: 'Product Categories',
    description: 'Product catalog pages by category (CMS-driven).',
    links: slugs.map(slug => ({
      title: slugToTitle(slug),
      href: `/${slug}`,
    })),
  }
}

export function buildLlmsNotes(siteUrl: string): string[] {
  return [`Sitemap: ${siteUrl.replace(/\/$/, '')}/sitemap.xml`]
}
