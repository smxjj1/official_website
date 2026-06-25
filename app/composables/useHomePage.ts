import productsData from '~/data/products.json'
import { useCategoryImages } from '~/composables/useCategoryImages'

const HOME_CATEGORY_SLUGS = [
  'feeding-bottles',
  'water-cups',
  'baby-tableware',
  'bath-potty',
  'milk-container',
  'accessories',
] as const

const CATEGORY_ROUTE_MAP: Record<string, string> = {
  'feeding-bottles': '/baby-feeding-bottles',
  'water-cups': '/baby-sippy-cups',
  'baby-tableware': '/baby-tableware',
  'bath-potty': '/baby-bath-potty',
  'milk-container': '/baby-milk-powder-container',
  'accessories': '/other-accessory',
}

const CATEGORY_PRODUCT_SLUG_MAP: Record<string, string> = {
  'feeding-bottles': 'baby-feeding-bottles',
  'water-cups': 'baby-sippy-cups',
  'baby-tableware': 'baby-tableware',
  'bath-potty': 'baby-bath-potty',
  'milk-container': 'baby-milk-powder-container',
  'accessories': 'other-accessory',
}

const CATEGORY_DESC_KEYS: Record<string, string> = {
  'feeding-bottles': 'products.feedingBottles.description',
  'water-cups': 'products.sippyCups.description',
  'baby-tableware': 'products.tableware.description',
  'bath-potty': 'products.bathPotty.description',
  'milk-container': 'products.milkPowderContainer.description',
  'accessories': 'products.accessories.description',
}

const LAYOUT_TYPES = ['left', 'right', 'left', 'center', 'right', 'left']
const GRID_STYLES = ['a', 'b', 'a', 'c', 'b', 'a']

export function useHomePage() {
  const { $t, getLocalePath } = useI18n()
  const { getAllCategoryImages } = useCategoryImages()

  const categories = computed(() => getAllCategoryImages.value)

  const productCountMap = computed(() => {
    const map: Record<string, number> = {}
    for (const cat of productsData.categories) {
      map[cat.slug] = cat.count
    }
    return map
  })

  const totalProducts = computed(() => productsData.totalProducts)

  const getCategoryLink = (slug: string): string => {
    return CATEGORY_ROUTE_MAP[slug] || '/other-accessory'
  }

  const getCategoryProductCount = (slug: string): number => {
    const productSlug = CATEGORY_PRODUCT_SLUG_MAP[slug]
    return productCountMap.value[productSlug] ?? 0
  }

  const getCategoryDescription = (slug: string): string => {
    const key = CATEGORY_DESC_KEYS[slug]
    return key ? ($t(key) as string) : 'Quality baby products designed with care.'
  }

  const getCategoryLabel = (index: number): string => {
    return String(index + 1).padStart(2, '0')
  }

  const getLayoutType = (index: number): string => {
    return LAYOUT_TYPES[index] || 'left'
  }

  const getGridStyle = (index: number): string => {
    return GRID_STYLES[index] || 'a'
  }

  return {
    HOME_CATEGORY_SLUGS,
    categories,
    totalProducts,
    getCategoryLink,
    getCategoryProductCount,
    getCategoryDescription,
    getCategoryLabel,
    getLayoutType,
    getGridStyle,
    getLocalePath,
  }
}
