<template>
  <div class="product-grid">
    <ProductCard
      v-for="category in categories"
      :key="category.slug"
      :category="category"
      :image-url="getCategoryImageUrl(category.imageFolder)"
    />
  </div>
</template>

<script setup lang="ts">
import type { ProductCategory } from '~/types/product'
import { useProductImages } from '~/composables/useProductImages'

const props = defineProps<{
  categories: ProductCategory[]
}>()

const { getCategoryImages } = useProductImages()

const getCategoryImageUrl = (folder: string): string | undefined => {
  const images = getCategoryImages(folder)
  return images.length > 0 ? images[0].path : undefined
}
</script>

<style lang="less" scoped>
@import '~/assets/css/variables.less';

.product-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: @spacing-md;

  @media (max-width: @breakpoint-desktop) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: @breakpoint-tablet) {
    grid-template-columns: repeat(2, 1fr);
    gap: @spacing-sm;
  }

  @media (max-width: @breakpoint-mobile) {
    grid-template-columns: 1fr;
  }
}
</style>