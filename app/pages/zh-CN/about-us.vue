<template>
  <div class="about-page">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-container">
        <div class="hero-content">
          <h1 class="hero-title">{{ $t('about.title') }}</h1>
          <p class="hero-subtitle">{{ $t('about.subtitle') }}</p>
          <p class="hero-text">
            {{ $t('about.intro', { year: '2001', experience: '20', materials: $t('about.materials') }) }}
          </p>
        </div>
        <div class="hero-image">
          <img
            :src="companyDoorImage"
            alt="Oya Plastic Factory Entrance"
            class="factory-image"
          >
        </div>
      </div>
    </section>

    <!-- Strengths Section -->
    <section class="strengths-section">
      <div class="strengths-container">
        <h2 class="section-title">{{ $t('about.strengthsTitle') }}</h2>
        <div class="strengths-grid">
          <div class="strength-card">
            <div class="strength-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
            <div class="strength-number">{{ $t('about.strengths.experience.number') }}</div>
            <h3 class="strength-title">{{ $t('about.strengths.experience.title') }}</h3>
            <p class="strength-desc">{{ $t('about.strengths.experience.desc') }}</p>
          </div>
          <div class="strength-card">
            <div class="strength-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
            </div>
            <div class="strength-number">{{ $t('about.strengths.factory.number') }}</div>
            <h3 class="strength-title">{{ $t('about.strengths.factory.title') }}</h3>
            <p class="strength-desc">{{ $t('about.strengths.factory.desc') }}</p>
          </div>
          <div class="strength-card">
            <div class="strength-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="2" y1="12" x2="22" y2="12"/>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
              </svg>
            </div>
            <div class="strength-number">{{ $t('about.strengths.global.number') }}</div>
            <h3 class="strength-title">{{ $t('about.strengths.global.title') }}</h3>
            <p class="strength-desc">{{ $t('about.strengths.global.desc') }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Manufacturing Section -->
    <section class="manufacturing-section">
      <div class="manufacturing-container">
        <h2 class="section-title">{{ $t('about.manufacturingTitle') }}</h2>
        <p class="manufacturing-text">
          {{ $t('about.manufacturingText') }}
        </p>
        <div class="services-grid">
          <div class="service-item">
            <div class="service-badge">OEM</div>
            <p>{{ $t('about.oem') }}</p>
          </div>
          <div class="service-item">
            <div class="service-badge">ODM</div>
            <p>{{ $t('about.odm') }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Certifications Section -->
    <section class="certifications-section">
      <div class="certifications-container">
        <h2 class="section-title">{{ $t('about.certificationsTitle') }}</h2>
        <p class="certifications-intro">
          {{ $t('about.certificationsIntro') }}
        </p>
        <div class="certificates-grid">
          <div class="certificate-card" @click="openLightbox('iso')">
            <img
              :src="isoImage"
              alt="ISO 9001 Certificate"
              class="certificate-image"
            >
            <div class="certificate-label">
              <strong>ISO 9001</strong>
              <span>{{ $t('about.iso') }}</span>
            </div>
          </div>
          <div class="certificate-card" @click="openLightbox('bsci')">
            <img
              :src="bsciImage"
              alt="BSCI Certificate"
              class="certificate-image"
            >
            <div class="certificate-label">
              <strong>BSCI</strong>
              <span>{{ $t('about.bsci') }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Lightbox Modal -->
    <Teleport to="body">
      <Transition name="lightbox">
        <div v-if="lightboxOpen" class="lightbox-overlay" @click="closeLightbox">
          <div class="lightbox-content">
            <button class="lightbox-close" @click="closeLightbox" aria-label="Close">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
            <img
              :src="lightboxImage"
              :alt="lightboxAlt"
              class="lightbox-image"
            >
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="cta-container">
        <h2 class="cta-title">{{ $t('about.ctaTitle') }}</h2>
        <p class="cta-text">
          {{ $t('about.ctaText') }}
        </p>
        <p class="cta-closing">
          <strong>{{ $t('about.ctaClosing') }}</strong>
        </p>
        <NuxtLink :to="getLocalePath('/contact-us')" class="cta-button">
          {{ $t('about.contactButton') }}
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// Import images
import companyDoorImage from '~/assets/images/company/company_door.jpg'
import isoImage from '~/assets/images/company/ISO.jpg'
import bsciImage from '~/assets/images/company/BSCi.jpg'

definePageMeta({
  layout: 'default',
})

const { $t, getLocalePath } = useI18n()

useSeo({
  title: '关于我们 | Oya Plastic Factory',
  description: '台州市黄岩欧亚塑料制品厂 - 20余年婴儿喂养解决方案的专业制造商。ISO 9001和BSCI认证制造商。',
})

// Lightbox state
const lightboxOpen = ref(false)
const lightboxImage = ref('')
const lightboxAlt = ref('')

const openLightbox = (type: 'iso' | 'bsci') => {
  lightboxImage.value = type === 'iso' ? isoImage : bsciImage
  lightboxAlt.value = type === 'iso' ? 'ISO 9001 Certificate' : 'BSCI Certificate'
  lightboxOpen.value = true
}

const closeLightbox = () => {
  lightboxOpen.value = false
}

// Handle escape key
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && lightboxOpen.value) {
    closeLightbox()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<style lang="less" scoped>
@import '~/assets/css/variables.less';

.about-page {
  background: @background-color;
  min-height: 100vh;
}

// Hero Section
.hero-section {
  background: @card-background;
  padding: @spacing-xxl @spacing-md;
  border-bottom: 1px solid @border-color;

  @media (max-width: @breakpoint-tablet) {
    padding: @spacing-xl @spacing-sm;
  }
}

.hero-container {
  max-width: @breakpoint-wide;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: @spacing-xxl;
  align-items: center;

  @media (max-width: @breakpoint-tablet) {
    grid-template-columns: 1fr;
    gap: @spacing-xl;
  }
}

.hero-content {
  @media (max-width: @breakpoint-tablet) {
    order: 1;
  }
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
  font-size: 1.25rem;
  color: @primary-color;
  margin: 0 0 @spacing-lg;
  font-weight: 500;

  @media (max-width: @breakpoint-tablet) {
    font-size: 1.1rem;
  }
}

.hero-text {
  font-size: 1rem;
  color: @text-light;
  line-height: 1.8;
  margin: 0;

  strong {
    color: @text-color;
    font-weight: 600;
  }
}

.hero-image {
  @media (max-width: @breakpoint-tablet) {
    order: 0;
  }
}

.factory-image {
  width: 100%;
  height: auto;
  border-radius: @radius-lg;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.08);
  object-fit: cover;
}

// Strengths Section
.strengths-section {
  padding: @spacing-xxl @spacing-md;

  @media (max-width: @breakpoint-tablet) {
    padding: @spacing-xl @spacing-sm;
  }
}

.strengths-container {
  max-width: @breakpoint-wide;
  margin: 0 auto;
}

.section-title {
  font-size: 2rem;
  font-weight: 700;
  color: @text-color;
  text-align: center;
  margin: 0 0 @spacing-xl;

  @media (max-width: @breakpoint-tablet) {
    font-size: 1.5rem;
    margin-bottom: @spacing-lg;
  }
}

.strengths-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: @spacing-lg;

  @media (max-width: @breakpoint-tablet) {
    grid-template-columns: 1fr;
    gap: @spacing-md;
  }
}

.strength-card {
  background: @card-background;
  border-radius: @radius-lg;
  padding: @spacing-xl;
  text-align: center;
  border: 1px solid @border-color;
  transition: transform @transition-fast, box-shadow @transition-fast;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  }
}

