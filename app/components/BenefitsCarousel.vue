<template>
  <section class="benefits-carousel">
    <div class="carousel-container">
      <HomeSectionHeader
        class="benefits-header"
        :subtitle="$t('home.benefitsSection.subtitleTag')"
        :title="$t('home.benefitsSection.title')"
        :description="$t('home.benefitsSection.subtitle')"
      />

      <!-- Slide Viewport -->
      <div class="carousel-viewport">
        <!-- Slides -->
        <div
          v-for="(slide, index) in slides"
          v-show="currentSlide === index"
          :key="index"
          class="carousel-slide"
          :class="{ active: currentSlide === index }"
        >
          <!-- Image Side -->
          <div class="slide-image">
            <OptimImg
              v-if="currentSlide === index"
              :src="slide.image"
              :webp-src="slide.webpSrc"
              :alt="slide.title"
              loading="lazy"
            />
          </div>

          <!-- Content Side -->
          <div class="slide-content">
            <span class="slide-badge">{{ slide.badge }}</span>
            <h2 class="slide-title">{{ slide.title }}</h2>
            <p class="slide-description">{{ slide.description }}</p>
            <ul class="slide-features">
              <li v-for="(feature, i) in slide.features" :key="i">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <span>{{ feature }}</span>
              </li>
            </ul>
            <NuxtLink :to="slide.link" class="slide-cta">
              {{ slide.ctaText }}
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Navigation Arrows -->
      <button class="carousel-arrow prev" @click="prevSlide" aria-label="Previous">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
      </button>
      <button class="carousel-arrow next" @click="nextSlide" aria-label="Next">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      </button>

      <!-- Dots Indicators -->
      <div class="carousel-dots">
        <button
          v-for="(_, index) in slides"
          :key="index"
          class="dot"
          :class="{ active: currentSlide === index }"
          @click="goToSlide(index)"
          :aria-label="`Go to slide ${index + 1}`"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { $t, locale, getLocalePath } = useSiteLocale()

// Load carousel images from assets/images/home/BenefitsCarousel/
const carouselImages = import.meta.glob(
  '~/assets/images/home/BenefitsCarousel/*.webp',
  { eager: true, query: '?url', import: 'default' },
)

const getImageSources = (index: number): { src: string, webpSrc?: string } => {
  for (const path in carouselImages) {
    const filename = path.split('/').pop() ?? ''
    if (!filename.startsWith(String(index)))
      continue
    const webp = carouselImages[path] as string
    return { src: webp, webpSrc: webp }
  }
  return { src: '', webpSrc: undefined }
}

// Benefits slides configuration with i18n - use computed to react to locale changes
const slides = computed(() => [
  {
    badge: $t('benefits.safetyFirst.badge') as string,
    title: $t('benefits.safetyFirst.title') as string,
    description: $t('benefits.safetyFirst.description') as string,
    features: $t('benefits.safetyFirst.features') as string[],
    image: getImageSources(1).src,
    webpSrc: getImageSources(1).webpSrc,
    link: getLocalePath('/baby-feeding-bottles'),
    ctaText: $t('benefits.safetyFirst.ctaText') as string,
  },
  {
    badge: $t('benefits.smartDesign.badge') as string,
    title: $t('benefits.smartDesign.title') as string,
    description: $t('benefits.smartDesign.description') as string,
    features: $t('benefits.smartDesign.features') as string[],
    image: getImageSources(2).src,
    webpSrc: getImageSources(2).webpSrc,
    link: getLocalePath('/baby-sippy-cups'),
    ctaText: $t('benefits.smartDesign.ctaText') as string,
  },
  {
    badge: $t('benefits.qualityBuild.badge') as string,
    title: $t('benefits.qualityBuild.title') as string,
    description: $t('benefits.qualityBuild.description') as string,
    features: $t('benefits.qualityBuild.features') as string[],
    image: getImageSources(3).src,
    webpSrc: getImageSources(3).webpSrc,
    link: getLocalePath('/baby-tableware'),
    ctaText: $t('benefits.qualityBuild.ctaText') as string,
  },
  {
    badge: $t('benefits.completeRange.badge') as string,
    title: $t('benefits.completeRange.title') as string,
    description: $t('benefits.completeRange.description') as string,
    features: $t('benefits.completeRange.features') as string[],
    image: getImageSources(4).src,
    webpSrc: getImageSources(4).webpSrc,
    link: getLocalePath('/baby-feeding-bottles'),
    ctaText: $t('benefits.completeRange.ctaText') as string,
  },
])

// Carousel state
const currentSlide = ref(0)
let autoPlayInterval: ReturnType<typeof setInterval> | null = null

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % slides.value.length
}

const prevSlide = () => {
  currentSlide.value = currentSlide.value === 0 ? slides.value.length - 1 : currentSlide.value - 1
}

const goToSlide = (index: number) => {
  currentSlide.value = index
}

// Auto-play
onMounted(() => {
  autoPlayInterval = setInterval(nextSlide, 5000)
})

onUnmounted(() => {
  if (autoPlayInterval) {
    clearInterval(autoPlayInterval)
  }
})
</script>

