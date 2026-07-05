import fallbackCatalog from '../../app/data/products.json'
import {
  fetchCategorySlugs,
  localePath,
  SITE_LOCALES,
  STATIC_SITEMAP_PATHS,
} from './rendering'

interface CatalogCategory {
  name?: string
  slug?: string
  count?: number
}

interface CatalogProduct {
  name?: string
  categorySlug?: string
}

interface ProductCatalog {
  totalProducts?: number
  categories?: CatalogCategory[]
  products?: CatalogProduct[]
}

const PAGE_LABELS: Record<string, string> = {
  '/': 'Home',
  '/about-us': 'About Us',
  '/contact-us': 'Contact Us',
  '/news': 'News',
}

const PAGE_SUMMARIES: Record<string, string> = {
  '/': 'Homepage featuring baby product categories, company highlights, and inquiry options.',
  '/about-us': 'Company history, factory capabilities, ISO/BSCI certifications, and quality commitment.',
  '/contact-us': 'Contact form, business inquiry, and company contact details.',
  '/news': 'Company news and baby products industry insights from CMS.',
}

function absoluteUrl(domain: string, path: string): string {
  const base = domain.replace(/\/$/, '')
  return path.startsWith('/') ? `${base}${path}` : `${base}/${path}`
}

async function loadCatalog(): Promise<ProductCatalog> {
  const siteKey = process.env.NUXT_PUBLIC_CMS_SITE_KEY || 'oyababies.com'
  const cmsApi = (process.env.NUXT_PUBLIC_CMS_API || 'https://analytics.oyababies.com/api/public').replace(/\/$/, '')

  try {
    const res = await fetch(`${cmsApi}/products?site_key=${encodeURIComponent(siteKey)}`)
    if (res.ok) {
      const data = await res.json() as ProductCatalog
      if (data.categories?.length) {
        return data
      }
    }
  }
  catch {
    // CMS 不可用时使用本地 catalog
  }

  return fallbackCatalog as ProductCatalog
}

function buildPageSection(domain: string, path: string, title: string, summary: string): string {
  return [
    `### ${title}`,
    `- URL: ${absoluteUrl(domain, path)}`,
    `- Summary: ${summary}`,
  ].join('\n')
}

export async function buildLlmsFullContents(
  domain: string,
  title: string,
  description: string,
): Promise<string[]> {
  const catalog = await loadCatalog()
  const categorySlugs = await fetchCategorySlugs()
  const contents: string[] = [
    `# ${title}`,
    `> ${description}`,
    [
      '## Site Information',
      `- Canonical domain: ${domain.replace(/\/$/, '')}`,
      '- Languages: English (default), zh-CN, zh-TW',
      `- Total products: ${catalog.totalProducts ?? catalog.products?.length ?? 0}`,
      `- Product categories: ${categorySlugs.length}`,
    ].join('\n'),
    [
      '## Main Pages (English)',
      ...STATIC_SITEMAP_PATHS.map(path => buildPageSection(
        domain,
        path,
        PAGE_LABELS[path] || path,
        PAGE_SUMMARIES[path] || 'Site page.',
      )),
    ].join('\n\n'),
  ]

  for (const { code, prefix } of SITE_LOCALES) {
    if (!prefix) {
      continue
    }
    contents.push([
      `## ${code} Pages`,
      ...STATIC_SITEMAP_PATHS.map(path => buildPageSection(
        domain,
        localePath(prefix, path),
        `${code} — ${PAGE_LABELS[path] || path}`,
        PAGE_SUMMARIES[path] || 'Localized site page.',
      )),
    ].join('\n\n'))
  }

  const productsBySlug = new Map<string, string[]>()
  for (const product of catalog.products ?? []) {
    const slug = product.categorySlug?.trim()
    const name = product.name?.trim()
    if (!slug || !name) {
      continue
    }
    const list = productsBySlug.get(slug) ?? []
    if (list.length < 12) {
      list.push(name)
      productsBySlug.set(slug, list)
    }
  }

  const categorySections = categorySlugs.map((slug) => {
    const category = catalog.categories?.find(c => c.slug === slug)
    const names = productsBySlug.get(slug) ?? []
    const lines = [
      `### ${category?.name || slug}`,
      `- URL: ${absoluteUrl(domain, `/${slug}`)}`,
      `- Product count: ${category?.count ?? names.length}`,
    ]
    if (names.length) {
      lines.push('- Sample products:')
      for (const name of names) {
        lines.push(`  - ${name}`)
      }
    }
    return lines.join('\n')
  })

  if (categorySections.length) {
    contents.push(['## Product Categories', ...categorySections].join('\n\n'))
  }

  contents.push([
    '## Related Files',
    `- llms.txt: ${absoluteUrl(domain, '/llms.txt')}`,
    `- Sitemap: ${absoluteUrl(domain, '/sitemap.xml')}`,
  ].join('\n'))

  return contents
}
