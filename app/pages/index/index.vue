<template>
  <div class="home-page">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-container">
        <h1 class="hero-title">
          {{ $t('home.heroTitle') }}
        </h1>
        <p class="hero-subtitle">
          {{ $t('home.heroSubtitle') }}
        </p>
        <div class="hero-cta-group">
          <NuxtLink :to="getLocalePath('/baby-feeding-bottles')" class="hero-cta primary">
            {{ $t('home.exploreProducts') }}
          </NuxtLink>
          <NuxtLink :to="getLocalePath('/contact-us')" class="hero-cta secondary">
            {{ $t('nav.contact') }}
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Benefits Carousel Section -->
    <BenefitsCarousel />

    <!-- Category Sections -->
    <section v-for="(category, index) in categories" :key="category.slug" class="category-section"
      :class="[`layout-${getLayoutType(index)}`, `section-${index + 1}`]">
      <div class="section-inner">
        <!-- Content Side -->
        <div class="content-side">
          <span class="category-label">{{ getCategoryLabel(index) }}</span>
          <h2 class="category-title">{{ category.name }}</h2>
          <p class="category-description">{{ getCategoryDescription(category.slug) }}</p>
          <NuxtLink :to="getLocalePath(getCategoryLink(category.slug))" class="category-cta">
            {{ $t('home.viewAll') }} {{ category.name }}
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </NuxtLink>
        </div>

        <!-- Image Grid Side -->
        <div class="image-side">
          <div class="image-grid" :class="`grid-${getGridStyle(index)}`">
            <div v-for="(image, imgIndex) in getCategoryImages(category, 4)" :key="imgIndex" class="image-card">
              <img :src="image.src" :alt="image.alt" loading="lazy" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features-section">
      <div class="features-container">
        <h2 class="features-title">{{ $t('home.whyChoose') }}</h2>
        <div class="features-grid">
          <div class="feature">
            <div class="feature-header">
              <div class="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <h3 class="feature-title">{{ $t('home.safetyFirst') }}</h3>
            </div>
            <p class="feature-text">{{ $t('home.safetyFirstText') }}</p>
          </div>
          <div class="feature">
            <div class="feature-header">
              <div class="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path
                    d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </div>
              <h3 class="feature-title">{{ $t('home.thoughtfulDesign') }}</h3>
            </div>
            <p class="feature-text">{{ $t('home.thoughtfulDesignText') }}</p>
          </div>
          <div class="feature">
            <div class="feature-header">
              <div class="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <h3 class="feature-title">{{ $t('home.builtToLast') }}</h3>
            </div>
            <p class="feature-text">{{ $t('home.builtToLastText') }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <HomeFAQ />

    <!-- Final CTA Section -->
    <section class="final-cta">
      <div class="cta-container">
        <h2 class="cta-title">{{ $t('home.readyToExplore') }}</h2>
        <p class="cta-text">{{ $t('home.readyToExploreText') }}</p>
        <NuxtLink :to="getLocalePath('/contact-us')" class="cta-button">
          {{ $t('nav.contact') }}
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useCategoryImages, type CategoryImageData } from '~/composables/useCategoryImages'
import type { ProductImage } from '~/types/product'

definePageMeta({
  layout: 'default',
})

const { $t, getLocalePath } = useI18n()

useHomeSeo()

// Use curated category images from assets/images/home/categories/
const { getAllCategoryImages } = useCategoryImages()
const categories = getAllCategoryImages()

// Category descriptions - use translations
const getCategoryDescription = (slug: string): string => {
  const descMap: Record<string, string> = {
    'feeding-bottles': $t('products.feedingBottles.description'),
    'water-cups': $t('products.sippyCups.description'),
    'baby-tableware': $t('products.tableware.description'),
    'bath-potty': $t('products.bathPotty.description'),
    'milk-container': $t('products.milkPowderContainer.description'),
    'accessories': $t('products.accessories.description'),
  }
  return descMap[slug] || 'Quality baby products designed with care.'
}

// Get category images for homepage sections
const getCategoryImages = (category: CategoryImageData, count: number): ProductImage[] => {
  return category.images.slice(0, count)
}

