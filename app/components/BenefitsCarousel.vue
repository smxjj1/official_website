<template>
  <section class="benefits-carousel">
    <div class="carousel-container">
      <!-- Slide Viewport -->
      <div class="carousel-viewport">
        <!-- Slides -->
        <div
          v-for="(slide, index) in slides"
          :key="index"
          class="carousel-slide"
          :class="{ active: currentSlide === index }"
        >
          <!-- Image Side -->
          <div class="slide-image">
            <img :src="slide.image" :alt="slide.title" loading="lazy" />
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
import { useNestedProductGallery } from '~/composables/useNestedProductGallery'

const { getAllCategories } = useNestedProductGallery()
const categories = getAllCategories()

// Get images from categories for the carousel
const getFirstImage = (categorySlug: string) => {
  const cat = categories.find(c => c.slug === categorySlug)
  return cat?.subcategories[0]?.images[0]?.src || ''
}

// Benefits slides configuration
const slides = [
  {
    badge: 'Safety First',
    title: '100% Safe Materials',
    description: 'Every product is crafted with your baby\'s health as our top priority. We use only certified safe materials.',
    features: [
      'BPA, PVC & Phthalate Free',
      'Food-Grade Materials',
      'FDA & EN14350 Certified',
    ],
    image: getFirstImage('feeding-bottles'),
    link: '/products/feeding-bottles',
    ctaText: 'Explore Safe Products',
  },
  {
    badge: 'Smart Design',
    title: 'Ergonomic & Practical',
    description: 'Thoughtfully designed products that make parenting easier while ensuring baby\'s comfort during feeding and play.',
    features: [
      'Easy-Grip Handles',
      'Anti-Colic Systems',
      'Dishwasher Safe',
    ],
    image: getFirstImage('water-cups'),
    link: '/products/water-cups',
    ctaText: 'View Smart Solutions',
  },
  {
    badge: 'Quality Build',
    title: 'Built to Last',
    description: 'Premium materials and rigorous testing ensure our products grow with your family, lasting through multiple children.',
    features: [
      'Durable Construction',
      'Heat Resistant',
      'Long-lasting Colors',
    ],
    image: getFirstImage('baby-tableware'),
    link: '/products/baby-tableware',
    ctaText: 'See Quality Products',
  },
  {
    badge: 'Complete Range',
    title: 'Everything You Need',
    description: 'From feeding to bath time, our comprehensive product line covers all your baby\'s needs with consistent quality.',
    features: [
      'Full Product Range',
      'Compatible Systems',
      'Growing with Baby',
    ],
    image: getFirstImage('accessories'),
    link: '/gallery',
    ctaText: 'Browse All Products',
  },
]

// Carousel state
const currentSlide = ref(0)
let autoPlayInterval: ReturnType<typeof setInterval> | null = null

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % slides.length
}

const prevSlide = () => {
  currentSlide.value = currentSlide.value === 0 ? slides.length - 1 : currentSlide.value - 1
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
  background: @card-background;
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

// Individual slides - absolutely positioned, only active one visible
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
  // Hidden by default
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  z-index: 1;
  // Smooth transition
  transition: opacity 0.5s ease-in-out, visibility 0.5s ease-in-out;

  // Active slide - fully visible
  &.active {
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
    z-index: 10;
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
  aspect-ratio: 4/3;
  border-radius: @radius-lg;
  overflow: hidden;
  background: @background-color;

  img {
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
  background: @primary-color;
  color: @card-background;
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
  color: @text-light;
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
      color: @primary-color;
      flex-shrink: 0;
    }
  }
}

.slide-cta {
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
  width: 48px;
  height: 48px;
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
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid @primary-color;
  background: transparent;
  cursor: pointer;
  transition: all @transition-fast;

  &.active {
    background: @primary-color;
  }

  &:hover:not(.active) {
    background: @border-color;
  }
}
</style>