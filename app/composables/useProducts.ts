/**
 * 从 analytics CMS 拉取产品目录；API 不可用时回退到本地 products.json（异步 chunk，不进入首屏 entry）
 */

type OyaProduct = {
  categorySlug?: string
  [key: string]: unknown
}

export interface CatalogCategory {
  name: string
  slug: string
  count?: number
  sortOrder?: number
  subcategories?: string[]
  pageRoute?: string | null
  nameI18n?: Record<string, string> | null
}

type OyaCategory = CatalogCategory

interface CatalogResponse {
  generatedAt?: string
  totalProducts?: number
  categories?: OyaCategory[]
  products?: OyaProduct[]
}

interface FallbackCatalog {
  products: OyaProduct[]
  categories: OyaCategory[]
}

let fallbackPromise: Promise<FallbackCatalog> | null = null

function loadFallbackCatalog() {
  if (!fallbackPromise) {
    fallbackPromise = import('~/data/products.json').then(mod => mod.default as FallbackCatalog)
  }
  return fallbackPromise
}

function resolveCategorySlug(input?: string | Ref<string | undefined>): string | undefined {
  if (!input) return undefined
  if (typeof input === 'string') {
    const trimmed = input.trim()
    return trimmed && trimmed !== 'all' ? trimmed : undefined
  }
  const value = input.value?.trim()
  return value && value !== 'all' ? value : undefined
}

export function useProductCatalog(categorySlug?: string | Ref<string | undefined>) {
  const config = useRuntimeConfig()
  const siteKey = (config.public.cmsSiteKey as string) || 'oyababies.com'
  const cmsApi = ((config.public.cmsApi as string) || 'https://analytics.oyababies.com/api/public').replace(/\/$/, '')

  const slugRef = computed(() => resolveCategorySlug(categorySlug))

  const query = computed(() => {
    const q: Record<string, string> = { site_key: siteKey }
    if (slugRef.value) {
      q.categorySlug = slugRef.value
    }
    return q
  })

  const fetchKey = computed(() => `products-${siteKey}-${slugRef.value ?? 'all'}`)

  const { data, error, pending, refresh } = useFetch<CatalogResponse>(() => `${cmsApi}/products`, {
    query,
    key: fetchKey,
  })

  const fallbackCatalog = ref<FallbackCatalog | null>(null)

  watch([data, error], async () => {
    const hasCmsProducts = !error.value && (data.value?.products?.length ?? 0) > 0
    if (!hasCmsProducts && !fallbackCatalog.value)
      fallbackCatalog.value = await loadFallbackCatalog()
  }, { immediate: true })

  const fromCms = computed(() => !error.value && (data.value?.products?.length ?? 0) > 0)

  const products = computed<OyaProduct[]>(() => {
    if (fromCms.value) {
      return data.value!.products as OyaProduct[]
    }
    const list = fallbackCatalog.value?.products ?? []
    if (slugRef.value) {
      return list.filter(p => p.categorySlug === slugRef.value)
    }
    return list
  })

  const categories = computed<OyaCategory[]>(() => {
    let list: OyaCategory[]
    if (fromCms.value && data.value?.categories?.length) {
      list = data.value.categories as OyaCategory[]
    }
    else {
      list = fallbackCatalog.value?.categories ?? []
    }
    return [...list].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
  })

  const totalProducts = computed(() => products.value.length)

  return {
    products,
    categories,
    totalProducts,
    error,
    pending,
    fromCms,
    refresh,
  }
}

/** @deprecated 使用 useProductCatalog */
export function useProducts(categorySlug: string) {
  return useProductCatalog(categorySlug)
}
