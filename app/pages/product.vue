<template>
  <div class="product-page">
    <!-- Hero Section -->
    <section class="page-hero">
      <div class="hero-container">
        <h1 class="hero-title">Product Catalog</h1>
        <p class="hero-subtitle">
          Browse our complete catalog of baby products with detailed specifications
        </p>
        <div class="hero-stats">
          <span class="stat">{{ products.length }} Products</span>
          <span class="stat">{{ categories.length }} Categories</span>
        </div>
      </div>
    </section>

    <!-- Category Filter -->
    <section class="category-filter">
      <div class="filter-container">
        <button
          class="filter-btn"
          :class="{ active: activeCategory === 'all' }"
          @click="activeCategory = 'all'"
        >
          All
        </button>
        <button
          v-for="cat in categories"
          :key="cat.slug"
          class="filter-btn"
          :class="{ active: activeCategory === cat.slug }"
          @click="activeCategory = cat.slug"
        >
          {{ cat.name }}
          <span class="filter-count">{{ cat.count }}</span>
        </button>
      </div>
    </section>

    <!-- Search & Subcategory -->
    <section class="toolbar">
      <div class="toolbar-container">
        <div class="search-box">
          <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by item no. or name..."
            class="search-input"
          >
        </div>
        <div v-if="activeSubcategories.length > 1" class="subcategory-pills">
          <button
            class="pill"
            :class="{ active: activeSubcategory === '' }"
            @click="activeSubcategory = ''"
          >
            All
          </button>
          <button
            v-for="sub in activeSubcategories"
            :key="sub"
            class="pill"
            :class="{ active: activeSubcategory === sub }"
            @click="activeSubcategory = sub"
          >
            {{ sub }}
          </button>
        </div>
      </div>
    </section>

    <!-- Product Grid -->
    <section class="product-grid-section">
      <div class="grid-container">
        <p class="result-count">{{ filteredProducts.length }} products found</p>
        <div class="product-grid">
          <div
            v-for="product in filteredProducts"
            :key="product.id"
            class="product-card"
            @click="openDetail(product)"
          >
            <div class="card-image">
              <img
                v-if="product.images.length > 0"
                :src="product.images[0]"
                :alt="product.name"
                loading="lazy"
              >
              <img
                v-if="product.images.length > 1"
                :src="product.images[1]"
                :alt="product.name"
                class="card-image-hover"
                loading="lazy"
              >
              <div v-if="product.images.length === 0" class="card-placeholder">
                <span>{{ product.itemNo.charAt(0) }}</span>
              </div>
              <span class="card-badge">{{ product.subcategory }}</span>
            </div>
            <div class="card-body">
              <h3 class="card-name">{{ product.name }}</h3>
              <div class="card-meta">
                <span v-if="product.capacity" class="meta-item">{{ product.capacity }}</span>
                <span v-if="product.material" class="meta-item">{{ product.material }}</span>
              </div>
              <p class="card-item-no">{{ product.itemNo }}</p>
            </div>
          </div>
        </div>
        <div v-if="filteredProducts.length === 0" class="empty-state">
          <p>No products match your search</p>
        </div>
      </div>
    </section>

    <!-- Product Detail Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="detailOpen" class="modal-overlay" @click.self="closeDetail">
          <div class="modal-content">
            <!-- Close -->
            <button class="modal-close" @click="closeDetail" aria-label="Close">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>

            <div class="modal-body">
              <!-- Image Gallery -->
              <div class="detail-gallery">
                <div class="gallery-main">
                  <img
                    v-if="currentProduct?.images.length"
                    :src="currentProduct.images[galleryIndex]"
                    :alt="currentProduct.name"
                  >
                  <div v-else class="gallery-placeholder">
                    <span>{{ currentProduct?.itemNo?.charAt(0) }}</span>
                  </div>
                </div>
                <div v-if="currentProduct?.images.length > 1" class="gallery-thumbs">
                  <button
                    v-for="(img, i) in currentProduct.images"
                    :key="i"
                    class="thumb"
                    :class="{ active: galleryIndex === i }"
                    @click="galleryIndex = i"
                  >
                    <img :src="img" :alt="`View ${i + 1}`" loading="lazy">
                  </button>
                </div>
              </div>

              <!-- Product Info -->
              <div class="detail-info">
                <span class="detail-category">{{ currentProduct?.category }}</span>
                <h2 class="detail-name">{{ currentProduct?.name }}</h2>
                <p class="detail-item-no">Item No: {{ currentProduct?.itemNo }}</p>

                <div v-if="currentProduct?.description" class="detail-desc">
                  <h4>Description</h4>
                  <p>{{ currentProduct.description }}</p>
                </div>

                <!-- Specs Table -->
                <div class="detail-specs">
                  <h4>Specifications</h4>
                  <table class="specs-table">
                    <tbody>
                      <tr v-if="currentProduct?.capacity">
                        <td>Capacity</td>
                        <td>{{ currentProduct.capacity }}</td>
                      </tr>
                      <tr v-if="currentProduct?.material">
                        <td>Material</td>
                        <td>{{ currentProduct.material }}</td>
                      </tr>
                      <tr v-if="currentProduct?.specs.pcsPerCtn">
                        <td>Pcs/Carton</td>
                        <td>{{ currentProduct.specs.pcsPerCtn }}</td>
                      </tr>
                      <tr v-if="currentProduct?.specs.ctnSize">
                        <td>Carton Size (cm)</td>
                        <td>{{ currentProduct.specs.ctnSize }}</td>
                      </tr>
                      <tr v-if="currentProduct?.specs.nw">
                        <td>N.W. (kgs)</td>
                        <td>{{ currentProduct.specs.nw }}</td>
                      </tr>
                      <tr v-if="currentProduct?.specs.gw">
                        <td>G.W. (kgs)</td>
                        <td>{{ currentProduct.specs.gw }}</td>
                      </tr>
                      <tr v-if="currentProduct?.specs.pcs20gp">
                        <td>Pcs/20GP</td>
                        <td>{{ currentProduct.specs.pcs20gp.toLocaleString() }}</td>
                      </tr>
                      <tr v-if="currentProduct?.specs.pcs40hq">
                        <td>Pcs/40HQ</td>
                        <td>{{ currentProduct.specs.pcs40hq.toLocaleString() }}</td>
                      </tr>
                      <tr v-if="currentProduct?.specs.moq">
                        <td>MOQ</td>
                        <td>{{ currentProduct.specs.moq.toLocaleString() }}</td>
                      </tr>
                      <tr v-if="currentProduct?.specs.hsCode">
                        <td>H.S. Code</td>
                        <td>{{ currentProduct.specs.hsCode }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <NuxtLink
                  v-if="currentProduct?.categorySlug"
                  :to="`/products/${currentProduct.categorySlug}`"
                  class="detail-cta"
                >
                  View Category Collection
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import productsData from '~/data/products.json'

definePageMeta({
  layout: 'default',
})

useSeo({
  title: 'Product Catalog | Oya Plastic Factory',
  description: 'Browse our complete catalog of baby products with detailed specifications',
})

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
  images: string[]
  specs: ProductSpecs
}

