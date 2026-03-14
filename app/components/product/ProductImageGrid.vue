<template>
  <section class="image-group">
    <header v-if="showHeader" class="group-header">
      <h3 class="group-title">{{ groupName }}</h3>
      <span class="group-count">{{ imageCount }} products</span>
    </header>

    <div class="image-grid" :class="gridClass">
      <div
        v-for="(image, index) in images"
        :key="image.filename"
        class="image-item"
        @click="$emit('image-click', index)"
      >
        <img
          :src="image.src"
          :alt="image.alt"
          :loading="index < lazyThreshold ? 'eager' : 'lazy'"
          class="image"
        />
        <div class="image-overlay">
          <span class="zoom-icon">
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

    <div v-if="images.length === 0" class="empty-state">
      <p>No images in this group</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { ProductImage } from '~/composables/useCategorizedProducts'

const props = withDefaults(defineProps<{
  groupName: string
  images: ProductImage[]
  imageCount: number
  showHeader?: boolean
  columns?: 2 | 3 | 4 | 5
  lazyThreshold?: number
}>(), {
  showHeader: true,
  columns: 4,
  lazyThreshold: 8,
})

defineEmits<{
  'image-click': [index: number]
}>()

const gridClass = computed(() => `cols-${props.columns}`)
</script>

<style lang="less" scoped>
@import '~/assets/css/variables.less';

.image-group {
  margin-bottom: @spacing-xl;

  &:last-child {
    margin-bottom: 0;
  }
}

.group-header {
  display: flex;
  align-items: baseline;
  gap: @spacing-sm;
  margin-bottom: @spacing-md;
  padding-bottom: @spacing-sm;
  border-bottom: 1px solid @border-color;
}

.group-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: @text-color;
  margin: 0;

  @media (max-width: @breakpoint-tablet) {
    font-size: 1.1rem;
  }
}

.group-count {
  font-size: 0.85rem;
  color: @text-light;
}

.image-grid {
  display: grid;
  gap: @spacing-sm;

  &.cols-2 {
    grid-template-columns: repeat(2, 1fr);
  }

  &.cols-3 {
    grid-template-columns: repeat(3, 1fr);

    @media (max-width: @breakpoint-mobile) {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  &.cols-4 {
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

  &.cols-5 {
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

.image-item {
  position: relative;
  aspect-ratio: 1;
  overflow: hidden;
  border-radius: 4px;
  background: @background-color;
  cursor: pointer;
  transition: box-shadow @transition-normal;

  &:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);

    .image-overlay {
      opacity: 1;
    }

    .image {
      transform: scale(1.05);
    }
  }
}

.image {
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
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity @transition-fast;
}

.zoom-icon {
  color: white;
  opacity: 0.9;
}

.empty-state {
  padding: @spacing-xl;
  text-align: center;
  background: @background-color;
  border-radius: 4px;

  p {
    color: @text-light;
    margin: 0;
  }
}
</style>