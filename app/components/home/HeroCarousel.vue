<template>
  <section class="hero-carousel">
    <h1 v-if="!slides[0]?.title" class="sr-only">{{ $t('siteName') }}</h1>
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
          :class="{ 'is-image-only': !slide.title }"
        >
          <NuxtLink
            v-if="!slide.title"
            :to="slide.primaryLink"
            class="slide-hit-area"
            :aria-label="slide.alt"
          />
          <OptimImg
            v-if="slide.image && shouldLoadSlideImage(index)"
            :src="slide.image"
            :webp-src="slide.webpSrc"
            :alt="slide.title || slide.alt"
            class="slide-bg"
            width="1980"
            height="800"
            :loading="index === currentIndex ? 'eager' : 'lazy'"
            :fetchpriority="index === currentIndex ? 'high' : 'auto'"
          />
          <div v-if="slide.title" class="slide-overlay" />
          <div v-if="slide.title" class="slide-content">
            <component :is="index === 0 ? 'h1' : 'h2'" class="slide-title">{{ slide.title }}</component>
            <p v-if="slide.subtitle" class="slide-subtitle">{{ slide.subtitle }}</p>
            <div v-if="slide.primaryCta" class="slide-cta-group">
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
  alt: string
  image: string
  webpSrc?: string
}

const { $t, getLocalePath } = useSiteLocale()

const heroImages = import.meta.glob(
  '~/assets/images/home/hero/*.webp',
  { eager: true, query: '?url', import: 'default' },
)

function getImageSources(index: number): { src: string, webpSrc?: string } {
  let webp = ''

  for (const path in heroImages) {
    const filename = path.split('/').pop() ?? ''
    if (!filename.startsWith(String(index)) && !filename.startsWith(`hero-${index}`))
      continue
    webp = heroImages[path] as string
    break
  }

  return {
    src: webp,
    webpSrc: webp || undefined,
  }
}

const containerRef = ref<HTMLElement | null>(null)
const currentIndex = ref(0)
const preloadAdjacentSlides = ref(false)
let autoPlayInterval: ReturnType<typeof setInterval> | null = null

function shouldLoadSlideImage(index: number) {
  if (!preloadAdjacentSlides.value)
    return index === currentIndex.value

  const total = slides.value.length
  if (total <= 1)
    return index === 0

  const prev = currentIndex.value === 0 ? total - 1 : currentIndex.value - 1
  const next = (currentIndex.value + 1) % total
  return index === currentIndex.value || index === prev || index === next
}

const slideLinks = [
  { primary: '/baby-sippy-cups', alt: 'Baby sippy cups' },
  { primary: '/baby-bath-potty', alt: 'Baby bath and potty' },
  { primary: '/baby-feeding-bottles', alt: 'Baby feeding bottles' },
  { primary: '/baby-tableware', alt: 'Baby tableware' },
  { primary: '/contact-us', alt: 'Partner With Us' },
]

const slides = computed<HeroSlide[]>(() => {
  const rawSlides = $t('home.hero.slides')
  if (!Array.isArray(rawSlides)) return []

  return rawSlides
    .map((slide: any, index: number) => {
      const sources = getImageSources(index + 1)
      const link = slideLinks[index]
      return {
        title: (slide.title as string) || '',
        subtitle: (slide.subtitle as string) || '',
        primaryCta: (slide.primaryCta as string) || '',
        primaryLink: getLocalePath(link?.primary || '/baby-feeding-bottles'),
        secondaryCta: slide.secondaryCta || undefined,
        secondaryLink: slide.secondaryCta ? getLocalePath('/contact-us') : undefined,
        alt: link?.alt || (slide.title as string) || 'Product highlight',
        image: sources.src,
        webpSrc: sources.webpSrc,
      }
    })
    .filter(slide => slide.image)
})

const firstSlideImage = computed(() => slides.value[0]?.webpSrc || slides.value[0]?.image || '')

useHead(() => ({
  link: firstSlideImage.value
    ? [{
        rel: 'preload',
        as: 'image',
        href: firstSlideImage.value,
        fetchpriority: 'high',
      }]
    : [],
}))

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
  const enableAdjacent = () => {
    preloadAdjacentSlides.value = true
  }
  if ('requestIdleCallback' in window)
    requestIdleCallback(enableAdjacent, { timeout: 4000 })
  else
    setTimeout(enableAdjacent, 2500)
})

onUnmounted(() => {
  pauseAutoPlay()
})
</script>

<style lang="less" scoped>
@import '~/assets/css/variables.less';

.hero-carousel {
  /* 与横幅 letterbox 同色，避免切页时露出品牌红底 */
  background: #f7f3ee;
  /* 贴紧导航，避免亚像素缝隙 */
  margin-top: -1px;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
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
  /* 按原图约 1980x800 比例限高，避免 70vh 过大拉伸发糊 */
  height: min(64vh, 680px, calc(100vw * 800 / 1980));
  min-height: 380px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f7f3ee;

  /* 平板/手机：按横幅比例完整展示，避免 cover 裁掉左右文案与产品 */
  @media (max-width: @breakpoint-tablet) {
    height: auto;
    min-height: 0;
    aspect-ratio: 1920 / 828;
  }
}

.slide-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center center;

  @media (max-width: @breakpoint-tablet) {
    object-fit: contain;
    background: #f7f3ee;
  }
}

/* 有 HTML 叠层的最后一页：背景铺满，文案在框内紧凑排布 */
.carousel-slide:not(.is-image-only) {
  @media (max-width: @breakpoint-tablet) {
    .slide-bg {
      object-fit: cover;
    }

    .slide-content {
      padding: 0.55rem 2.75rem;
    }

    .slide-title {
      font-size: 1.15rem;
      margin-bottom: 0.25rem;
    }

    .slide-subtitle {
      font-size: 0.72rem;
      margin-bottom: 0.45rem;
      line-height: 1.3;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .slide-cta {
      padding: 0.35rem 0.85rem;
      font-size: 0.78rem;
    }
  }
}

.slide-hit-area {
  position: absolute;
  inset: 0;
  z-index: 3;
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
    color: @primary-color-dark;

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
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  padding: 0;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(74, 64, 58, 0.12);
  color: #4a403a;
  border-radius: 50%;
  cursor: pointer;
  z-index: 10;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.18);
  transition: background @transition-fast, box-shadow @transition-fast, transform @transition-fast;

  &:hover {
    background: #fff;
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.22);
    transform: translateY(-50%) scale(1.05);
  }

  &.prev { left: @spacing-md; }
  &.next { right: @spacing-md; }
}
</style>
