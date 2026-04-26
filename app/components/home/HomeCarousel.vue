<template>
  <section class="home-carousel">
    <div class="carousel-container">
      <!-- Slide Content -->
      <div class="carousel-track" :style="trackStyle">
        <div
          v-for="(slide, index) in slides"
          :key="index"
          class="carousel-slide"
        >
          <!-- Background Image -->
          <div class="slide-image">
            <img
              v-if="slide.image"
              :src="slide.image.src"
              :alt="slide.image.alt"
              loading="lazy"
            />
            <div v-else class="slide-placeholder">
              <span>{{ slide.category }}</span>
            </div>
          </div>

          <!-- Content Overlay -->
          <div class="slide-content">
            <h2 class="slide-headline">{{ slide.headline }}</h2>
            <ul class="slide-benefits">
              <li v-for="(benefit, i) in slide.benefits" :key="i">
                <span class="benefit-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </span>
                <span>{{ benefit }}</span>
              </li>
            </ul>
            <NuxtLink :to="slide.ctaLink" class="slide-cta">
              {{ slide.ctaText }}
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Navigation -->
      <button
        class="carousel-nav prev"
        @click="prevSlide"
        aria-label="Previous slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
      </button>

      <button
        class="carousel-nav next"
        @click="nextSlide"
        aria-label="Next slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      </button>

      <!-- Indicators -->
      <div class="carousel-indicators">
        <button
          v-for="(_, index) in slides"
          :key="index"
          class="indicator"
          :class="{ active: currentIndex === index }"
          @click="goToSlide(index)"
          :aria-label="`Go to slide ${index + 1}`"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useProductAssets } from '~/composables/useProductAssets'
import type { ProductAsset } from '~/composables/useProductAssets'

interface SlideData {
  category: string
  headline: string
  benefits: string[]
  ctaText: string
  ctaLink: string
  image: ProductAsset | null
}

const { getCategoryAssets } = useProductAssets()

const currentIndex = ref(0)
let autoPlayInterval: ReturnType<typeof setInterval> | null = null

// Get sample images from each category
const feedingBottles = getCategoryAssets('feeding-bottles')
const waterCups = getCategoryAssets('water-cups')
const tableware = getCategoryAssets('baby-tableware')
const bathPotty = getCategoryAssets('bath-potty')
const accessories = getCategoryAssets('accessories')

// Define slides with dynamic images
const slides: SlideData[] = [
  {
    category: 'Feeding Bottles',
    headline: 'Safe Feeding for Your Little One',
    benefits: [
      'BPA-free materials for baby\'s safety',
      'Anti-colic design reduces discomfort',
      'Easy-grip shapes for tiny hands',
      'Dishwasher safe for easy cleaning',
    ],
    ctaText: 'Shop Feeding Bottles',
    ctaLink: '/products/feeding-bottles',
    image: feedingBottles[0] || null,
  },
  {
    category: 'Water Cups',
    headline: 'Spill-Proof Independence',
    benefits: [
      'Leak-proof technology for mess-free sipping',
      'Soft spouts gentle on gums',
      'Ergonomic handles for self-feeding',
      'Fun colors kids love',
    ],
    ctaText: 'Shop Water Cups',
    ctaLink: '/products/water-cups',
    image: waterCups[0] || feedingBottles[1] || null,
  },
  {
    category: 'Baby Tableware',
    headline: 'Mealtime Made Easy',
    benefits: [
      'Suction bases prevent tipping',
      'Divided sections for balanced meals',
      'Soft-tip spoons protect delicate mouths',
      'Stackable for space-saving storage',
    ],
    ctaText: 'Shop Tableware',
    ctaLink: '/products/baby-tableware',
    image: tableware[0] || feedingBottles[2] || null,
  },
  {
    category: 'Bath & Potty',
    headline: 'Comfortable Bath Time',
    benefits: [
      'Ergonomic designs for baby\'s comfort',
      'Non-slip surfaces for safety',
      'Easy to clean materials',
      'Compact storage solutions',
    ],
    ctaText: 'Shop Bath & Potty',
    ctaLink: '/products/bath-potty',
    image: bathPotty[0] || feedingBottles[3] || null,
  },
  {
    category: 'Accessories',
    headline: 'Everything You Need',
    benefits: [
      'Complete your baby care kit',
      'High-quality bottle brushes',
      'Convenient powder boxes',
      'Soothing teethers for relief',
    ],
    ctaText: 'Shop Accessories',
    ctaLink: '/products/accessories',
    image: accessories[0] || feedingBottles[4] || null,
  },
]