// Get category link - map slugs to pages
const getCategoryLink = (slug: string): string => {
  const linkMap: Record<string, string> = {
    'feeding-bottles': '/baby-feeding-bottles',
    'water-cups': '/baby-sippy-cups',
    'baby-tableware': '/baby-tableware',
    'bath-potty': '/baby-bath-potty',
    'milk-container': '/baby-milk-powder-container',
    'accessories': '/other-accessory',
  }
  return linkMap[slug] || '/other-accessory'
}

// Get category label (01, 02, etc.)
const getCategoryLabel = (index: number): string => {
  return String(index + 1).padStart(2, '0')
}

// Layout variations: left, right, center
const getLayoutType = (index: number): string => {
  const layouts = ['left', 'right', 'center', 'left', 'right', 'left']
  return layouts[index] || 'left'
}

// Grid style variations - last category uses grid-a for larger images
const getGridStyle = (index: number): string => {
  const styles = ['a', 'b', 'c', 'a', 'b', 'a']
  return styles[index] || 'a'
}
</script>

<style lang="less" scoped>
@import '~/assets/css/variables.less';

.home-page {
  background: @background-color;
}

// ============================================
// Hero Section
// ============================================
.hero {
  background: linear-gradient(135deg, @primary-color 0%, lighten(@primary-color, 15%) 100%);
  padding: 120px @spacing-md;
  text-align: center;

  @media (max-width: @breakpoint-tablet) {
    padding: 80px @spacing-sm;
  }
}

.hero-container {
  max-width: @breakpoint-desktop;
  margin: 0 auto;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 700;
  color: @card-background;
  margin: 0 0 @spacing-md;
  letter-spacing: -0.02em;
  line-height: 1.2;

  @media (max-width: @breakpoint-tablet) {
    font-size: 2.25rem;
  }
}

.hero-subtitle {
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.85);
  margin: 0 0 @spacing-xl;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;

  @media (max-width: @breakpoint-tablet) {
    font-size: 1rem;
  }
}

.hero-cta-group {
  display: flex;
  justify-content: center;
  gap: @spacing-md;
  flex-wrap: wrap;
}

.hero-cta {
  display: inline-block;
  padding: @spacing-sm @spacing-xl;
  font-weight: 600;
  text-decoration: none;
  border-radius: @radius-sm;
  transition: transform @transition-fast, box-shadow @transition-fast;

  &.primary {
    background: @card-background;
    color: @primary-color;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
    }
  }

  &.secondary {
    background: transparent;
    color: @card-background;
    border: 2px solid @card-background;

    &:hover {
      background: rgba(255, 255, 255, 0.1);
      transform: translateY(-2px);
    }
  }
}

// ============================================
// Category Sections
// ============================================
.category-section {
  padding: 100px 0;
  min-height: 80vh;
  display: flex;
  align-items: center;

  @media (max-width: @breakpoint-tablet) {
    padding: 60px 0;
    min-height: auto;
  }
}

// Alternating backgrounds
.section-1,
.section-3,
.section-5 {
  background: @card-background;
}

.section-2,
.section-4,
.section-6 {
  background: @devide-background;
}

.section-inner {
  max-width: @breakpoint-wide;
  margin: 0 auto;
  padding: 0 @spacing-xl;
  display: flex;
  gap: @spacing-xxl;
  align-items: center;

  @media (max-width: @breakpoint-tablet) {
    flex-direction: column !important;
    padding: 0 @spacing-md;
    gap: @spacing-xl;
  }
}

// Layout variations
.layout-left {
  .section-inner {
    flex-direction: row;
  }
}

.layout-right {
  .section-inner {
    flex-direction: row-reverse;
  }
}

.layout-center {
  .section-inner {
    flex-direction: column;
    text-align: center;
  }

  .image-side {
    width: 100%;
  }

  .category-cta {
    align-self: center;
  }
}

.content-side {
  flex: 1;

  @media (max-width: @breakpoint-tablet) {
    text-align: center;
  }
}

.category-label {
  display: inline-block;
  font-size: 0.875rem;
  font-weight: 600;
  color: @primary-color;
  letter-spacing: 0.1em;
  margin-bottom: @spacing-sm;
}

.category-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: @text-color;
  margin: 0 0 @spacing-md;
  letter-spacing: -0.02em;

  @media (max-width: @breakpoint-tablet) {
    font-size: 2rem;
  }
}

