/**
 * 从 analytics CMS 拉取产品目录；API 不可用时回退到本地 products.json
 */
import fallbackOya from '~/data/products.json'

type OyaCatalog = typeof fallbackOya
type OyaProduct = OyaCatalog['products'][number]
type OyaCategory = OyaCatalog['categories'][number]

interface CatalogResponse {
  generatedAt?: string
  totalProducts?: number
  categories?: OyaCategory[]
  products?: OyaProduct[]
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

  const fromCms = computed(() => !error.value && (data.value?.products?.length ?? 0) > 0)

  const products = computed<OyaProduct[]>(() => {
    if (fromCms.value) {
      return data.value!.products as OyaProduct[]
    }
    const list = fallbackOya.products as OyaProduct[]
    if (slugRef.value) {
      return list.filter(p => p.categorySlug === slugRef.value)
    }
    return list
  })

  const categories = computed<OyaCategory[]>(() => {
    if (fromCms.value && data.value?.categories?.length) {
      return data.value.categories as OyaCategory[]
    }
    return fallbackOya.categories as OyaCategory[]
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
