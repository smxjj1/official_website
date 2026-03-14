<template>
  <div class="product-gallery">
    <div class="gallery-header">
      <h2 class="gallery-title">{{ title }}</h2>
      <p v-if="subtitle" class="gallery-subtitle">{{ subtitle }}</p>
    </div>

    <div class="gallery-grid" :class="gridClass">
      <div
        v-for="(image, index) in images"
        :key="image.filename"
        class="gallery-item"
        @click="openLightbox(index)"
      >
        <img
          :src="image.src"
          :alt="image.alt"
          :loading="index < 12 ? 'eager' : 'lazy'"
          class="gallery-image"
        >
        <div class="image-overlay">
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

    <div v-if="images.length === 0" class="gallery-empty">
      <p>No product images available</p>
    </div>

    <!-- Lightbox -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="lightboxOpen" class="lightbox" @click.self="closeLightbox">
          <button class="lightbox-close" @click="closeLightbox" aria-label="Close lightbox">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>

          <button
            v-if="images.length > 1"
            class="lightbox-nav lightbox-prev"
            @click="prevImage"
            aria-label="Previous image"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>

          <button
            v-if="images.length > 1"
            class="lightbox-nav lightbox-next"
            @click="nextImage"
            aria-label="Next image"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>

          <div class="lightbox-content">
            <img
              :src="currentImage?.src"
              :alt="currentImage?.alt"
              class="lightbox-image"
            >
            <p class="lightbox-caption">{{ currentImage?.alt }}</p>
          </div>

          <div class="lightbox-counter">
            {{ currentIndex + 1 }} / {{ images.length }}
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import type { ProductAsset } from '~/composables/useProductAssets'

const props = withDefaults(defineProps<{
  images: ProductAsset[]
  title?: string
  subtitle?: string
  columns?: 2 | 3 | 4 | 5
}>(), {
  title: 'Product Gallery',
  columns: 4,
})

const lightboxOpen = ref(false)
const currentIndex = ref(0)

const currentImage = computed(() => props.images[currentIndex.value])

const gridClass = computed(() => `grid-${props.columns}-columns`)

const openLightbox = (index: number) => {
  currentIndex.value = index
  lightboxOpen.value = true
  document.body.style.overflow = 'hidden'
}

const closeLightbox = () => {
  lightboxOpen.value = false
  document.body.style.overflow = ''
}

const nextImage = () => {
  currentIndex.value = (currentIndex.value + 1) % props.images.length
}

const prevImage = () => {
  currentIndex.value = currentIndex.value === 0 ? props.images.length - 1 : currentIndex.value - 1
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
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = ''
})
</script>

<style lang="less" scoped>
@import '~/assets/css/variables.less';

.product-gallery {
  width: 100%;
}

.gallery-header {
  margin-bottom: @spacing-lg;
}

.gallery-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: @text-color;
  margin: 0 0 @spacing-xs;

  @media (max-width: @breakpoint-tablet) {
    font-size: 1.25rem;
  }
}

.gallery-subtitle {
  font-size: 0.9rem;
  color: @text-light;
  margin: 0;
}

.gallery-grid {
  display: grid;
  gap: @spacing-sm;

  &.grid-2-columns {
    grid-template-columns: repeat(2, 1fr);
  }

  &.grid-3-columns {
    grid-template-columns: repeat(3, 1fr);

    @media (max-width: @breakpoint-mobile) {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  &.grid-4-columns {
    grid-template-columns: repeat(4, 1fr);

    @media (max-width: @breakpoint-desktop) {
      grid-template-columns: repeat(3, 1fr);
    }

    @media (max-width: @breakpoint-tablet) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media (max-width: @breakpoint-mobile) {
      grid-template-columns: repeat(2, 1fr);
      gap: @spacing-xs;
    }
  }

  &.grid-5-columns {
    grid-template-columns: repeat(5, 1fr);

    @media (max-width: @breakpoint-desktop) {
      grid-template-columns: repeat(4, 1fr);
    }

    @media (max-width: @breakpoint-tablet) {
      grid-template-columns: repeat(3, 1fr);
    }

    @media (max-width: @breakpoint-mobile) {
      grid-template-columns: repeat(2, 1fr);
    }
  }
}

.gallery-item {
  position: relative;
  aspect-ratio: 1;
  overflow: hidden;
  border-radius: 4px;
  background: @background-color;
  cursor: pointer;

  &:hover {
    .image-overlay {
      opacity: 1;
    }

    .gallery-image {
      transform: scale(1.05);
    }
  }
}

.gallery-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform @transition-normal;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity @transition-fast;
}

.view-icon {
  color: white;
  opacity: 0.9;
}

.gallery-empty {
  padding: @spacing-xl;
  text-align: center;
  background: @background-color;
  border-radius: 4px;

  p {
    color: @text-light;
    margin: 0;
  }
}

// Lightbox styles
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
  transition: background @transition-fast;
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
  transition: background @transition-fast;
  z-index: 1001;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  @media (max-width: @breakpoint-tablet) {
    padding: @spacing-sm;
  }
}

.lightbox-prev {
  left: @spacing-md;

  @media (max-width: @breakpoint-tablet) {
    left: @spacing-sm;
  }
}

.lightbox-next {
  right: @spacing-md;

  @media (max-width: @breakpoint-tablet) {
    right: @spacing-sm;
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

  @media (max-width: @breakpoint-tablet) {
    font-size: 0.8rem;
    padding: 0 @spacing-md;
  }
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