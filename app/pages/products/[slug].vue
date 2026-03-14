<template>
  <div class="category-page">
    <!-- Hero Section -->
    <section class="category-hero">
      <div class="hero-container">
        <h1 class="hero-title">{{ category.hero.headline }}</h1>
        <p class="hero-subtitle">{{ category.hero.subheadline }}</p>
        <p v-if="categoryStats" class="image-count">
          {{ categoryStats.totalImages }} products in {{ categoryStats.subcategories.length }} collections
        </p>
      </div>
    </section>

    <!-- Subcategories Navigation -->
    <section v-if="categoryStats && categoryStats.subcategories.length > 1" class="subcats-nav">
      <div class="nav-container">
        <button
          v-for="subcat in categoryStats.subcategories"
          :key="subcat.id"
          class="nav-pill"
          :class="{ active: activeSubcat === subcat.id }"
          @click="scrollToSubcat(subcat.id)"
        >
          {{ subcat.label }}
          <span class="pill-count">{{ subcat.imageCount }}</span>
        </button>
      </div>
    </section>

    <!-- Subcategories Content -->
    <section class="content-section">
      <div class="section-container">
        <!-- Featured Badge -->
        <div v-if="categoryStats && categoryStats.totalImages > 0" class="featured-header">
          <span class="featured-badge">Curated Selection</span>
          <p class="featured-note">Premium products from our {{ category.name }} collection</p>
        </div>

        <!-- Subcategory Sections -->
        <div v-if="categoryStats && categoryStats.subcategories.length > 0" class="subcats-container">
          <div
            v-for="subcat in categoryStats.subcategories"
            :id="`subcat-${subcat.id}`"
            :key="subcat.id"
            class="subcat-section"
          >
            <!-- Subcategory Header -->
            <div class="subcat-header">
              <h3 class="subcat-title">{{ subcat.label }}</h3>
              <span class="subcat-count">{{ subcat.imageCount }} products</span>
            </div>

            <!-- Image Grid -->
            <div class="image-grid">
              <div
                v-for="(image, index) in subcat.images"
                :key="index"
                class="image-card"
                @click="openLightbox(subcat.id, index)"
              >
                <img :src="image.src" :alt="image.alt" loading="lazy" />
                <div class="card-overlay">
                  <span class="view-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <circle cx="11" cy="11" r="8"/>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                      <line x1="11" y1="8" x2="11" y2="14"/>
                      <line x1="8" y1="11" x2="14" y2="11"/>
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="empty-state">
          <div class="empty-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
          </div>
          <h3>No Products Available</h3>
          <p>Products will be added soon. Please check back later.</p>
        </div>
      </div>
    </section>

    <!-- Contact CTA Section -->
    <section class="cta-section">
      <div class="section-container">
        <h2 class="cta-title">Interested in {{ category.name }}?</h2>
        <p class="cta-text">Contact us for more information about our products.</p>
        <NuxtLink to="/contact" class="cta-button">
          Get in Touch
        </NuxtLink>
      </div>
    </section>

    <!-- Navigation -->
    <section class="nav-section">
      <NuxtLink to="/gallery" class="back-link">
        ← View All Products Gallery
      </NuxtLink>
    </section>

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

          <button v-if="lightboxImages.length > 1" class="lightbox-nav prev" @click="prevImage" aria-label="Previous">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>

          <button v-if="lightboxImages.length > 1" class="lightbox-nav next" @click="nextImage" aria-label="Next">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>

          <div class="lightbox-content">
            <img :src="currentImage?.src" :alt="currentImage?.alt" class="lightbox-image" />
            <p class="lightbox-caption">{{ currentImage?.alt }}</p>
          </div>

          <div class="lightbox-counter">
            {{ currentIndex + 1 }} / {{ lightboxImages.length }}
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { getCategoryBySlug, isValidCategorySlug } from '~/data/product-categories'
import { useNestedProductGallery, type ProductImage } from '~/composables/useNestedProductGallery'

definePageMeta({
  layout: 'default',
})

const route = useRoute()
const slug = route.params.slug as string