<style lang="less" scoped>
@import '~/assets/css/variables.less';

.benefits-carousel {
  background: @devide-background;
  padding: 100px 0;
  overflow: hidden;

  @media (max-width: @breakpoint-tablet) {
    padding: 60px 0;
  }
}

.carousel-container {
  max-width: @breakpoint-wide;
  margin: 0 auto;
  padding: 0 @spacing-xl;
  position: relative;

  @media (max-width: @breakpoint-tablet) {
    padding: 0 @spacing-md;
  }

  :deep(.benefits-header) {
    margin-bottom: @spacing-xxl;
  }
}

// Viewport - contains all slides with overflow hidden
.carousel-viewport {
  position: relative;
  width: 100%;
  min-height: 500px;

  @media (max-width: @breakpoint-tablet) {
    min-height: auto;
  }
}

// Individual slides - only the active slide is visible in layout
.carousel-slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: @spacing-xxl;
  align-items: center;
  z-index: 1;

  &.active {
    z-index: 10;
  }

  &:not(.active) {
    visibility: hidden;
    pointer-events: none;
  }

  @media (max-width: @breakpoint-tablet) {
    grid-template-columns: 1fr;
    gap: @spacing-xl;
    position: relative;
    height: auto;
    // On mobile, all slides take normal flow but only active is visible
    &:not(.active) {
      position: absolute;
      height: 0;
      overflow: hidden;
      padding: 0;
      margin: 0;
    }
  }
}

.slide-image {
  aspect-ratio: 1/1;
  border-radius: @radius-lg;
  overflow: hidden;
  background: @background-color;
  width: 100%;
  height: 100%;

  :deep(.optim-img) {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  @media (max-width: @breakpoint-tablet) {
    aspect-ratio: 16/9;
  }
}

.slide-content {
  padding: @spacing-lg 0;

  @media (max-width: @breakpoint-tablet) {
    text-align: center;
    padding: 0;
  }
}

.slide-badge {
  display: inline-block;
  padding: @spacing-xs @spacing-md;
  background: @primary-color-dark;
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  border-radius: @radius-sm;
  margin-bottom: @spacing-md;
}

.slide-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: @text-color;
  margin: 0 0 @spacing-md;
  line-height: 1.2;
  letter-spacing: -0.02em;

  @media (max-width: @breakpoint-tablet) {
    font-size: 1.75rem;
  }
}

.slide-description {
  font-size: 1.1rem;
  color: @text-light-accessible;
  line-height: 1.7;
  margin: 0 0 @spacing-lg;

  @media (max-width: @breakpoint-tablet) {
    font-size: 1rem;
  }
}

.slide-features {
  list-style: none;
  padding: 0;
  margin: 0 0 @spacing-lg;

  li {
    display: flex;
    align-items: center;
    gap: @spacing-sm;
    margin-bottom: @spacing-sm;
    color: @text-color;
    font-size: 1rem;

    @media (max-width: @breakpoint-tablet) {
      justify-content: center;
    }

    svg {
      color: @primary-color-dark;
      flex-shrink: 0;
    }
  }
}

.slide-cta {
  display: inline-flex;
  align-items: center;
  gap: @spacing-sm;
  padding: @spacing-sm @spacing-lg;
  background: @primary-color-dark;
  color: white;
  font-weight: 600;
  text-decoration: none;
  border-radius: @radius-sm;
  transition: background @transition-fast, transform @transition-fast;

  &:hover {
    background: lighten(@primary-color-dark, 8%);
    transform: translateX(4px);
  }

  svg {
    transition: transform @transition-fast;
  }

  &:hover svg {
    transform: translateX(4px);
  }

  @media (max-width: @breakpoint-tablet) {
    justify-content: center;
  }
}

// Navigation Arrows
.carousel-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: @background-color;
  border: 1px solid @border-color;
  color: @text-color;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all @transition-fast;
  z-index: 20;

  &:hover {
    background: @primary-color;
    border-color: @primary-color;
    color: white;
  }

  &.prev {
    left: 0;

    @media (max-width: @breakpoint-tablet) {
      left: @spacing-sm;
    }
  }

  &.next {
    right: 0;

    @media (max-width: @breakpoint-tablet) {
      right: @spacing-sm;
    }
  }

  @media (max-width: @breakpoint-tablet) {
    width: 40px;
    height: 40px;

    svg {
      width: 20px;
      height: 20px;
    }
  }
}

// Dots
.carousel-dots {
  display: flex;
  justify-content: center;
  gap: @spacing-sm;
  margin-top: @spacing-xl;
  position: relative;
  z-index: 20;
}

.dot {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  padding: 0;
  border-radius: 50%;
  border: none;
  background: transparent;
  cursor: pointer;

  &::before {
    content: '';
    width: 12px;
    height: 12px;
    border-radius: 50%;
    border: 2px solid @primary-color-dark;
    background: transparent;
    transition: all @transition-fast;
  }

  &.active::before {
    background: @primary-color-dark;
  }

  &:hover:not(.active)::before {
    background: @border-color;
  }
}
</style>