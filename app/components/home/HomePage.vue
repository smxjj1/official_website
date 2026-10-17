<template>
  <div class="home-page">
    <HomeHeroCarousel />
    <LazyHomeStatsBar />
    <LazyHomeCategoryGrid />
    <LazyHomeWhyChoose />
    <LazyHomeProcessFlow />
    <LazyHomeMaterialsFactory />
    <LazyHomeQualityGlobal />
    <LazyHomeFAQ />
    <section class="final-cta">
      <div class="cta-bg">
        <div class="cta-container">
          <span class="cta-tag">{{ $t('home.ctaBottom.tag') }}</span>
          <h2 class="cta-title">{{ $t('home.ctaBottom.title') }}</h2>
          <p class="cta-text">{{ $t('home.ctaBottom.description') }}</p>
          <div class="cta-buttons">
            <NuxtLink :to="getLocalePath('/contact-us')" class="cta-button primary">
              {{ $t('home.ctaBottom.primaryCta') }}
            </NuxtLink>
            <NuxtLink :to="getLocalePath('/contact-us')" class="cta-button secondary">
              {{ $t('home.ctaBottom.secondaryCta') }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const { $t, getLocalePath } = useSiteLocale()

useHomeSeo()
</script>

<style lang="less" scoped>
@import '~/assets/css/variables.less';

.home-page {
  overflow-x: hidden;
  background: @background-color;
}

.final-cta {
  .cta-bg {
    position: relative;
    padding: 88px 0;
    background: linear-gradient(135deg, darken(@text-color, 8%) 0%, #2a221c 100%);
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(@primary-color, 0.25) 0%, transparent 60%);
      pointer-events: none;
    }

    @media (max-width: @breakpoint-tablet) {
      padding: 64px 0;
    }
  }
}

.cta-container {
  position: relative;
  max-width: 800px;
  margin: 0 auto;
  padding: 0 @spacing-xl;
  text-align: center;

  @media (max-width: @breakpoint-tablet) {
    padding: 0 @spacing-md;
  }
}

.cta-tag {
  display: inline-block;
  font-size: 0.8125rem;
  font-weight: 600;
  color: lighten(@primary-color, 12%);
  letter-spacing: 0.15em;
  text-transform: uppercase;
  padding: 8px 20px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 999px;
  margin-bottom: @spacing-lg;
}

.cta-title {
  font-size: 2.35rem;
  font-weight: 700;
  color: white;
  margin: 0 0 @spacing-lg;
  line-height: 1.25;

  @media (max-width: @breakpoint-tablet) {
    font-size: 1.75rem;
  }
}

.cta-text {
  font-size: 1.05rem;
  color: rgba(255, 255, 255, 0.82);
  line-height: 1.75;
  margin: 0 0 @spacing-xl;
}

.cta-buttons {
  display: flex;
  justify-content: center;
  gap: @spacing-md;
  flex-wrap: wrap;
}

.cta-button {
  display: inline-block;
  padding: @spacing-md @spacing-xxl;
  font-size: 1.0625rem;
  font-weight: 600;
  text-decoration: none;
  border-radius: @radius-sm;
  transition: transform @transition-fast, background @transition-fast, border-color @transition-fast;

  &.primary {
    background: @primary-color-dark;
    color: white;

    &:hover {
      background: lighten(@primary-color-dark, 6%);
      transform: translateY(-2px);
    }
  }

  &.secondary {
    background: transparent;
    color: white;
    border: 2px solid rgba(255, 255, 255, 0.45);

    &:hover {
      border-color: white;
      background: rgba(255, 255, 255, 0.08);
      transform: translateY(-2px);
    }
  }

  @media (max-width: @breakpoint-mobile) {
    width: 100%;
    max-width: 320px;
    text-align: center;
  }
}
</style>
