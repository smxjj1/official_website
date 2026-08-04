<template>
  <div class="category-page">
    <!-- Hero Section -->
    <section class="category-hero">
      <div class="hero-container">
        <h1 class="hero-title">{{ pageTitle }}</h1>
        <p class="hero-subtitle">{{ pageDescription }}</p>
        <div class="hero-stats">
          <span class="stat">{{ $t('products.productCount', { count: totalProducts }) }}</span>
        </div>
      </div>
    </section>

    <!-- Product Grid -->
    <section class="product-grid-section">
      <div class="grid-layout">
        <!-- Left Anchor Navigation (only show when multiple subcategories) -->
        <nav v-if="groupedProducts.length > 1" class="anchor-nav">
          <button
            v-for="(group, index) in groupedProducts"
            :key="group.subcategory"
            class="anchor-link"
            :class="{ active: activeAnchor === index }"
            @click="scrollToAnchor(index)"
          >
            {{ group.subcategory }}
          </button>
        </nav>

        <!-- Main Content -->
        <div class="grid-container">
          <!-- Group by subcategory with separators -->
          <template v-if="groupedProducts.length > 0">
            <div
              v-for="(group, groupIndex) in groupedProducts"
              :key="group.subcategory"
              :id="`anchor-${groupIndex}`"
              class="subcategory-group"
            >
              <!-- Separator line between groups -->
              <div v-if="groupIndex > 0" class="subcategory-separator"></div>

              <!-- Subcategory header -->
              <div v-if="group.subcategory" class="subcategory-header">
                <h3 class="subcategory-title">{{ group.subcategory }}</h3>
                <span class="subcategory-count">{{ $t('products.itemsCount', { count: group.products.length }) }}</span>
              </div>

              <!-- Product Grid -->
              <div class="product-grid">
                <NuxtLink
                  v-for="product in group.products"
                  :key="product.id"
                  :to="getLocalePath(buildProductPath(product.categorySlug, product.itemNo, product.name))"
                  class="product-card"
                >
                  <div class="card-image">
                    <OptimImg
                      v-if="product.mainImage"
                      :src="product.mainImage"
                      :alt="product.name"
                      loading="lazy"
                    />
                    <div v-if="!product.mainImage" class="card-placeholder">
                      <span>{{ product.itemNo.charAt(0) }}</span>
                    </div>
                  </div>
                  <div class="card-body">
                    <h3 class="card-name">{{ product.name }}</h3>
                    <div class="card-meta">
                      <span v-if="product.capacity" class="meta-item">{{ product.capacity }}</span>
                      <span v-if="product.material" class="meta-item">{{ product.material }}</span>
                    </div>
                    <p class="card-item-no">{{ product.itemNo }}</p>
                  </div>
                </NuxtLink>
              </div>
            </div>
          </template>

          <!-- Empty State -->
          <div v-else class="empty-state">
            <div class="empty-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
            </div>
            <h3>{{ $t('products.comingSoon') }}</h3>
            <p>{{ $t('products.comingSoonText') }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Back to Top Button -->
    <Transition name="fade">
      <button
        v-if="showBackToTop"
        class="back-to-top"
        @click="scrollToTop"
        aria-label="Back to top"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="18 15 12 9 6 15"/>
        </svg>
      </button>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { normalizeSubcategoryKey, sortSubcategoryKeys } from '~/utils/productCategory'
import { buildProductPath } from '~/utils/productSlug'
import { useProductCatalog } from '~/composables/useProducts'

const props = defineProps<{
  categorySlug: string
  pageTitle: string
  pageDescription: string
  /** CMS 瀛愬垎绫荤櫧鍚嶅崟椤哄簭锛堝彲閫夛級 */
  subcategoryOrder?: string[]
}>()

definePageMeta({
  layout: 'default',
})

const { $t, getLocalePath } = useSiteLocale()

const categorySlugRef = toRef(props, 'categorySlug')
const { products: allProducts, totalProducts, categories: catalogCategories } = useProductCatalog(categorySlugRef)

interface ProductSpecs {
  pcsPerCtn: number | null
  nw: number | null
  gw: number | null
  ctnSize: string | null
  length: number | null
  width: number | null
  height: number | null
  pcs20gp: number | null
  pcs40hq: number | null
  moq: number | null
  hsCode: string | null
  remark: string | null
}

interface Product {
  id: number
  itemNo: string
  name: string
  description: string
  material: string
  capacity: string
  subcategory: string
  category: string
  categorySlug: string
  mainImage: string
  gallery: string[]
  images: string[]
  specs: ProductSpecs
}

useSeo({
  title: `${props.pageTitle} | Huangyan Oya Plastic Factory`,
  description: props.pageDescription,
})

// Map subcategory names to i18n keys
const getSubcategoryKey = (subcategory: string): string => {
  const keyMap: Record<string, string> = {
    'Feeding Bottle- Glass': 'products.subcategories.feedingBottleGlass',
    'Feeding Bottle- Others': 'products.subcategories.feedingBottleOthers',
    'Feeding Bottle- PP': 'products.subcategories.feedingBottlePP',
    'Feeding Bottle- PPSU': 'products.subcategories.feedingBottlePPSU',
    'Feeding Bottle- Tritan': 'products.subcategories.feedingBottleTritan',
    'Feeding bottle set': 'products.subcategories.feedingBottleSet',
    'Sippy Cup- Others': 'products.subcategories.sippyCupOthers',
    'Sippy Cup- PP': 'products.subcategories.sippyCupPP',
    'Sippy Cup- Tritan': 'products.subcategories.sippyCupTritan',
    'Feeding Bowl Sets': 'products.subcategories.feedingBowlSets',
    'Tableware set': 'products.subcategories.tablewareSet',
    'Spoons': 'products.subcategories.spoons',
    'Potty & Bath Tub': 'products.subcategories.pottyBathTub',
    'Milk Powder Box': 'products.subcategories.milkPowderBox',
    'Breast Pump': 'products.subcategories.breastPump',
    'Pacifiers': 'products.subcategories.pacifiers',
    'Teethers': 'products.subcategories.teethers',
    'Brush': 'products.subcategories.brush',
    'Auxilaries- Others': 'products.subcategories.auxilariesOthers',
    'General': 'products.subcategories.general',
  }
  return keyMap[subcategory] || ''
}

/** 瀛愬垎绫诲睍绀哄悕锛氫紭鍏?i18n锛屽惁鍒欑敤 CMS 鍘熷鍚嶇О */
const getSubcategoryDisplay = (subcategory: string): string => {
  if (subcategory === 'General') {
    return $t('products.subcategories.general') as string
  }
  const key = getSubcategoryKey(subcategory)
  if (key) {
    return $t(key) as string
  }
  return subcategory
}

const subcategoryOrderList = computed(() => {
  if (Array.isArray(props.subcategoryOrder) && props.subcategoryOrder.length) {
    return props.subcategoryOrder
  }
  const cat = catalogCategories.value.find(c => c.slug === props.categorySlug)
  const subs = (cat as { subcategories?: string[] } | undefined)?.subcategories
  return Array.isArray(subs) ? subs : []
})

// Group products by subcategory
const groupedProducts = computed(() => {
  const groupMap = new Map<string, Product[]>()

  for (const product of allProducts.value) {
    const subcat = normalizeSubcategoryKey(product.subcategory)
    if (!groupMap.has(subcat)) {
      groupMap.set(subcat, [])
    }
    groupMap.get(subcat)!.push(product)
  }

  const orderedKeys = sortSubcategoryKeys([...groupMap.keys()], subcategoryOrderList.value)
  return orderedKeys.map((subcategory) => ({
    subcategory: getSubcategoryDisplay(subcategory),
    subcategoryKey: subcategory,
    products: groupMap.get(subcategory)!,
  }))
})

const activeAnchor = ref(0)
const showBackToTop = ref(false)
let scrollObserver: IntersectionObserver | null = null

// Scroll to anchor
const scrollToAnchor = (index: number) => {
  activeAnchor.value = index
  const element = document.getElementById(`anchor-${index}`)
  if (element) {
    const headerOffset = 80
    const elementPosition = element.getBoundingClientRect().top
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    })
  }
}