if (!isValidCategorySlug(slug)) {
  throw createError({
    statusCode: 404,
    message: `Product category "${slug}" not found`,
  })
}

const category = getCategoryBySlug(slug)!
useProductCategorySeo(category)

const { getCategory } = useNestedProductGallery()
const categoryStats = getCategory(category.imageFolder)

// Active subcategory for navigation
const activeSubcat = ref('')

// Scroll observer for auto-highlighting
let scrollObserver: IntersectionObserver | null = null

const setupScrollObserver = () => {
  if (!categoryStats.value || categoryStats.value.subcategories.length <= 1) return

  scrollObserver = new IntersectionObserver(
    (entries) => {
      const visibleEntries = entries.filter(entry => entry.isIntersecting)
      if (visibleEntries.length > 0) {
        visibleEntries.sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        const mostVisible = visibleEntries[0]
        const subcatId = mostVisible.target.id.replace('subcat-', '')
        if (subcatId && subcatId !== activeSubcat.value) {
          activeSubcat.value = subcatId
        }
      }
    },
    {
      root: null,
      rootMargin: '-140px 0px -50% 0px',
      threshold: [0, 0.25, 0.5, 0.75, 1],
    }
  )

  categoryStats.value.subcategories.forEach((subcat) => {
    const element = document.getElementById(`subcat-${subcat.id}`)
    if (element && scrollObserver) {
      scrollObserver.observe(element)
    }
  })
}

// Lightbox state
const lightboxOpen = ref(false)
const currentIndex = ref(0)
const lightboxImages = ref<ProductImage[]>([])

const currentImage = computed(() => lightboxImages.value[currentIndex.value])

// Scroll to subcategory
const scrollToSubcat = (subcatId: string) => {
  activeSubcat.value = subcatId
  const element = document.getElementById(`subcat-${subcatId}`)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

// Lightbox controls
const openLightbox = (subcatId: string, index: number) => {
  if (!categoryStats.value) return

  const subcat = categoryStats.value.subcategories.find(s => s.id === subcatId)
  if (!subcat) return

  lightboxImages.value = subcat.images
  currentIndex.value = index
  lightboxOpen.value = true
  document.body.style.overflow = 'hidden'
}

const closeLightbox = () => {
  lightboxOpen.value = false
  document.body.style.overflow = ''
}

const nextImage = () => {
  currentIndex.value = (currentIndex.value + 1) % lightboxImages.value.length
}

const prevImage = () => {
  currentIndex.value = currentIndex.value === 0
    ? lightboxImages.value.length - 1
    : currentIndex.value - 1
}

// Keyboard navigation
const handleKeydown = (e: KeyboardEvent) => {
  if (!lightboxOpen.value) return
  if (e.key === 'Escape') closeLightbox()
  if (e.key === 'ArrowRight') nextImage()
  if (e.key === 'ArrowLeft') prevImage()
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)

  // Set initial active subcat
  if (categoryStats.value && categoryStats.value.subcategories.length > 0) {
    activeSubcat.value = categoryStats.value.subcategories[0].id
  }

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
  margin: 0 0 @spacing-md;
  letter-spacing: -0.02em;
  line-height: 1.2;

  @media (max-width: @breakpoint-tablet) {
    font-size: 1.75rem;
  }
}

.hero-subtitle {
  font-size: 1.1rem;
  color: @text-light;
  margin: 0 0 @spacing-sm;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;

  @media (max-width: @breakpoint-tablet) {
    font-size: 1rem;
  }
}

.image-count {
  font-size: 0.9rem;
  color: @secondary-color;
  margin: 0;
}

// Subcategories Navigation
.subcats-nav {
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
  flex-wrap: wrap;
  gap: @spacing-sm;
}

.nav-pill {
  display: inline-flex;
  align-items: center;
  gap: @spacing-xs;
  padding: @spacing-xs @spacing-md;
  background: @background-color;
  border: 1px solid @border-color;
  border-radius: 2rem;
  font-size: 0.875rem;
  color: @text-light;
  cursor: pointer;
  transition: all @transition-fast;

  &:hover {
    border-color: @primary-color;
    color: @primary-color;
  }

  &.active {
    background: @primary-color;
    border-color: @primary-color;
    color: @card-background;
  }
}