const products = productsData.products as Product[]
const categories = productsData.categories as { name: string, slug: string, count: number }[]

const activeCategory = ref('all')
const activeSubcategory = ref('')
const searchQuery = ref('')
const detailOpen = ref(false)
const currentProduct = ref<Product | null>(null)
const galleryIndex = ref(0)

const activeSubcategories = computed(() => {
  const cat = activeCategory.value
  const filtered = cat === 'all' ? products : products.filter(p => p.categorySlug === cat)
  return [...new Set(filtered.map(p => p.subcategory))]
})

const filteredProducts = computed(() => {
  let result = products

  if (activeCategory.value !== 'all') {
    result = result.filter(p => p.categorySlug === activeCategory.value)
  }

  if (activeSubcategory.value) {
    result = result.filter(p => p.subcategory === activeSubcategory.value)
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.trim().toLowerCase()
    result = result.filter(p =>
      p.itemNo.toLowerCase().includes(q)
      || p.name.toLowerCase().includes(q)
      || p.description.toLowerCase().includes(q),
    )
  }

  return result
})

const openDetail = (product: Product) => {
  currentProduct.value = product
  galleryIndex.value = 0
  detailOpen.value = true
  document.body.style.overflow = 'hidden'
}

const closeDetail = () => {
  detailOpen.value = false
  document.body.style.overflow = ''
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && detailOpen.value) {
    closeDetail()
  }
}

watch(activeCategory, () => {
  activeSubcategory.value = ''
})

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = ''
})
</script>

