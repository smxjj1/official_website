<template>
  <div class="home-page">
    <HomeHeroCarousel />
    <HomeCategoryGrid />
    <HomeFeaturedCategories />
    <BenefitsCarousel />
    <HomeTrustSection />
    <HomeFAQ />
    <section class="final-cta">
      <div class="cta-container">
        <h2 class="cta-title">{{ $t('home.readyToExplore') }}</h2>
        <p class="cta-text">{{ $t('home.readyToExploreText') }}</p>
        <NuxtLink :to="getLocalePath('/contact-us')" class="cta-button">
          {{ $t('nav.contact') }}
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const { $t, getLocalePath } = useI18n()
</script>

<style lang="less" scoped>
@import '~/assets/css/variables.less';

.home-page {
  background: @background-color;
}

.final-cta {
  padding: 100px 0;
  background: @card-background;
  text-align: center;

  @media (max-width: @breakpoint-tablet) {
    padding: 60px 0;
  }
}

.cta-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 0 @spacing-md;
}

.cta-title {
  font-size: 2rem;
  font-weight: 700;
  color: @text-color;
  margin: 0 0 @spacing-md;

  @media (max-width: @breakpoint-tablet) {
    font-size: 1.5rem;
  }
}

.cta-text {
  font-size: 1rem;
  color: @text-light;
  margin: 0 0 @spacing-lg;
}

.cta-button {
  display: inline-block;
  padding: @spacing-md @spacing-xxl;
  background: @primary-color;
  color: @card-background;
  font-weight: 600;
  text-decoration: none;
  border-radius: @radius-sm;
  transition: background @transition-fast, transform @transition-fast;

  &:hover {
    background: lighten(@primary-color, 8%);
    transform: translateY(-2px);
  }
}
</style>
