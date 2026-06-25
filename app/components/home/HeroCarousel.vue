<template>
  <section class="hero-carousel">
    <div
      ref="containerRef"
      class="carousel-container"
      @mouseenter="pauseAutoPlay"
      @mouseleave="resumeAutoPlay"
    >
      <div class="carousel-track" :style="trackStyle">
        <div
          v-for="(slide, index) in slides"
          :key="index"
          class="carousel-slide"
        >
          <img
            v-if="slide.image"
            :src="slide.image"
            :alt="slide.title"
            class="slide-bg"
            loading="eager"
          >
          <div class="slide-overlay" />
          <div class="slide-content">
            <h1 class="slide-title">{{ slide.title }}</h1>
            <p class="slide-subtitle">{{ slide.subtitle }}</p>
            <div class="slide-cta-group">
              <NuxtLink :to="slide.primaryLink" class="slide-cta primary">
                {{ slide.primaryCta }}
              </NuxtLink>
              <NuxtLink
                v-if="slide.secondaryCta"
                :to="slide.secondaryLink"
                class="slide-cta secondary"
              >
                {{ slide.secondaryCta }}
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>

      <button class="carousel-nav prev" aria-label="Previous slide" @click="prevSlide">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
      <button class="carousel-nav next" aria-label="Next slide" @click="nextSlide">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      <div class="carousel-indicators">
        <button
          v-for="(_, index) in slides"
          :key="index"
          class="indicator"
          :class="{ active: currentIndex === index }"
          :aria-label="`Go to slide ${index + 1}`"
          @click="goToSlide(index)"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface HeroSlide {
  title: string
  subtitle: string
  primaryCta: string
  primaryLink: string
  secondaryCta?: string
  secondaryLink?: string
  image: string
}

const { $t, getLocalePath } = useI18n()

const heroImages = import.meta.glob(
  '~/assets/images/home/hero/*.{jpg,jpeg,png,webp}',
  { eager: true, query: '?url', import: 'default' },
)
const fallbackImages = import.meta.glob(
  '~/assets/images/home/BenefitsCarousel/*.{jpg,jpeg,png,webp}',
  { eager: true, query: '?url', import: 'default' },
)

function getImageByIndex(index: number): string {
  for (const path in heroImages) {
    const filename = path.split('/').pop() ?? ''
    if (filename.startsWith(String(index)) || filename.startsWith(`hero-${index}`)) {
      return heroImages[path] as string
    }
  }
  for (const path in fallbackImages) {
    const filename = path.split('/').pop() ?? ''
    if (filename.startsWith(String(index))) {
      return fallbackImages[path] as string
    }
  }
  return ''
}

const slideLinks = [
  { primary: '/baby-feeding-bottles', secondary: '/contact-us' },
  { primary: '/baby-feeding-bottles', secondary: '' },
  { primary: '/baby-sippy-cups', secondary: '' },
  { primary: '/about-us', secondary: '' },
  { primary: '/contact-us', secondary: '' },
]

const slides = computed<HeroSlide[]>(() => {
  const rawSlides = $t('home.hero.slides')
  if (!Array.isArray(rawSlides)) return []

  return rawSlides.map((slide: any, index: number) => ({
    title: slide.title as string,
    subtitle: slide.subtitle as string,
    primaryCta: slide.primaryCta as string,
    primaryLink: getLocalePath(slideLinks[index]?.primary || '/baby-feeding-bottles'),
    secondaryCta: index === 0 ? (slide.secondaryCta as string) : undefined,
    secondaryLink: index === 0 ? getLocalePath('/contact-us') : undefined,
    image: getImageByIndex(index + 1),
  }))
})

const containerRef = ref<HTMLElement | null>(null)
const currentIndex = ref(0)
let autoPlayInterval: ReturnType<typeof setInterval> | null = null

const trackStyle = computed(() => ({
  transform: `translateX(-${currentIndex.value * 100}%)`,
}))

const nextSlide = () => {
  if (!slides.value.length) return
  currentIndex.value = (currentIndex.value + 1) % slides.value.length
}

const prevSlide = () => {
  if (!slides.value.length) return
  currentIndex.value = currentIndex.value === 0 ? slides.value.length - 1 : currentIndex.value - 1
}

const goToSlide = (index: number) => {
  currentIndex.value = index
}

const pauseAutoPlay = () => {
  if (autoPlayInterval) {
    clearInterval(autoPlayInterval)
    autoPlayInterval = null
  }
}

const resumeAutoPlay = () => {
  pauseAutoPlay()
  autoPlayInterval = setInterval(nextSlide, 6000)
}

onMounted(() => {
  resumeAutoPlay()
})

onUnmounted(() => {
  pauseAutoPlay()
})
</script>

<style lang="less" scoped>
@import '~/assets/css/variables.less';

.hero-carousel {
  background: @primary-color;
}

.carousel-container {
  position: relative;
  max-width: 100%;
  overflow: hidden;
}

.carousel-track {
  display: flex;
  transition: transform 0.6s ease-in-out;
}

.carousel-slide {
  position: relative;
  min-width: 100%;
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: @breakpoint-tablet) {
    min-height: 60vh;
  }
}

.slide-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.slide-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(74, 64, 58, 0.72) 0%,
    rgba(224, 122, 95, 0.45) 100%
  );
}

.slide-content {
  position: relative;
  z-index: 2;
  max-width: @breakpoint-desktop;
  padding: @spacing-xxl @spacing-xl;
  text-align: center;
  color: @card-background;

  @media (max-width: @breakpoint-tablet) {
    padding: @spacing-xl @spacing-md;
  }
}

.slide-title {
  font-size: 3.25rem;
  font-weight: 700;
  margin: 0 0 @spacing-md;
  letter-spacing: -0.02em;
  line-height: 1.15;

  @media (max-width: @breakpoint-tablet) {
    font-size: 2rem;
  }
}

.slide-subtitle {
  font-size: 1.2rem;
  margin: 0 auto @spacing-xl;
  max-width: 640px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.9);

  @media (max-width: @breakpoint-tablet) {
    font-size: 1rem;
  }
}

.slide-cta-group {
  display: flex;
  justify-content: center;
  gap: @spacing-md;
  flex-wrap: wrap;
}

.slide-cta {
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
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
  }

  &.secondary {
    background: transparent;
    color: @card-background;
    border: 2px solid @card-background;

    &:hover {
      background: rgba(255, 255, 255, 0.12);
      transform: translateY(-2px);
    }
  }
}

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
  z-index: 10;
  transition: background @transition-fast;

  &:hover {
    background: rgba(255, 255, 255, 0.35);
  }

  &.prev { left: @spacing-md; }
  &.next { right: @spacing-md; }
}

.carousel-indicators {
  position: absolute;
  bottom: @spacing-lg;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: @spacing-xs;
  z-index: 10;
}

.indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.35);
  cursor: pointer;
  transition: background @transition-fast, transform @transition-fast;

  &.active {
    background: @card-background;
    transform: scale(1.15);
  }
}
</style>
