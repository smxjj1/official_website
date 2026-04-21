<template>
  <div class="gallery-page">
    <!-- Hero Section -->
    <section class="gallery-hero">
      <div class="hero-container">
        <h1 class="hero-title">Product Gallery</h1>
        <p class="hero-subtitle">
          Explore our complete collection of baby products organized by category
        </p>
        <div class="stats">
          <span class="stat">{{ stats.totalImages }} Products</span>
          <span class="stat">{{ stats.totalSubcategories }} Collections</span>
        </div>
      </div>
    </section>

    <!-- Category Navigation -->
    <section class="category-nav">
      <div class="nav-container">
        <button
          v-for="cat in categories"
          :key="cat.slug"
          class="nav-button"
          :class="{ active: activeCategory === cat.slug }"
          @click="scrollToCategory(cat.slug)"
        >
          <span class="nav-label">{{ cat.name }}</span>
          <span class="nav-count">{{ cat.totalImages }}</span>
        </button>
      </div>
    </section>

    <!-- Gallery Content -->
    <section class="gallery-content">
      <div class="content-container">
        <div
          v-for="category in categories"
          :id="`category-${category.slug}`"
          :key="category.slug"
          class="category-section"
        >
          <!-- Category Header -->
          <div class="category-header">
            <h2 class="category-title">{{ category.name }}</h2>
            <span class="category-count">{{ category.subcategories.length }} collections</span>
          </div>

          <!-- Subcategory Grid -->
          <div class="subcategories-grid">
            <div
              v-for="subcat in category.subcategories"
              :key="subcat.fullSlug"
              class="subcategory-card"
              @click="openSubcategory(subcat)"
            >
              <!-- Preview Image -->
              <div class="card-preview">
                <img
                  :src="subcat.images[0]?.src"
                  :alt="subcat.images[0]?.alt"
                  loading="lazy"
                />
                <div class="card-overlay">
                  <span class="view-more">View {{ subcat.imageCount }} products</span>
                </div>
              </div>

              <!-- Card Info -->
              <div class="card-info">
                <h3 class="card-title">{{ subcat.label }}</h3>
                <div class="card-tags">
                  <span class="tag tag-category">{{ category.name }}</span>
                  <span class="tag tag-count">{{ subcat.imageCount }} items</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Subcategory Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="modalOpen" class="modal-overlay" @click.self="closeModal">
          <div class="modal-content">
            <!-- Modal Header -->
            <div class="modal-header">
              <div class="modal-title-group">
                <span class="modal-category">{{ currentSubcategory?.mainCategory }}</span>
                <h2 class="modal-title">{{ currentSubcategory?.label }}</h2>
              </div>
              <button class="modal-close" @click="closeModal" aria-label="Close">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <!-- Modal Gallery -->
            <div class="modal-gallery">
              <div
                v-for="(image, index) in currentSubcategory?.images"
                :key="index"
                class="gallery-item"
                @click="openLightbox(index)"
              >
                <img :src="image.src" :alt="image.alt" loading="lazy" />
              </div>
            </div>

            <!-- Modal Footer -->
            <div class="modal-footer">
              <span class="footer-count">{{ currentSubcategory?.imageCount }} products</span>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Lightbox -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="lightboxOpen" class="lightbox" @click.self="closeLightbox">
          <button class="lightbox-close" @click="closeLightbox" aria-label="Close">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>

          <button
            v-if="lightboxImages.length > 1"
            class="lightbox-nav prev"
            @click="prevImage"
            aria-label="Previous"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>

          <button
            v-if="lightboxImages.length > 1"
            class="lightbox-nav next"
            @click="nextImage"
            aria-label="Next"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>

          <div class="lightbox-content">
            <img :src="currentLightboxImage?.src" :alt="currentLightboxImage?.alt" />
            <p class="lightbox-caption">{{ currentLightboxImage?.alt }}</p>
          </div>

          <div class="lightbox-counter">
            {{ lightboxIndex + 1 }} / {{ lightboxImages.length }}
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { useNestedProductGallery, type SubcategoryGroup } from '~/composables/useNestedProductGallery'
import type { ProductImage } from '~/types/product'

definePageMeta({
  layout: 'default',
})