const trackStyle = computed(() => ({
  transform: `translateX(-${currentIndex.value * 100}%)`,
}))

const nextSlide = () => {
  currentIndex.value = (currentIndex.value + 1) % slides.length
}

const prevSlide = () => {
  currentIndex.value = currentIndex.value === 0 ? slides.length - 1 : currentIndex.value - 1
}

const goToSlide = (index: number) => {
  currentIndex.value = index
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

.home-carousel {
  background: @primary-color;
  padding: @spacing-xxl 0;
  overflow: hidden;

  @media (max-width: @breakpoint-tablet) {
    padding: @spacing-xl 0;
  }
}

.carousel-container {
  position: relative;
  max-width: @breakpoint-wide;
  margin: 0 auto;
  overflow: hidden;
}

.carousel-track {
  display: flex;
  transition: transform 0.5s ease-in-out;
}

.carousel-slide {
  min-width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: @spacing-xl;
  padding: 0 @spacing-md;

  @media (max-width: @breakpoint-tablet) {
    grid-template-columns: 1fr;
    gap: @spacing-lg;
    padding: 0 @spacing-sm;
  }
}

.slide-image {
  aspect-ratio: 1/1;
  border-radius: 8px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.1);
  width: 100%;
  height: 100%;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  @media (max-width: @breakpoint-tablet) {
    aspect-ratio: 16/9;
    max-height: 250px;
  }
}

.slide-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);

  span {
    font-size: 1.5rem;
    color: rgba(255, 255, 255, 0.5);
  }
}

.slide-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: @card-background;
}

.slide-headline {
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 @spacing-md;
  line-height: 1.2;

  @media (max-width: @breakpoint-tablet) {
    font-size: 1.5rem;
  }
}

.slide-benefits {
  list-style: none;
  padding: 0;
  margin: 0 0 @spacing-lg;

  li {
    display: flex;
    align-items: flex-start;
    gap: @spacing-sm;
    margin-bottom: @spacing-sm;
    font-size: 1rem;
    line-height: 1.5;

    @media (max-width: @breakpoint-tablet) {
      font-size: 0.9rem;
    }
  }
}

.benefit-icon {
  flex-shrink: 0;
  color: lighten(@primary-color, 40%);
  margin-top: 2px;
}

.slide-cta {
  display: inline-block;
  padding: @spacing-sm @spacing-lg;
  background: @card-background;
  color: @primary-color;
  font-weight: 600;
  text-decoration: none;
  border-radius: 4px;
  transition: transform @transition-fast, box-shadow @transition-fast;
  align-self: flex-start;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
}

// Navigation
.carousel-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  padding: @spacing-sm;
  border-radius: 50%;
  cursor: pointer;
  transition: background @transition-fast;
  z-index: 10;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }

  &.prev {
    left: @spacing-sm;
  }

  &.next {
    right: @spacing-sm;
  }

  @media (max-width: @breakpoint-tablet) {
    padding: @spacing-xs;

    svg {
      width: 20px;
      height: 20px;
    }
  }
}

// Indicators
.carousel-indicators {
  display: flex;
  justify-content: center;
  gap: @spacing-xs;
  margin-top: @spacing-lg;
}

.indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.3);
  cursor: pointer;
  transition: background @transition-fast;

  &.active {
    background: @card-background;
  }

  &:hover:not(.active) {
    background: rgba(255, 255, 255, 0.5);
  }
}
</style>