.pill-count {
  font-size: 0.75rem;
  opacity: 0.7;
}

// Content Section
.content-section {
  padding: @spacing-xxl @spacing-md;

  @media (max-width: @breakpoint-tablet) {
    padding: @spacing-xl @spacing-sm;
  }
}

.section-container {
  max-width: @breakpoint-wide;
  margin: 0 auto;
}

.featured-header {
  text-align: center;
  margin-bottom: @spacing-lg;
  padding: @spacing-md;
  background: @card-background;
  border-radius: @radius-md;
}

.featured-badge {
  display: inline-block;
  padding: @spacing-xs @spacing-md;
  background: @primary-color;
  color: @card-background;
  font-size: 0.8rem;
  font-weight: 600;
  border-radius: @radius-sm;
  margin-bottom: @spacing-xs;
}

.featured-note {
  font-size: 0.9rem;
  color: @text-light;
  margin: 0;
}

.subcats-container {
  display: flex;
  flex-direction: column;
  gap: @spacing-xl;
}

.subcat-section {
  scroll-margin-top: 140px;
}

.subcat-header {
  display: flex;
  align-items: baseline;
  gap: @spacing-md;
  margin-bottom: @spacing-md;
  padding-bottom: @spacing-sm;
  border-bottom: 2px solid @primary-color;
}

.subcat-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: @text-color;
  margin: 0;
}

.subcat-count {
  font-size: 0.875rem;
  color: @text-light;
}

// Image Grid
.image-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: @spacing-md;

  @media (max-width: @breakpoint-desktop) {
    grid-template-columns: repeat(4, 1fr);
  }

  @media (max-width: @breakpoint-tablet) {
    grid-template-columns: repeat(3, 1fr);
    gap: @spacing-sm;
  }

  @media (max-width: @breakpoint-mobile) {
    grid-template-columns: repeat(2, 1fr);
  }
}

.image-card {
  position: relative;
  aspect-ratio: 1;
  border-radius: @radius-md;
  overflow: hidden;
  cursor: pointer;
  background: @card-background;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform @transition-fast;
  }

  &:hover img {
    transform: scale(1.05);
  }

  &:hover .card-overlay {
    opacity: 1;
  }
}

.card-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity @transition-fast;
}

.view-icon {
  color: @card-background;
}

// Empty State
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
    font-size: 1.25rem;
    font-weight: 600;
    color: @text-color;
    margin: 0 0 @spacing-sm;
  }

  p {
    color: @text-light;
    margin: 0;
  }
}

// CTA Section
.cta-section {
  padding: @spacing-xxl @spacing-md;
  background: @primary-color;
  text-align: center;

  @media (max-width: @breakpoint-tablet) {
    padding: @spacing-xl @spacing-sm;
  }
}

.cta-title {
  font-size: 1.75rem;
  font-weight: 600;
  color: @card-background;
  margin: 0 0 @spacing-sm;

  @media (max-width: @breakpoint-tablet) {
    font-size: 1.5rem;
  }
}

.cta-text {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.85);
  margin: 0 0 @spacing-lg;
}

.cta-button {
  display: inline-block;
  padding: @spacing-sm @spacing-lg;
  background: @card-background;
  color: @primary-color;
  font-weight: 600;
  text-decoration: none;
  border-radius: @radius-sm;
  transition: transform @transition-fast, box-shadow @transition-fast;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
}

.nav-section {
  padding: @spacing-lg @spacing-md;
  text-align: center;
}

.back-link {
  color: @text-light;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color @transition-fast;

  &:hover {
    color: @primary-color;
  }
}

// Lightbox
.lightbox {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.95);
  z-index: 1000;
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
  z-index: 1001;

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
  z-index: 1001;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  &.prev {
    left: @spacing-md;
  }

  &.next {
    right: @spacing-md;
  }
}

.lightbox-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 90%;
  max-height: 90vh;
}

.lightbox-image {
  max-width: 100%;
  max-height: 80vh;
  object-fit: contain;
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
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>