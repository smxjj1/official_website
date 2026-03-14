<template>
  <div class="products-page">
    <section class="page-header">
      <div class="header-container">
        <h1 class="page-title">Our Products</h1>
        <p class="page-subtitle">
          Discover our complete range of baby products designed for safety, comfort, and convenience.
        </p>
      </div>
    </section>

    <section class="products-content">
      <div class="content-container">
        <ProductGrid :categories="categories" />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { getAllCategories } from '~/data/product-categories'

definePageMeta({
  layout: 'default',
})

useProductsPageSeo()

const categories = getAllCategories()
</script>

<style lang="less" scoped>
@import '~/assets/css/variables.less';

.products-page {
  background: @background-color;
  min-height: 100vh;
}

.page-header {
  background: @card-background;
  padding: @spacing-xxl @spacing-md;
  text-align: center;
  border-bottom: 1px solid @border-color;

  @media (max-width: @breakpoint-tablet) {
    padding: @spacing-xl @spacing-sm;
  }
}

.header-container {
  max-width: @breakpoint-desktop;
  margin: 0 auto;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: @text-color;
  margin: 0 0 @spacing-sm;
  letter-spacing: -0.02em;

  @media (max-width: @breakpoint-tablet) {
    font-size: 2rem;
  }
}

.page-subtitle {
  font-size: 1.1rem;
  color: @text-light;
  margin: 0;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;

  @media (max-width: @breakpoint-tablet) {
    font-size: 1rem;
  }
}

.products-content {
  padding: @spacing-xl @spacing-md;

  @media (max-width: @breakpoint-tablet) {
    padding: @spacing-lg @spacing-sm;
  }
}

.content-container {
  max-width: @breakpoint-wide;
  margin: 0 auto;
}
</style>