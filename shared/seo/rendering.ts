import fallbackCatalog from '../../app/data/products.json'

/** 产品分类页 ISR 缓存：5 分钟 */
export const PRODUCT_ISR_SECONDS = 300

/** 博客/新闻页 ISR 缓存：30 分钟 */
export const BLOG_ISR_SECONDS = 1800

export const SITE_LOCALES = [
  { code: 'en', prefix: '', hreflang: 'en-US' },
  { code: 'zh-CN', prefix: 'zh-CN', hreflang: 'zh-CN' },
  { code: 'zh-TW', prefix: 'zh-TW', hreflang: 'zh-TW' },
] as const

export const STATIC_SITEMAP_PATHS = ['/', '/about-us', '/contact-us', '/news'] as const

export interface CategorySlugSource {
  siteKey?: string
  cmsApi?: string
}

export function localePath(prefix: string, path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`
  if (!prefix) {
    return normalized
  }
  if (normalized === '/') {
    return `/${prefix}`
  }
  return `/${prefix}${normalized}`
}

/** CMS 不可用时的 offline fallback（与 useProductCatalog 一致，来自 products.json） */
export function getFallbackCategorySlugs(): string[] {
  return [...new Set(
    (fallbackCatalog.categories ?? [])
      .map(c => c.slug?.trim())
      .filter((slug): slug is string => !!slug),
  )]
}

/**
 * 从 analytics-platform 公开 API 拉取启用中的分类 slug；
 * CMS 不可用时回退到 products.json。
 */
export async function fetchCategorySlugs(source: CategorySlugSource = {}): Promise<string[]> {
  const siteKey = source.siteKey || process.env.NUXT_PUBLIC_CMS_SITE_KEY || 'oyababies.com'
  const cmsApi = (source.cmsApi || process.env.NUXT_PUBLIC_CMS_API || 'https://analytics.oyababies.com/api/public').replace(/\/$/, '')

  try {
    const res = await fetch(`${cmsApi}/products?site_key=${encodeURIComponent(siteKey)}`)
    if (!res.ok) {
      return getFallbackCategorySlugs()
    }
    const data = await res.json() as { categories?: { slug?: string }[] }
    const slugs = (data.categories ?? [])
      .map(c => c.slug?.trim())
      .filter((slug): slug is string => !!slug)
    if (slugs.length) {
      return [...new Set(slugs)]
    }
  }
  catch {
    // CMS 不可用时使用本地 catalog
  }

  return getFallbackCategorySlugs()
}

/** @deprecated 使用 fetchCategorySlugs */
export const fetchCmsCategorySlugs = fetchCategorySlugs

/** 构建 Hybrid Rendering 的 routeRules（分类 slug 以 CMS 为准） */
export function buildHybridRouteRules(categorySlugs: string[]) {
  const rules: Record<string, object> = {
    '/': { prerender: true },
    '/zh-CN': { prerender: true },
    '/zh-TW': { prerender: true },
    '/news': { isr: BLOG_ISR_SECONDS },
    '/example/**': { index: false },
  }

  const allSlugs = [...new Set(categorySlugs.filter(Boolean))]

  for (const { prefix } of SITE_LOCALES) {
    for (const slug of allSlugs) {
      rules[localePath(prefix, slug)] = { isr: PRODUCT_ISR_SECONDS }
    }
  }

  return rules
}

export function buildHreflangAlternatives(path: string, siteUrl: string) {
  const normalizedSiteUrl = siteUrl.replace(/\/$/, '')
  const normalizedPath = path.startsWith('/') ? path : `/${path}`

  const alternatives = SITE_LOCALES.map(({ prefix, hreflang }) => ({
    hreflang,
    href: `${normalizedSiteUrl}${localePath(prefix, normalizedPath)}`,
  }))

  alternatives.push({
    hreflang: 'x-default',
    href: `${normalizedSiteUrl}${localePath('', normalizedPath)}`,
  })

  return alternatives
}
