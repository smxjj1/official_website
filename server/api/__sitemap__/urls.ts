import type { SitemapUrlInput } from '#sitemap/types'
import { defineSitemapEventHandler } from '#imports'
import {
  buildHreflangAlternatives,
  fetchCategorySlugs,
  localePath,
  SITE_LOCALES,
  STATIC_SITEMAP_PATHS,
} from '../../../shared/seo/rendering'
import { buildProductPath } from '../../../shared/seo/productSlug'

async function fetchBlogSlugs(siteKey: string, cmsApi: string, locale: string): Promise<string[]> {
  try {
    const params = new URLSearchParams({ site_key: siteKey, locale })
    const res = await fetch(`${cmsApi.replace(/\/$/, '')}/blog?${params.toString()}`)
    if (!res.ok)
      return []
    const json = await res.json() as { success?: boolean; data?: { slug?: string }[] }
    if (!json.success || !Array.isArray(json.data))
      return []
    return [...new Set(
      json.data
        .map(item => item.slug?.trim())
        .filter((slug): slug is string => !!slug),
    )]
  }
  catch {
    return []
  }
}

async function fetchProductPaths(siteKey: string, cmsApi: string): Promise<string[]> {
  try {
    const res = await fetch(`${cmsApi.replace(/\/$/, '')}/products?site_key=${encodeURIComponent(siteKey)}`)
    if (!res.ok)
      return []
    const json = await res.json() as {
      products?: { itemNo?: string; name?: string; categorySlug?: string }[]
    }
    const paths: string[] = []
    for (const product of json.products || []) {
      const path = buildProductPath(
        product.categorySlug || '',
        product.itemNo || '',
        product.name || '',
      )
      if (path)
        paths.push(path)
    }
    return [...new Set(paths)]
  }
  catch {
    return []
  }
}

export default defineSitemapEventHandler(async () => {
  const config = useRuntimeConfig()
  const siteUrl = String(config.public.siteUrl || 'https://oyababies.com')
  const siteKey = String(config.public.cmsSiteKey || 'oyababies.com')
  const cmsApi = String(config.public.cmsApi || 'https://analytics.oyababies.com/api/public')

  const categorySlugs = await fetchCategorySlugs({ siteKey, cmsApi })
  const productPaths = await fetchProductPaths(siteKey, cmsApi)
  const urls: SitemapUrlInput[] = []

  for (const { prefix, code } of SITE_LOCALES) {
    for (const page of STATIC_SITEMAP_PATHS) {
      urls.push({
        loc: localePath(prefix, page),
        alternatives: buildHreflangAlternatives(page, siteUrl),
        changefreq: page === '/news' || page === '/blog' ? 'weekly' : 'monthly',
        priority: page === '/' ? 1 : 0.8,
      })
    }

    for (const slug of categorySlugs) {
      urls.push({
        loc: localePath(prefix, slug),
        alternatives: buildHreflangAlternatives(`/${slug}`, siteUrl),
        changefreq: 'weekly',
        priority: 0.9,
      })
    }

    for (const path of productPaths) {
      urls.push({
        loc: localePath(prefix, path),
        alternatives: buildHreflangAlternatives(path, siteUrl),
        changefreq: 'weekly',
        priority: 0.7,
      })
    }

    const blogSlugs = await fetchBlogSlugs(siteKey, cmsApi, code)
    for (const slug of blogSlugs) {
      const path = `/blog/${slug}`
      urls.push({
        loc: localePath(prefix, path),
        alternatives: buildHreflangAlternatives(path, siteUrl),
        changefreq: 'weekly',
        priority: 0.7,
      })
    }
  }

  return urls
})
