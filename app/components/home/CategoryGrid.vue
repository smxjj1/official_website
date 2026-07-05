<template>
  <section class="category-grid-section">
    <div class="section-container">
      <HomeSectionHeader
        :subtitle="$t('home.categories.subtitleTag')"
        :title="$t('home.categories.title')"
        :description="$t('home.categories.subtitle')"
      />

      <div class="products-grid">
        <NuxtLink
          v-for="category in categories"
          :key="category.slug"
          :to="getLocalePath(getCategoryLink(category.slug))"
          class="product-item"
        >
          <div class="product-image">
            <OptimImg
              v-if="category.images[0]"
              :src="category.images[0].src"
              :webp-src="category.images[0].webpSrc"
              :alt="category.images[0].alt"
              loading="lazy"
            />
          </div>
          <div class="product-content">
            <h3>{{ category.name }}</h3>
            <p>
              {{ getCategoryProductCount(category.slug) }} {{ $t('home.products') }}
              · {{ getCategoryDescription(category.slug) }}
            </p>
          </div>
        </NuxtLink>
      </div>

      <div class="cta-wrapper">
        <NuxtLink :to="getLocalePath('/baby-feeding-bottles')" class="cta-btn">
          {{ $t('home.categories.viewAllCta') }}
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { $t } = useSiteLocale()
const {
  categories,
  getCategoryLink,
  getCategoryProductCount,
  getCategoryDescription,
  getLocalePath,
} = useHomePage()
</script>

<style lang="less" scoped>
@import '~/assets/css/variables.less';

.category-grid-section {
  padding: 100px 0;
  background: @card-background;

  @media (max-width: @breakpoint-tablet) {
    padding: 72px 0;
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

.products-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: @spacing-lg;
  margin-bottom: @spacing-xxl;

  @media (max-width: @breakpoint-desktop) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: @breakpoint-mobile) {
    grid-template-columns: 1fr;
  }
}

.product-item {
  position: relative;
  display: block;
  border-radius: @radius-md;
  overflow: hidden;
  text-decoration: none;

  &:hover {
    .product-image :deep(.optim-img) {
      transform: scale(1.08);
    }

    .product-content {
      background: linear-gradient(
        to top,
        fade(@primary-color-dark, 92%) 0%,
        fade(@primary-color-dark, 75%) 55%,
        transparent 100%
      );
    }
  }
}

.product-image {
  overflow: hidden;
  height: 280px;
  background: @devide-background;

  :deep(.optim-img) {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }

  @media (max-width: @breakpoint-mobile) {
    height: 240px;
  }
}

.product-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: @spacing-lg @spacing-xl;
  background: linear-gradient(
    to top,
    rgba(74, 64, 58, 0.88) 0%,
    rgba(74, 64, 58, 0.72) 55%,
    transparent 100%
  );
  transition: background 0.35s ease;

  h3 {
    font-size: 1.375rem;
    font-weight: 700;
    color: white;
    margin: 0 0 @spacing-xs;
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);
  }

  p {
    font-size: 0.9375rem;
    color: rgba(255, 255, 255, 0.9);
    margin: 0;
    line-height: 1.5;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  }

  @media (max-width: @breakpoint-mobile) {
    padding: @spacing-md @spacing-lg @spacing-sm;

    h3 {
      font-size: 1.125rem;
      margin-bottom: 2px;
    }

    p {
      font-size: 0.8125rem;
      -webkit-line-clamp: 1;
      color: rgba(255, 255, 255, 0.82);
    }

    background: linear-gradient(
      to top,
      rgba(74, 64, 58, 0.72) 0%,
      rgba(74, 64, 58, 0.38) 65%,
      transparent 100%
    );
  }
}

.cta-wrapper {
  text-align: center;
}

.cta-btn {
  display: inline-block;
  padding: @spacing-md @spacing-xxl;
  background: @primary-color-dark;
  color: white;
  font-size: 1.0625rem;
  font-weight: 600;
  border-radius: @radius-sm;
  text-decoration: none;
  transition: background @transition-fast, transform @transition-fast;

  &:hover {
    background: lighten(@primary-color-dark, 6%);
    transform: translateY(-2px);
  }
}
</style>
