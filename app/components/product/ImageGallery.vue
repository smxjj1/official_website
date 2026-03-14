<template>
  <div class="image-gallery">
    <div class="gallery-grid">
      <div
        v-for="(image, index) in images"
        :key="image.filename"
        class="gallery-item"
        @click="openLightbox(index)"
      >
        <img
          :src="image.path"
          :alt="image.alt"
          loading="lazy"
        >
      </div>
    </div>

    <div v-if="images.length === 0" class="gallery-empty">
      <p>No images available</p>
    </div>

    <!-- Lightbox -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="lightboxOpen" class="lightbox" @click.self="closeLightbox">
          <button class="lightbox-close" @click="closeLightbox">&times;</button>
          <button class="lightbox-prev" @click="prevImage">&larr;</button>
          <button class="lightbox-next" @click="nextImage">&rarr;</button>
          <img
            :src="currentImage?.path"
            :alt="currentImage?.alt"
            class="lightbox-image"
          >
          <div class="lightbox-counter">
            {{ currentIndex + 1 }} / {{ images.length }}
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import type { ProductImage } from '~/types/product'

const props = defineProps<{
  images: ProductImage[]
}>()

const lightboxOpen = ref(false)
const currentIndex = ref(0)

const currentImage = computed(() => props.images[currentIndex.value])

const openLightbox = (index: number) => {
  currentIndex.value = index
  lightboxOpen.value = true
}

const closeLightbox = () => {
  lightboxOpen.value = false
}

const nextImage = () => {
  currentIndex.value = (currentIndex.value + 1) % props.images.length
}

const prevImage = () => {
  currentIndex.value = currentIndex.value === 0 ? props.images.length - 1 : currentIndex.value - 1
}

// Keyboard navigation
onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})

const handleKeydown = (e: KeyboardEvent) => {
  if (!lightboxOpen.value) return
  if (e.key === 'Escape') closeLightbox()
  if (e.key === 'ArrowRight') nextImage()
  if (e.key === 'ArrowLeft') prevImage()
}
</script>

<style lang="less" scoped>
@import '~/assets/css/variables.less';

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: @spacing-sm;

  @media (max-width: @breakpoint-tablet) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: @breakpoint-mobile) {
    grid-template-columns: 1fr;
  }
}

.gallery-item {
  aspect-ratio: 1;
  overflow: hidden;
  border-radius: 4px;
  cursor: pointer;
  background: @background-color;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform @transition-normal;
  }

  &:hover img {
    transform: scale(1.05);
  }
}

.gallery-empty {
  padding: @spacing-xl;
  text-align: center;
  color: @text-light;
}

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
  background: none;
  border: none;
  color: white;
  font-size: 2rem;
  cursor: pointer;
  z-index: 1001;
}

.lightbox-prev,
.lightbox-next {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  font-size: 1.5rem;
  padding: @spacing-md;
  cursor: pointer;
  transition: background @transition-fast;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
}

.lightbox-prev {
  left: @spacing-md;
}

.lightbox-next {
  right: @spacing-md;
}

.lightbox-image {
  max-width: 90%;
  max-height: 90vh;
  object-fit: contain;
}

.lightbox-counter {
  position: absolute;
  bottom: @spacing-md;
  left: 50%;
  transform: translateX(-50%);
  color: white;
  font-size: 0.9rem;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity @transition-normal;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>