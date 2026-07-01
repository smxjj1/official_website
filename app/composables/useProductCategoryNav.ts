import type { CmsCategoryMeta } from '~/utils/productCategory'
import { resolveCategoryPath } from '~/utils/productCategory'
import { useProductCatalog } from '~/composables/useProducts'

/** 历史分类 slug → 导航 i18n key（有翻译则用，否则用 CMS name） */
const LEGACY_NAV_I18N: Record<string, string> = {
  'baby-feeding-bottles': 'nav.feedingBottles',
  'baby-sippy-cups': 'nav.sippyCups',
  'baby-tableware': 'nav.tableware',
  'baby-bath-potty': 'nav.bathPotty',
  'baby-milk-powder-container': 'nav.milkPowderBox',
  'other-accessory': 'nav.accessories',
}

/** 历史分类 slug → 页面 SEO i18n title key */
const LEGACY_TITLE_I18N: Record<string, string> = {
  'baby-feeding-bottles': 'products.feedingBottles.title',
  'baby-sippy-cups': 'products.sippyCups.title',
  'baby-tableware': 'products.tableware.title',
  'baby-bath-potty': 'products.bathPotty.title',
  'baby-milk-powder-container': 'products.milkPowderContainer.title',
  'other-accessory': 'products.accessories.title',
}

/** 历史分类 slug → 页面 SEO i18n description key */
const LEGACY_DESC_I18N: Record<string, string> = {
  'baby-feeding-bottles': 'products.feedingBottles.description',
  'baby-sippy-cups': 'products.sippyCups.description',
  'baby-tableware': 'products.tableware.description',
  'baby-bath-potty': 'products.bathPotty.description',
  'baby-milk-powder-container': 'products.milkPowderContainer.description',
  'other-accessory': 'products.accessories.description',
}

export interface ProductNavItem {
  slug: string
  path: string
  label: string
}

export function useProductCategoryNav() {
  const { $t, locale } = useI18n()
  const { categories, pending, fromCms, refresh } = useProductCatalog()

  const sortedCategories = computed(() =>
    [...categories.value].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)),
  )

  const navItems = computed<ProductNavItem[]>(() =>
    sortedCategories.value.map((cat) => ({
      slug: cat.slug,
      path: resolveCategoryPath(cat as CmsCategoryMeta),
      label: resolveCategoryNavLabel(cat as CmsCategoryMeta, $t as (k: string) => string, locale.value),
    })),
  )

  function findCategoryBySlug(slug: string) {
    return sortedCategories.value.find(c => c.slug === slug) as CmsCategoryMeta | undefined
  }

  function getCategoryPageTitle(slug: string): string {
    const cat = findCategoryBySlug(slug)
    const legacyKey = LEGACY_TITLE_I18N[slug]
    if (legacyKey) {
      return $t(legacyKey) as string
    }
    if (cat?.nameI18n?.[locale.value]) {
      return cat.nameI18n[locale.value]
    }
    if (locale.value === 'zh-TW' && cat?.nameI18n?.['zh-CN']) {
      return cat.nameI18n['zh-CN']
    }
    return cat?.name || slug
  }

  function getCategoryPageDescription(slug: string): string {
    const legacyKey = LEGACY_DESC_I18N[slug]
    if (legacyKey) {
      return $t(legacyKey) as string
    }
    const cat = findCategoryBySlug(slug)
    return cat?.name ? `${cat.name} — Huangyan Oya Plastic Factory` : 'Quality baby products designed with care.'
  }

  return {
    navItems,
    sortedCategories,
    pending,
    fromCms,
    refresh,
    findCategoryBySlug,
    getCategoryPageTitle,
    getCategoryPageDescription,
    resolveCategoryPath,
  }
}

function resolveCategoryNavLabel(
  cat: CmsCategoryMeta,
  t: (key: string) => string,
  localeCode: string,
): string {
  const legacyKey = LEGACY_NAV_I18N[cat.slug]
  if (legacyKey) {
    return t(legacyKey)
  }
  if (cat.nameI18n?.[localeCode]) {
    return cat.nameI18n[localeCode]
  }
  if (localeCode === 'zh-TW' && cat.nameI18n?.['zh-CN']) {
    return cat.nameI18n['zh-CN']
  }
  return cat.name
}