// Scroll to top
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

// Handle scroll for back-to-top button
const handleScroll = () => {
  showBackToTop.value = window.pageYOffset > 300
}

// Setup scroll observer for auto-highlighting
const setupScrollObserver = () => {
  if (groupedProducts.value.length <= 1) return

  if (scrollObserver) {
    scrollObserver.disconnect()
  }

  scrollObserver = new IntersectionObserver(
    (entries) => {
      const visibleEntries = entries.filter(entry => entry.isIntersecting)
      if (visibleEntries.length > 0) {
        visibleEntries.sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        const mostVisible = visibleEntries[0]
        const anchorIndex = parseInt(mostVisible.target.id.replace('anchor-', ''))
        if (!isNaN(anchorIndex)) {
          activeAnchor.value = anchorIndex
        }
      }
    },
    {
      root: null,
      rootMargin: '-100px 0px -30% 0px',
      threshold: [0, 0.25, 0.5],
    }
  )

  groupedProducts.value.forEach((_, index) => {
    const element = document.getElementById(`anchor-${index}`)
    if (element && scrollObserver) {
      scrollObserver.observe(element)
    }
  })
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  nextTick(() => {
    setupScrollObserver()
  })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  if (scrollObserver) {
    scrollObserver.disconnect()
  }
})
</script>

<style lang="less" scoped>
@import '~/assets/css/variables.less';

.category-page {
  background: @background-color;
  min-height: 100vh;
}

.category-hero {
  background: @card-background;
  padding: @spacing-xxl @spacing-md;
  text-align: center;
  border-bottom: 1px solid @border-color;

  @media (max-width: @breakpoint-tablet) {
    padding: @spacing-xl @spacing-sm;
  }
}

