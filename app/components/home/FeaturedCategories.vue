<template>
  <div class="featured-categories">
    <section class="featured-intro">
      <div class="intro-container">
        <HomeSectionHeader
          :subtitle="$t('home.featured.subtitleTag')"
          :title="$t('home.featured.title')"
          :description="$t('home.featured.subtitle')"
        />
      </div>
    </section>

    <section
      v-for="(category, index) in categories"
      :key="category.slug"
      class="category-section"
      :class="[`layout-${getLayoutType(index)}`, `section-${index + 1}`]"
    >
      <div class="section-inner">
      <div class="content-side">
        <span class="category-label">{{ getCategoryLabel(index) }}</span>
        <h2 class="category-title">{{ category.name }}</h2>
        <p class="category-description">{{ getCategoryDescription(category.slug) }}</p>
        <NuxtLink
          :to="getLocalePath(getCategoryLink(category.slug))"
          class="category-cta"
        >
          {{ $t('home.viewAll') }} {{ category.name }}
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </NuxtLink>
      </div>

      <div class="image-side">
        <div class="image-grid" :class="`grid-${getGridStyle(index)}`">
          <div
            v-for="(image, imgIndex) in category.images.slice(0, 5)"
            :key="imgIndex"
            class="image-card"
          >
            <OptimImg
              :src="image.src"
              :webp-src="image.webpSrc"
              :alt="image.alt"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const { $t } = useSiteLocale()
const {
  categories,
  getCategoryLink,
  getCategoryDescription,
  getCategoryLabel,
  getLayoutType,
  getGridStyle,
  getLocalePath,
} = useHomePage()
</script>

<style lang="less" scoped>
@import '~/assets/css/variables.less';

.featured-categories {
  overflow: hidden;
}

.featured-intro {
  padding: 100px 0 0;
  background: @devide-background;

  @media (max-width: @breakpoint-tablet) {
    padding-top: 72px;
  }
}

.intro-container {
  max-width: @breakpoint-wide;
  margin: 0 auto;
  padding: 0 @spacing-xl;

  @media (max-width: @breakpoint-tablet) {
    padding: 0 @spacing-md;
  }
}

.category-section {
  padding: 100px 0;
  min-height: 70vh;
  display: flex;
  align-items: center;

  @media (max-width: @breakpoint-tablet) {
    padding: 60px 0;
    min-height: auto;
  }
}

.section-1,
.section-3,
.section-5 {
  background: @card-background;
}

.section-2,
.section-4,
.section-6 {
  background: @devide-background;
}

.section-inner {
  max-width: @breakpoint-wide;
  margin: 0 auto;
  padding: 0 @spacing-xl;
  display: flex;
  gap: @spacing-xxl;
  align-items: center;

  @media (max-width: @breakpoint-tablet) {
    flex-direction: column !important;
    padding: 0 @spacing-md;
    gap: @spacing-xl;
  }
}

.layout-left .section-inner { flex-direction: row; }
.layout-right .section-inner { flex-direction: row-reverse; }

.layout-center .section-inner {
  flex-direction: column;
  text-align: center;
}

.layout-center .image-side { width: 100%; }
.layout-center .category-cta { align-self: center; }

.content-side {
  flex: 1;

  @media (max-width: @breakpoint-tablet) {
    text-align: center;
  }
}

.category-label {
  display: inline-block;
  font-size: 0.875rem;
  font-weight: 600;
  color: @primary-color;
  letter-spacing: 0.1em;
  margin-bottom: @spacing-sm;
}

.category-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: @text-color;
  margin: 0 0 @spacing-md;
  letter-spacing: -0.02em;

  @media (max-width: @breakpoint-tablet) {
    font-size: 2rem;
  }
}

.category-description {
  font-size: 1rem;
  color: @text-light;
  line-height: 1.7;
  margin: 0 0 @spacing-lg;
}

.category-cta {
  display: inline-flex;
  align-items: center;
  gap: @spacing-sm;
  padding: @spacing-sm @spacing-lg;
  background: @primary-color;
  color: @card-background;
  font-weight: 600;
  text-decoration: none;
  border-radius: @radius-sm;
  transition: background @transition-fast, transform @transition-fast;

  &:hover {
    background: lighten(@primary-color, 8%);
    transform: translateX(4px);
  }

  svg { transition: transform @transition-fast; }
  &:hover svg { transform: translateX(4px); }
}

.image-side { flex: 1.2; }

.image-grid {
  display: grid;
  gap: @spacing-md;

  &.grid-a {
    grid-template-columns: repeat(2, 1fr);
    .image-card:first-child { grid-row: span 2; }
  }

  &.grid-b {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: repeat(2, 1fr);
  }

  &.grid-c {
    grid-template-columns: repeat(4, 1fr);

    @media (max-width: @breakpoint-tablet) {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: @breakpoint-tablet) {
    &.grid-a,
    &.grid-b {
      grid-template-columns: repeat(2, 1fr);
      .image-card:first-child { grid-row: auto; }
    }
  }
}

.image-card {
  aspect-ratio: 1;
  border-radius: @radius-md;
  overflow: hidden;
  background: @background-color;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);

    img { transform: scale(1.08); }
  }
}
</style>