<style lang="less" scoped>
@import '~/assets/css/variables.less';

.product-page {
  background: @background-color;
  min-height: 100vh;
}

// Hero
.page-hero {
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
    font-size: 2rem;
  }
}

.hero-subtitle {
  font-size: 1.1rem;
  color: @text-light;
  margin: 0 0 @spacing-md;
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

// Category Filter
.category-filter {
  background: @card-background;
  padding: @spacing-md;
  position: sticky;
  top: 60px;
  z-index: 50;
  border-bottom: 1px solid @border-color;
}

.filter-container {
  max-width: @breakpoint-wide;
  margin: 0 auto;
  display: flex;
  gap: @spacing-sm;
  overflow-x: auto;
  padding-bottom: @spacing-xs;

  &::-webkit-scrollbar {
    display: none;
  }
}

.filter-btn {
  display: inline-flex;
  align-items: center;
  gap: @spacing-xs;
  padding: @spacing-sm @spacing-md;
  background: @background-color;
  border: 1px solid @border-color;
  border-radius: 4px;
  cursor: pointer;
  white-space: nowrap;
  font-size: 0.9rem;
  font-weight: 500;
  color: @text-color;
  transition: all @transition-fast;

  &:hover, &.active {
    background: @primary-color;
    border-color: @primary-color;
    color: @card-background;
  }
}

.filter-count {
  font-size: 0.75rem;
  opacity: 0.7;
}

// Toolbar (search + subcategory)
.toolbar {
  padding: @spacing-md;
}

.toolbar-container {
  max-width: @breakpoint-wide;
  margin: 0 auto;
}

.search-box {
  position: relative;
  margin-bottom: @spacing-sm;
}

.search-icon {
  position: absolute;
  left: @spacing-md;
  top: 50%;
  transform: translateY(-50%);
  color: @text-muted;
}

.search-input {
  width: 100%;
  padding: @spacing-sm @spacing-sm @spacing-sm 2.5rem;
  border: 1px solid @border-color;
  border-radius: 4px;
  background: @card-background;
  font-size: 0.9rem;
  color: @text-color;
  outline: none;
  transition: border-color @transition-fast;

  &::placeholder {
    color: @text-muted;
  }

  &:focus {
    border-color: @primary-color;
  }
}

.subcategory-pills {
  display: flex;
  flex-wrap: wrap;
  gap: @spacing-xs;
}

.pill {
  padding: 4px 12px;
  background: @card-background;
  border: 1px solid @border-color;
  border-radius: 2rem;
  font-size: 0.8rem;
  color: @text-light;
  cursor: pointer;
  transition: all @transition-fast;

  &:hover, &.active {
    background: @secondary-color;
    border-color: @secondary-color;
    color: @card-background;
  }
}

// Product Grid
.product-grid-section {
  padding: 0 @spacing-md @spacing-xxl;

  @media (max-width: @breakpoint-tablet) {
    padding: 0 @spacing-sm @spacing-xl;
  }
}

.grid-container {
  max-width: @breakpoint-wide;
  margin: 0 auto;
}

.result-count {
  font-size: 0.85rem;
  color: @text-muted;
  margin: 0 0 @spacing-md;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: @spacing-md;

  @media (max-width: @breakpoint-desktop) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: @breakpoint-tablet) {
    grid-template-columns: repeat(2, 1fr);
    gap: @spacing-sm;
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
  transition: transform @transition-fast, box-shadow @transition-fast;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);

    .card-image-hover {
      opacity: 1;
    }
  }
}

.card-image {
  position: relative;
  aspect-ratio: 1;
  overflow: hidden;
  background: @background-color;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform @transition-normal;
  }
}

.card-image-hover {
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity @transition-fast;
}

.card-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, @primary-color 0%, lighten(@primary-color, 10%) 100%);

  span {
    font-size: 2.5rem;
    font-weight: 700;
    color: @card-background;
  }
}