useSeo({
  title: 'Product Gallery | Oya Plastic Factory',
  description: 'Browse our complete collection of baby products organized by category',
})

const { getAllCategories, getStats } = useNestedProductGallery()

const categories = getAllCategories()
const stats = getStats()

// Active category for navigation
const activeCategory = ref(categories[0]?.slug || '')

// Scroll observer for auto-highlighting
let scrollObserver: IntersectionObserver | null = null

const setupScrollObserver = () => {
  if (scrollObserver) {
    scrollObserver.disconnect()
  }

  scrollObserver = new IntersectionObserver(
    (entries) => {
      // Find the entry that is most visible and intersects
      const visibleEntries = entries.filter(entry => entry.isIntersecting)
      if (visibleEntries.length > 0) {
        // Sort by intersection ratio (most visible first)
        visibleEntries.sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        const mostVisible = visibleEntries[0]
        const categorySlug = mostVisible.target.id.replace('category-', '')
        if (categorySlug && categorySlug !== activeCategory.value) {
          activeCategory.value = categorySlug
        }
      }
    },
    {
      root: null,
      rootMargin: '-100px 0px -50% 0px',
      threshold: [0, 0.25, 0.5, 0.75, 1],
    }
  )

  // Observe all category sections
  categories.forEach((cat) => {
    const element = document.getElementById(`category-${cat.slug}`)
    if (element && scrollObserver) {
      scrollObserver.observe(element)
    }
  })
}

// Modal state
const modalOpen = ref(false)
const currentSubcategory = ref<SubcategoryGroup | null>(null)

// Lightbox state
const lightboxOpen = ref(false)
const lightboxImages = ref<ProductImage[]>([])
const lightboxIndex = ref(0)

const currentLightboxImage = computed(() => lightboxImages.value[lightboxIndex.value])

// Scroll to category
const scrollToCategory = (slug: string) => {
  activeCategory.value = slug
  const element = document.getElementById(`category-${slug}`)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

// Open subcategory modal
const openSubcategory = (subcat: SubcategoryGroup) => {
  currentSubcategory.value = subcat
  modalOpen.value = true
  document.body.style.overflow = 'hidden'
}

const closeModal = () => {
  modalOpen.value = false
  document.body.style.overflow = ''
}

// Lightbox controls
const openLightbox = (index: number) => {
  if (!currentSubcategory.value) return
  lightboxImages.value = currentSubcategory.value.images
  lightboxIndex.value = index
  lightboxOpen.value = true
}

const closeLightbox = () => {
  lightboxOpen.value = false
}

const nextImage = () => {
  lightboxIndex.value = (lightboxIndex.value + 1) % lightboxImages.value.length
}

const prevImage = () => {
  lightboxIndex.value = lightboxIndex.value === 0
    ? lightboxImages.value.length - 1
    : lightboxIndex.value - 1
}

// Keyboard navigation
const handleKeydown = (e: KeyboardEvent) => {
  if (lightboxOpen.value) {
    if (e.key === 'Escape') closeLightbox()
    if (e.key === 'ArrowRight') nextImage()
    if (e.key === 'ArrowLeft') prevImage()
  } else if (modalOpen.value) {
    if (e.key === 'Escape') closeModal()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
  // Setup scroll observer for auto-highlighting
  setupScrollObserver()
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  // Cleanup scroll observer
  if (scrollObserver) {
    scrollObserver.disconnect()
  }
  document.body.style.overflow = ''
})
</script>

<style lang="less" scoped>
@import '~/assets/css/variables.less';

.gallery-page {
  background: @background-color;
  min-height: 100vh;
}

// Hero
.gallery-hero {
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
}

.stats {
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

// Category Navigation
.category-nav {
  background: @card-background;
  padding: @spacing-md;
  position: sticky;
  top: 60px;
  z-index: 50;
  border-bottom: 1px solid @border-color;

  @media (max-width: @breakpoint-tablet) {
    top: 60px;
  }
}

.nav-container {
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

.nav-button {
  display: inline-flex;
  align-items: center;
  gap: @spacing-xs;
  padding: @spacing-sm @spacing-md;
  background: @background-color;
  border: 1px solid @border-color;
  border-radius: 4px;
  cursor: pointer;
  white-space: nowrap;
  transition: all @transition-fast;

  &:hover, &.active {
    background: @primary-color;
    border-color: @primary-color;
    color: @card-background;
  }
}

.nav-label {
  font-size: 0.9rem;
  font-weight: 500;
}

.nav-count {
  font-size: 0.75rem;
  opacity: 0.7;
}

// Gallery Content
.gallery-content {
  padding: @spacing-xxl @spacing-md;

  @media (max-width: @breakpoint-tablet) {
    padding: @spacing-xl @spacing-sm;
  }
}

.content-container {
  max-width: @breakpoint-wide;
  margin: 0 auto;
}

.category-section {
  margin-bottom: @spacing-xxl;
  scroll-margin-top: 140px;
}

.category-header {
  display: flex;
  align-items: baseline;
  gap: @spacing-md;
  margin-bottom: @spacing-lg;
  padding-bottom: @spacing-sm;
  border-bottom: 2px solid @primary-color;
}

.category-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: @text-color;
  margin: 0;
}

.category-count {
  font-size: 0.9rem;
  color: @text-light;
}

// Subcategories Grid
.subcategories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: @spacing-lg;

  @media (max-width: @breakpoint-tablet) {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: @spacing-md;
  }
}

.subcategory-card {
  background: @card-background;
  border-radius: @radius-md;
  overflow: hidden;
  cursor: pointer;
  transition: transform @transition-fast, box-shadow @transition-fast;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);

    .card-overlay {
      opacity: 1;
    }
  }
}