.strength-icon {
  color: @secondary-color;
  margin-bottom: @spacing-md;
}

.strength-number {
  font-size: 3rem;
  font-weight: 700;
  color: @primary-color;
  margin-bottom: @spacing-xs;

  @media (max-width: @breakpoint-tablet) {
    font-size: 2.5rem;
  }
}

.strength-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: @text-color;
  margin: 0 0 @spacing-xs;
}

.strength-desc {
  font-size: 0.9rem;
  color: @text-light;
  margin: 0;
}

// Manufacturing Section
.manufacturing-section {
  background: @section-background;
  padding: @spacing-xxl @spacing-md;

  @media (max-width: @breakpoint-tablet) {
    padding: @spacing-xl @spacing-sm;
  }
}

.manufacturing-container {
  max-width: @breakpoint-wide;
  margin: 0 auto;
  text-align: center;
}

.manufacturing-text {
  font-size: 1.1rem;
  color: @text-light;
  line-height: 1.8;
  max-width: 800px;
  margin: 0 auto @spacing-xl;
}

.services-grid {
  display: flex;
  gap: @spacing-lg;
  justify-content: center;

  @media (max-width: @breakpoint-tablet) {
    flex-direction: column;
    align-items: center;
    gap: @spacing-md;
  }
}

.service-item {
  background: @card-background;
  border-radius: @radius-md;
  padding: @spacing-lg @spacing-xl;
  text-align: center;
  border: 1px solid @border-color;

  @media (max-width: @breakpoint-tablet) {
    width: 100%;
    max-width: 300px;
  }
}

