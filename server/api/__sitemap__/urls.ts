import type { SitemapUrlInput } from '#sitemap/types'
import { defineSitemapEventHandler } from '#imports'
import {
  buildHreflangAlternatives,
  fetchCategorySlugs,
  localePath,
  SITE_LOCALES,
  STATIC_SITEMAP_PATHS,
} from '../../../shared/seo/rendering'

export default defineSitemapEventHandler(async () => {
  const config = useRuntimeConfig()
  const siteUrl = String(config.public.siteUrl || 'https://oyababies.com')
  const siteKey = String(config.public.cmsSiteKey || 'oyababies.com')
  const cmsApi = String(config.public.cmsApi || 'https://analytics.oyababies.com/api/public')

  const categorySlugs = await fetchCategorySlugs({ siteKey, cmsApi })
  const urls: SitemapUrlInput[] = []

  for (const { prefix } of SITE_LOCALES) {
    for (const page of STATIC_SITEMAP_PATHS) {
      urls.push({
        loc: localePath(prefix, page),
        alternatives: buildHreflangAlternatives(page, siteUrl),
        changefreq: page === '/news' ? 'weekly' : 'monthly',
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
  }

  return urls
})
