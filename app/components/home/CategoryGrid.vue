<template>
  <section class="category-grid-section">
    <div class="section-container">
      <div class="section-header">
        <h2 class="section-title">{{ $t('home.categories.title') }}</h2>
        <p class="section-subtitle">{{ $t('home.categories.subtitle') }}</p>
      </div>

      <div class="category-grid">
        <NuxtLink
          v-for="category in categories"
          :key="category.slug"
          :to="getLocalePath(getCategoryLink(category.slug))"
          class="category-card"
        >
          <div class="card-image">
            <img
              v-if="category.images[0]"
              :src="category.images[0].src"
              :alt="category.images[0].alt"
              loading="lazy"
            >
          </div>
          <div class="card-body">
            <h3 class="card-title">{{ category.name }}</h3>
            <span class="card-count">
              {{ getCategoryProductCount(category.slug) }} {{ $t('home.products') }}
            </span>
          </div>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { $t } = useI18n()
const {
  categories,
  getCategoryLink,
  getCategoryProductCount,
  getLocalePath,
} = useHomePage()
</script>

<style lang="less" scoped>
@import '~/assets/css/variables.less';

.category-grid-section {
  padding: 100px 0;
  background: @card-background;

  @media (max-width: @breakpoint-tablet) {
    padding: 60px 0;
  }
}

.section-container {
  max-width: @breakpoint-wide;
  margin: 0 auto;
  padding: 0 @spacing-xl;

  @media (max-width: @breakpoint-tablet) {
    padding: 0 @spacing-md;
  }
}

.section-header {
  text-align: center;
  margin-bottom: @spacing-xxl;

  @media (max-width: @breakpoint-tablet) {
    margin-bottom: @spacing-xl;
  }
}

.section-title {
  font-size: 2.25rem;
  font-weight: 700;
  color: @text-color;
  margin: 0 0 @spacing-sm;

  @media (max-width: @breakpoint-tablet) {
    font-size: 1.75rem;
  }
}

.section-subtitle {
  font-size: 1rem;
  color: @text-light;
  margin: 0;
  max-width: 560px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: @spacing-lg;

  @media (max-width: @breakpoint-desktop) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: @breakpoint-mobile) {
    grid-template-columns: 1fr;
  }
}

.category-card {
  display: block;
  text-decoration: none;
  background: @background-color;
  border-radius: @radius-lg;
  overflow: hidden;
  border: 1px solid @border-light;
  transition: transform @transition-normal, box-shadow @transition-normal;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 28px rgba(74, 64, 58, 0.12);

    .card-image img {
      transform: scale(1.05);
    }
  }
}

.card-image {
  aspect-ratio: 4/3;
  overflow: hidden;
  background: @devide-background;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }
}

.card-body {
  padding: @spacing-md @spacing-lg @spacing-lg;
}

.card-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: @text-color;
  margin: 0 0 @spacing-xs;
}

.card-count {
  font-size: 0.875rem;
  color: @secondary-color;
  font-weight: 500;
}
</style>