.service-badge {
  display: inline-block;
  font-size: 1.5rem;
  font-weight: 700;
  color: @primary-color;
  background: rgba(@primary-color, 0.1);
  padding: @spacing-xs @spacing-md;
  border-radius: @radius-sm;
  margin-bottom: @spacing-sm;
}

.service-item p {
  font-size: 0.9rem;
  color: @text-light;
  margin: 0;
}

// Certifications Section
.certifications-section {
  padding: @spacing-xxl @spacing-md;
  background: @card-background;

  @media (max-width: @breakpoint-tablet) {
    padding: @spacing-xl @spacing-sm;
  }
}

.certifications-container {
  max-width: @breakpoint-wide;
  margin: 0 auto;
  text-align: center;
}

.certifications-intro {
  font-size: 1rem;
  color: @text-light;
  max-width: 600px;
  margin: 0 auto @spacing-xl;
}

.certificates-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: @spacing-lg;
  max-width: 800px;
  margin: 0 auto;

  @media (max-width: @breakpoint-tablet) {
    grid-template-columns: 1fr;
    gap: @spacing-md;
  }
}

.certificate-card {
  background: @card-background;
  border-radius: @radius-lg;
  padding: @spacing-md;
  border: 1px solid @border-color;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: transform @transition-fast, box-shadow @transition-fast;

  &:hover {
    transform: scale(1.02);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  }
}

.certificate-image {
  width: 100%;
  height: auto;
  border-radius: @radius-sm;
  object-fit: contain;
  background: white;
  padding: @spacing-sm;
}

.certificate-label {
  margin-top: @spacing-md;
  text-align: center;

  strong {
    display: block;
    font-size: 1.1rem;
    color: @text-color;
    margin-bottom: @spacing-xs;
  }

  span {
    font-size: 0.85rem;
    color: @text-light;
  }
}

// Lightbox
.lightbox-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.9);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: @spacing-md;
}

.lightbox-content {
  max-width: 90vw;
  max-height: 90vh;
  position: relative;
}

.lightbox-close {
  position: absolute;
  top: -@spacing-lg;
  right: -@spacing-lg;
  background: white;
  border: none;
  color: @text-color;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background @transition-fast;

  &:hover {
    background: @devide-background;
  }

  @media (max-width: @breakpoint-tablet) {
    top: -40px;
    right: 0;
    width: 40px;
    height: 40px;
  }
}

.lightbox-image {
  max-width: 100%;
  max-height: 85vh;
  border-radius: @radius-md;
}

.lightbox-enter-active,
.lightbox-leave-active {
  transition: opacity 0.3s ease;
}

.lightbox-enter-from,
.lightbox-leave-to {
  opacity: 0;
}

// CTA Section
.cta-section {
  background: @section-background;
  padding: @spacing-xxl @spacing-md;
  text-align: center;

  @media (max-width: @breakpoint-tablet) {
    padding: @spacing-xl @spacing-sm;
  }
}

.cta-container {
  max-width: @breakpoint-desktop;
  margin: 0 auto;
}

.cta-title {
  font-size: 2rem;
  font-weight: 700;
  color: @text-color;
  margin: 0 0 @spacing-md;
}

.cta-text {
  font-size: 1rem;
  color: @text-light;
  line-height: 1.8;
  max-width: 600px;
  margin: 0 auto @spacing-md;
}

.cta-closing {
  font-size: 1.25rem;
  color: @primary-color;
  margin: 0 0 @spacing-xl;
}

.cta-button {
  display: inline-block;
  padding: @spacing-md @spacing-xl;
  background: @primary-color;
  color: @card-background;
  font-size: 1rem;
  font-weight: 600;
  text-decoration: none;
  border-radius: @radius-md;
  transition: background @transition-fast, transform @transition-fast;

  &:hover {
    background: lighten(@primary-color, 8%);
    transform: translateY(-2px);
  }
}
</style>