.category-description {
  font-size: 1rem;
  color: @text-light;
  line-height: 1.7;
  margin: 0 0 @spacing-lg;
}

.category-stats {
  display: flex;
  gap: @spacing-md;
  margin-bottom: @spacing-lg;

  @media (max-width: @breakpoint-tablet) {
    justify-content: center;
  }
}

.stat {
  font-size: 0.875rem;
  color: @secondary-color;
  padding: @spacing-xs @spacing-sm;
  background: @background-color;
  border-radius: @radius-sm;
}

.category-cta {
  display: inline-flex;
  align-items: center;
  gap: @spacing-sm;
  padding: @spacing-sm @spacing-lg;
  background: @primary-color;
  color: @card-background;
  font-weight: 600;
  text-decoration: none;
  border-radius: @radius-sm;
  transition: background @transition-fast, transform @transition-fast;

  &:hover {
    background: lighten(@primary-color, 8%);
    transform: translateX(4px);
  }

  svg {
    transition: transform @transition-fast;
  }

  &:hover svg {
    transform: translateX(4px);
  }
}

.image-side {
  flex: 1.2;
}

.image-grid {
  display: grid;
  gap: @spacing-md;

  &.grid-a {
    grid-template-columns: repeat(2, 1fr);

    .image-card:first-child {
      grid-row: span 2;
    }
  }

  &.grid-b {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: repeat(2, 1fr);
  }

  &.grid-c {
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: 1fr;

    @media (max-width: @breakpoint-tablet) {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: @breakpoint-tablet) {

    &.grid-a,
    &.grid-b {
      grid-template-columns: repeat(2, 1fr);

      .image-card:first-child {
        grid-row: auto;
      }
    }
  }
}

.image-card {
  aspect-ratio: 1;
  border-radius: @radius-md;
  overflow: hidden;
  background: @background-color;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);

    img {
      transform: scale(1.08);
    }
  }
}

// ============================================
// Features Section
// ============================================
.features-section {
  padding: 100px 0;
  background: @primary-color;

  @media (max-width: @breakpoint-tablet) {
    padding: 60px 0;
  }
}

.features-container {
  max-width: @breakpoint-wide;
  margin: 0 auto;
  padding: 0 @spacing-xl;

  @media (max-width: @breakpoint-tablet) {
    padding: 0 @spacing-md;
  }
}

.features-title {
  font-size: 2rem;
  font-weight: 700;
  color: white;
  text-align: center;
  margin: 0 0 @spacing-xxl;

  @media (max-width: @breakpoint-tablet) {
    font-size: 1.5rem;
    margin-bottom: @spacing-xl;
  }
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: @spacing-xl;

  @media (max-width: @breakpoint-tablet) {
    grid-template-columns: 1fr;
    gap: @spacing-lg;
  }
}

.feature {
  text-align: center;
  padding: @spacing-lg;
}

.feature-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: @spacing-sm;
  margin-bottom: @spacing-sm;
}

.feature-icon {
  color: white;
  opacity: 0.9;
  flex-shrink: 0;
}

.feature-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: white;
  margin: 0;
}

.feature-text {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  margin: 0;
}

// ============================================
// Final CTA
// ============================================
.final-cta {
  padding: 100px 0;
  background: @card-background;
  text-align: center;

  @media (max-width: @breakpoint-tablet) {
    padding: 60px 0;
  }
}

.cta-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 0 @spacing-md;
}

.cta-title {
  font-size: 2rem;
  font-weight: 700;
  color: @text-color;
  margin: 0 0 @spacing-md;

  @media (max-width: @breakpoint-tablet) {
    font-size: 1.5rem;
  }
}

.cta-text {
  font-size: 1rem;
  color: @text-light;
  margin: 0 0 @spacing-lg;
}

.cta-button {
  display: inline-block;
  padding: @spacing-md @spacing-xxl;
  background: @primary-color;
  color: @card-background;
  font-weight: 600;
  text-decoration: none;
  border-radius: @radius-sm;
  transition: background @transition-fast, transform @transition-fast;

  &:hover {
    background: lighten(@primary-color, 8%);
    transform: translateY(-2px);
  }
}
</style>