.card-preview {
  position: relative;
  aspect-ratio: 4/3;
  background: @background-color;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.card-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity @transition-fast;
}

.view-more {
  color: @card-background;
  font-size: 0.9rem;
  font-weight: 500;
  padding: @spacing-xs @spacing-md;
  background: @primary-color;
  border-radius: @radius-sm;
}

.card-info {
  padding: @spacing-md;
}

.card-title {
  font-size: 1rem;
  font-weight: 600;
  color: @text-color;
  margin: 0 0 @spacing-sm;
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: @spacing-xs;
}

.tag {
  font-size: 0.75rem;
  padding: 2px 8px;
  border-radius: 2px;
}

.tag-category {
  background: @primary-color;
  color: @card-background;
}

.tag-count {
  background: @background-color;
  color: @text-light;
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
  max-width: 1200px;
  width: 100%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: @spacing-md @spacing-lg;
  border-bottom: 1px solid @border-color;
}

.modal-category {
  font-size: 0.8rem;
  color: @secondary-color;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: @text-color;
  margin: @spacing-xs 0 0;
}

.modal-close {
  background: none;
  border: none;
  color: @text-light;
  cursor: pointer;
  padding: @spacing-xs;

  &:hover {
    color: @text-color;
  }
}

.modal-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: @spacing-md;
  padding: @spacing-lg;
  overflow-y: auto;
}

.gallery-item {
  aspect-ratio: 1;
  border-radius: @radius-md;
  overflow: hidden;
  cursor: pointer;
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

.modal-footer {
  padding: @spacing-md @spacing-lg;
  border-top: 1px solid @border-color;
  text-align: center;
}

.footer-count {
  font-size: 0.9rem;
  color: @text-light;
}

// Lightbox
.lightbox {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.95);
  z-index: 1100;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lightbox-close {
  position: absolute;
  top: @spacing-md;
  right: @spacing-md;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  padding: @spacing-sm;
  border-radius: 50%;
  cursor: pointer;
  z-index: 1101;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
}

.lightbox-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  padding: @spacing-md;
  border-radius: 50%;
  cursor: pointer;
  z-index: 1101;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  &.prev { left: @spacing-md; }
  &.next { right: @spacing-md; }
}

.lightbox-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 90%;
  max-height: 90vh;

  img {
    max-width: 100%;
    max-height: 80vh;
    object-fit: contain;
  }
}

.lightbox-caption {
  color: white;
  font-size: 0.9rem;
  margin-top: @spacing-sm;
  text-align: center;
  max-width: 600px;
}

.lightbox-counter {
  position: absolute;
  bottom: @spacing-md;
  left: 50%;
  transform: translateX(-50%);
  color: white;
  font-size: 0.9rem;
  opacity: 0.7;
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>