.card-badge {
  position: absolute;
  bottom: @spacing-xs;
  left: @spacing-xs;
  font-size: 0.7rem;
  padding: 2px 8px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  border-radius: 2px;
  max-width: calc(100% - 1rem);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-body {
  padding: @spacing-sm @spacing-md @spacing-md;

  @media (max-width: @breakpoint-tablet) {
    padding: @spacing-xs @spacing-sm @spacing-sm;
  }
}

.card-name {
  font-size: 0.95rem;
  font-weight: 600;
  color: @text-color;
  margin: 0 0 @spacing-xs;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-meta {
  display: flex;
  gap: @spacing-xs;
  margin-bottom: @spacing-xs;
}

.meta-item {
  font-size: 0.75rem;
  padding: 2px 6px;
  background: @background-color;
  color: @text-light;
  border-radius: 2px;
}

.card-item-no {
  font-size: 0.8rem;
  color: @text-muted;
  margin: 0;
  font-family: monospace;
}

.empty-state {
  padding: @spacing-xxl;
  text-align: center;
  color: @text-light;
  font-size: 1.1rem;
}

// Modal
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: @spacing-md;
}

.modal-content {
  background: @card-background;
  border-radius: @radius-lg;
  max-width: 1000px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}

.modal-close {
  position: absolute;
  top: @spacing-md;
  right: @spacing-md;
  background: rgba(0, 0, 0, 0.05);
  border: none;
  color: @text-light;
  padding: @spacing-xs;
  border-radius: 50%;
  cursor: pointer;
  z-index: 10;

  &:hover {
    color: @text-color;
    background: rgba(0, 0, 0, 0.1);
  }
}

.modal-body {
  display: grid;
  grid-template-columns: 1fr 1fr;

  @media (max-width: @breakpoint-desktop) {
    grid-template-columns: 1fr;
  }
}

// Detail Gallery
.detail-gallery {
  padding: @spacing-lg;

  @media (max-width: @breakpoint-desktop) {
    padding: @spacing-md;
  }
}

.gallery-main {
  aspect-ratio: 1;
  border-radius: @radius-md;
  overflow: hidden;
  background: @background-color;
  margin-bottom: @spacing-sm;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.gallery-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, @primary-color 0%, lighten(@primary-color, 10%) 100%);

  span {
    font-size: 4rem;
    font-weight: 700;
    color: @card-background;
  }
}

.gallery-thumbs {
  display: flex;
  gap: @spacing-xs;
}

.thumb {
  width: 60px;
  height: 60px;
  border-radius: @radius-sm;
  overflow: hidden;
  border: 2px solid transparent;
  cursor: pointer;
  background: @background-color;
  padding: 0;
  transition: border-color @transition-fast;

  &.active, &:hover {
    border-color: @primary-color;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

// Detail Info
.detail-info {
  padding: @spacing-lg;
  display: flex;
  flex-direction: column;

  @media (max-width: @breakpoint-desktop) {
    padding: @spacing-md;
  }
}

.detail-category {
  font-size: 0.8rem;
  color: @secondary-color;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: @spacing-xs;
}

.detail-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: @text-color;
  margin: 0 0 @spacing-xs;
}

.detail-item-no {
  font-size: 0.9rem;
  color: @text-muted;
  font-family: monospace;
  margin: 0 0 @spacing-md;
}

.detail-desc {
  margin-bottom: @spacing-md;

  h4 {
    font-size: 0.9rem;
    font-weight: 600;
    color: @text-color;
    margin: 0 0 @spacing-xs;
  }

  p {
    font-size: 0.85rem;
    color: @text-light;
    line-height: 1.6;
    margin: 0;
    white-space: pre-line;
  }
}

.detail-specs {
  margin-bottom: @spacing-lg;

  h4 {
    font-size: 0.9rem;
    font-weight: 600;
    color: @text-color;
    margin: 0 0 @spacing-sm;
  }
}

.specs-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.85rem;

  td {
    padding: @spacing-xs @spacing-sm;
    border-bottom: 1px solid @border-light;
  }

  td:first-child {
    color: @text-light;
    width: 40%;
    white-space: nowrap;
  }

  td:last-child {
    color: @text-color;
    font-weight: 500;
  }
}

.detail-cta {
  display: inline-block;
  padding: @spacing-sm @spacing-lg;
  background: @primary-color;
  color: @card-background;
  text-decoration: none;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: 500;
  text-align: center;
  transition: background @transition-fast;
  margin-top: auto;

  &:hover {
    background: darken(@primary-color, 8%);
  }
}

// Transitions
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;

  .modal-content {
    transition: transform 0.3s ease;
  }
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;

  .modal-content {
    transform: scale(0.95);
  }
}
</style>
