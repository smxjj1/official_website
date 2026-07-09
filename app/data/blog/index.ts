import type { BlogArticle, BlogDataModule } from './types'
import { blogEn } from './en'
import { blogZhCN } from './zh-CN'
import { blogZhTW } from './zh-TW'

export type { BlogArticle, BlogDataModule } from './types'

const blogByLocale: Record<string, BlogArticle[]> = {
  en: blogEn,
  'zh-CN': blogZhCN,
  'zh-TW': blogZhTW,
}

const localeMap: Record<string, string> = {
  en: 'en',
  'zh-CN': 'zh-CN',
  'zh-TW': 'zh-TW',
  zhCN: 'zh-CN',
  zhTW: 'zh-TW',
}

export function getBlogData(locale: string): BlogArticle[] {
  const mapped = localeMap[locale] || 'en'
  return blogByLocale[mapped] || []
}

export function getBlogArticleBySlug(slug: string, locale: string): BlogArticle | null {
  return getBlogData(locale).find(a => a.slug === slug) || null
}

export function getRelatedArticles(
  slug: string,
  category: string,
  locale: string,
  limit = 3,
): BlogArticle[] {
  return getBlogData(locale)
    .filter(a => a.category === category && a.slug !== slug)
    .slice(0, limit)
}
