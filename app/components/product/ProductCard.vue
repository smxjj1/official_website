<template>
  <article class="product-card">
    <NuxtLink :to="`/products/${category.slug}`" class="card-link">
      <div class="card-image">
        <img
          v-if="imageUrl"
          :src="imageUrl"
          :alt="category.name"
          loading="lazy"
        >
        <div v-else class="card-placeholder">
          <span>{{ category.name.charAt(0) }}</span>
        </div>
      </div>
      <div class="card-content">
        <h3 class="card-title">{{ category.name }}</h3>
        <p class="card-description">{{ category.hero.subheadline.slice(0, 60) }}...</p>
      </div>
    </NuxtLink>
  </article>
</template>

<script setup lang="ts">
import type { ProductCategory } from '~/types/product'

const props = defineProps<{
  category: ProductCategory
  imageUrl?: string
}>()
</script>

<style lang="less" scoped>
@import '~/assets/css/variables.less';

.product-card {
  background: @card-background;
  border-radius: 4px;
  overflow: hidden;
  transition: transform @transition-normal, box-shadow @transition-normal;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);

    .card-image img {
      transform: scale(1.05);
    }
  }
}

.card-link {
  display: block;
  text-decoration: none;
  color: inherit;
}

.card-image {
  aspect-ratio: 4/3;
  overflow: hidden;
  background: @background-color;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform @transition-normal;
  }
}

.card-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, @primary-color 0%, lighten(@primary-color, 10%) 100%);

  span {
    font-size: 3rem;
    font-weight: 700;
    color: @card-background;
  }
}

.card-content {
  padding: @spacing-md;

  @media (max-width: @breakpoint-tablet) {
    padding: @spacing-sm;
  }
}

.card-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: @text-color;
  margin: 0 0 @spacing-xs;
  letter-spacing: -0.01em;
}

.card-description {
  font-size: 0.85rem;
  color: @text-light;
  margin: 0;
  line-height: 1.5;
}
</style>