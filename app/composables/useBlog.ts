/**
 * 浠?analytics CMS 鎷夊彇鍗氬锛汚PI 涓嶅彲鐢ㄦ垨鏃犳暟鎹椂鍥為€€鍒版湰鍦?app/data/blog
 */
import type { BlogArticle } from '~/data/blog/types'
import {
  getBlogData,
  getBlogArticleBySlug,
} from '~/data/blog'

export type { BlogArticle }

interface PublicBlogResponse {
  success: boolean
  data: BlogArticle | BlogArticle[]
  error?: string
}

const localeMap: Record<string, string> = {
  en: 'en',
  'zh-CN': 'zh-CN',
  'zh-TW': 'zh-TW',
  zhCN: 'zh-CN',
  zhTW: 'zh-TW',
}

function normalizeLocale(locale: string): string {
  return localeMap[locale] || 'en'
}

function normalizeArticle(raw: BlogArticle, mediaBase: string): BlogArticle {
  const tags = Array.isArray(raw.tags)
    ? raw.tags.map(t => String(t).trim()).filter(Boolean)
    : []

  let coverImage = raw.coverImage || undefined
  if (coverImage) {
    if (coverImage.startsWith('http://') || coverImage.startsWith('https://')) {
      // absolute CMS / CDN URL
    }
    else if (coverImage.startsWith('/images/')) {
      // local static asset
    }
    else if (coverImage.startsWith('/media/')) {
      coverImage = `${mediaBase.replace(/\/media\/?$/, '')}${coverImage}`
    }
    else if (!coverImage.startsWith('/')) {
      coverImage = `${mediaBase.replace(/\/$/, '')}/${coverImage}`
    }
  }

  return {
    slug: raw.slug,
    title: raw.title,
    publishDate: (raw.publishDate || '').slice(0, 10),
    category: raw.category,
    tags,
    summary: raw.summary || '',
    content: raw.content || '',
    coverImage,
    author: raw.author,
    viewCount: raw.viewCount,
  }
}

function pickRelatedArticles(
  article: BlogArticle,
  list: BlogArticle[],
  limit = 6,
): BlogArticle[] {
  const others = list.filter(a => a.slug !== article.slug)
  if (!others.length)
    return []

  const dedupe = (items: BlogArticle[]) => {
    const seen = new Set<string>()
    return items.filter((item) => {
      if (seen.has(item.slug))
        return false
      seen.add(item.slug)
      return true
    })
  }

  // Pillar锛氳嚜鍔ㄥ垪鍑哄悇 Cluster锛堥潪 pillar锛夛紝鍐嶈ˉ鍏朵粬 Pillar
  if (article.category === 'pillar') {
    const clusters = others.filter(a => a.category !== 'pillar')
    const otherPillars = others.filter(a => a.category === 'pillar')
    return dedupe([...clusters, ...otherPillars]).slice(0, limit)
  }

  // Cluster / 鏅€氭枃锛氬悓鍒嗙被 鈫?Pillar 鍥為摼 鈫?鍏朵粬
  const sameCategory = others.filter(a => a.category === article.category)
  const pillars = others.filter(a => a.category === 'pillar')
  const rest = others.filter(
    a => a.category !== article.category && a.category !== 'pillar',
  )
  return dedupe([...sameCategory, ...pillars, ...rest]).slice(0, limit)
}

export function useBlog() {
  const config = useRuntimeConfig()
  const siteKey = (config.public.cmsSiteKey as string) || 'oyababies.com'
  const cmsApi = ((config.public.cmsApi as string) || 'https://analytics.oyababies.com/api/public').replace(/\/$/, '')
  const mediaBase = ((config.public.cmsMediaBase as string) || 'https://analytics.oyababies.com/media').replace(/\/$/, '')

  async function fetchBlogList(locale: string, category?: string): Promise<BlogArticle[]> {
    const mappedLocale = normalizeLocale(locale)

    // CMS 鎴愬姛鍝嶅簲锛堝惈绌哄垪琛級浠?CMS 涓哄噯锛氬悗鍙伴殣钘?涓嬫灦鍚庡墠鍙板簲涓嶆樉绀猴紝涓嶅啀鍥為€€鏈湴闈欐€佺
    if (cmsApi && siteKey) {
      try {
        const params = new URLSearchParams({
          site_key: siteKey,
          locale: mappedLocale,
        })
        if (category)
          params.set('category', category)

        const res = await $fetch<PublicBlogResponse>(`${cmsApi}/blog?${params.toString()}`)
        if (res.success) {
          const list = Array.isArray(res.data) ? res.data : []
          return list.map(item => normalizeArticle(item, mediaBase))
        }
      }
      catch (err) {
        if (import.meta.dev)
          console.error('[useBlog] fetchBlogList failed, fallback to local', err)
      }
    }

    const local = getBlogData(mappedLocale)
    if (category)
      return local.filter(a => a.category === category)
    return local
  }

  async function fetchBlogBySlug(slug: string, locale: string): Promise<BlogArticle | null> {
    const mappedLocale = normalizeLocale(locale)

    if (cmsApi && siteKey && slug) {
      try {
        const params = new URLSearchParams({
          site_key: siteKey,
          locale: mappedLocale,
        })
        const res = await $fetch<PublicBlogResponse>(
          `${cmsApi}/blog/${encodeURIComponent(slug)}?${params.toString()}`,
        )
        if (res.success && res.data && !Array.isArray(res.data)) {
          return normalizeArticle(res.data, mediaBase)
        }
        // CMS 鏄庣‘鏃犳鏂囷紙鎴栨湭鍙戝竷锛夆啋 涓嶅洖閫€鏈湴
        return null
      }
      catch (err: unknown) {
        const status = (err as { statusCode?: number; status?: number })?.statusCode
          ?? (err as { status?: number })?.status
        // 404 = 鍚庡彴宸查殣钘?涓嶅瓨鍦紝涓嶅洖閫€鏈湴
        if (status === 404)
          return null
        if (import.meta.dev)
          console.error('[useBlog] fetchBlogBySlug failed, fallback to local', err)
      }
    }

    return getBlogArticleBySlug(slug, mappedLocale)
  }

  async function fetchBlogDetail(
    slug: string,
    locale: string,
    relatedLimit = 6,
  ): Promise<{ article: BlogArticle | null; relatedArticles: BlogArticle[] }> {
    const mappedLocale = normalizeLocale(locale)
    const article = await fetchBlogBySlug(slug, mappedLocale)

    if (!article) {
      return { article: null, relatedArticles: [] }
    }

    const list = await fetchBlogList(mappedLocale)
    const related = pickRelatedArticles(article, list, relatedLimit)
    if (related.length > 0)
      return { article, relatedArticles: related }

    // API 鍒楄〃涓虹┖鏃讹紝鐢ㄦ湰鍦?helper锛堝悓鏍疯蛋澧炲己閫昏緫锛?    return {
      article,
      relatedArticles: pickRelatedArticles(
        article,
        getBlogData(mappedLocale),
        relatedLimit,
      ),
    }
  }

  return {
    fetchBlogList,
    fetchBlogBySlug,
    fetchBlogDetail,
    pickRelatedArticles,
  }
}
