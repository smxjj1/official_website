export interface CmsCategoryMeta {
  name: string
  slug: string
  count?: number
  sortOrder?: number
  subcategories?: string[]
  pageRoute?: string | null
  nameI18n?: Record<string, string> | null
}

/** 分类页路径：与 pages/[categorySlug].vue 一致，固定为 /{slug} */
export function resolveCategoryPath(category: Pick<CmsCategoryMeta, 'slug' | 'pageRoute'>): string {
  return `/${category.slug}`
}

const GENERAL_KEY = 'General'

export function normalizeSubcategoryKey(subcategory: string): string {
  const trimmed = subcategory?.trim()
  return trimmed || GENERAL_KEY
}

/** 按 CMS 白名单顺序排列子分类组（未列出的排在后面，General 最后） */
export function sortSubcategoryKeys(keys: string[], preferredOrder: string[] = []): string[] {
  const unique = [...new Set(keys)]
  const order = preferredOrder.filter(Boolean)
  const result: string[] = []
  const seen = new Set<string>()

  for (const sub of order) {
    if (unique.includes(sub)) {
      result.push(sub)
      seen.add(sub)
    }
  }

  const rest = unique.filter(k => k !== GENERAL_KEY && !seen.has(k)).sort()
  result.push(...rest)

  if (unique.includes(GENERAL_KEY)) {
    result.push(GENERAL_KEY)
  }

  return result
}