.hero-container {
  max-width: @breakpoint-desktop;
  margin: 0 auto;
}

.hero-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: @text-color;
  margin: 0 0 @spacing-sm;
  letter-spacing: -0.02em;

  @media (max-width: @breakpoint-tablet) {
    font-size: 1.75rem;
  }
}

.hero-subtitle {
  font-size: 1.1rem;
  color: @text-light;
  margin: 0 0 @spacing-md;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
}

.hero-stats {
  display: flex;
  justify-content: center;
  gap: @spacing-md;
}

.stat {
  font-size: 0.9rem;
  color: @secondary-color;
  padding: @spacing-xs @spacing-md;
  background: @background-color;
  border-radius: 2rem;
}

.product-grid-section {
  padding: @spacing-xxl @spacing-md;

  @media (max-width: @breakpoint-tablet) {
    padding: @spacing-xl @spacing-sm;
  }
}

.grid-layout {
  max-width: @breakpoint-wide;
  margin: 0 auto;
  display: flex;
  gap: @spacing-xl;
  position: relative;
}

// Anchor Navigation
.anchor-nav {
  position: sticky;
  top: 80px;
  flex-shrink: 0;
  width: 160px;
  display: flex;
  flex-direction: column;
  gap: @spacing-xs;
  align-self: flex-start;

  @media (max-width: @breakpoint-tablet) {
    display: none;
  }
}

.anchor-link {
  display: block;
  width: 100%;
  padding: @spacing-sm @spacing-md;
  background: transparent;
  border: none;
  border-left: 3px solid transparent;
  text-align: left;
  font-size: 0.85rem;
  color: @text-light;
  cursor: pointer;
  transition: all @transition-fast;
  border-radius: 0 @radius-sm @radius-sm 0;
  word-break: normal;
  overflow-wrap: break-word;
  hyphens: manual;
  line-height: 1.4;

  &:hover {
    color: @primary-color;
    background: rgba(@primary-color, 0.05);
  }

  &.active {
    color: @primary-color;
    border-left-color: @primary-color;
    background: rgba(@primary-color, 0.08);
    font-weight: 600;
  }
}

.grid-container {
  flex: 1;
  min-width: 0;
}

.subcategory-group {
  margin-bottom: @spacing-xl;
}

.subcategory-separator {
  height: 1px;
  background: @border-color;
  margin: @spacing-xl 0;
}

.subcategory-header {
  display: flex;
  align-items: baseline;
  gap: @spacing-md;
  margin-bottom: @spacing-lg;
}

.subcategory-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: @text-color;
  margin: 0;
}

.subcategory-count {
  font-size: 0.875rem;
  color: @text-light;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: @spacing-lg;

  @media (max-width: @breakpoint-desktop) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: @breakpoint-tablet) {
    grid-template-columns: repeat(2, 1fr);
    gap: @spacing-md;
  }

  @media (max-width: @breakpoint-mobile) {
    grid-template-columns: 1fr;
  }
}

.product-card {
  background: @card-background;
  border-radius: @radius-md;
  overflow: hidden;
  cursor: pointer;
  text-decoration: none;
  color: inherit;
  display: block;
  transition: transform @transition-fast, box-shadow @transition-fast;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  }
}

.card-image {
  position: relative;
  aspect-ratio: 1;
  background: @background-color;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform @transition-fast;
  }

  &:hover img {
    transform: scale(1.05);
  }
}

.card-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: @devide-background;

  span {
    font-size: 2rem;
    font-weight: 700;
    color: @primary-color;
    opacity: 0.3;
  }
}

.card-body {
  padding: @spacing-md;
}

.card-name {
  font-size: 0.9rem;
  font-weight: 600;
  color: @text-color;
  margin: 0 0 @spacing-xs;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-meta {
  display: flex;
  gap: @spacing-xs;
  margin-bottom: @spacing-xs;
}

.meta-item {
  font-size: 0.75rem;
  color: @secondary-color;
  padding: 2px 6px;
  background: @background-color;
  border-radius: @radius-sm;
}

.card-item-no {
  font-size: 0.8rem;
  color: @text-light;
  margin: 0;
}

.empty-state {
  text-align: center;
  padding: @spacing-xxl;
  background: @card-background;
  border-radius: @radius-md;

  .empty-icon {
    color: @secondary-color;
    margin-bottom: @spacing-md;
  }

  h3 {
    font-size: 1.5rem;
    font-weight: 600;
    color: @text-color;
    margin: 0 0 @spacing-sm;
  }

  p {
    color: @text-light;
    margin: 0;
    max-width: 400px;
    margin-left: auto;
    margin-right: auto;
  }
}

// Back to Top Button
.back-to-top {
  position: fixed;
  bottom: 40px;
  right: 40px;
  width: 48px;
  height: 48px;
  background: @primary-color;
  color: @card-background;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all @transition-fast;
  z-index: 900;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  }

  @media (max-width: @breakpoint-tablet) {
    bottom: 20px;
    right: 20px;
    width: 40px;
    height: 40px;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
