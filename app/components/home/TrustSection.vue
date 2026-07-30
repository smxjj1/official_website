<template>
  <section class="trust-section">
    <div class="trust-container">
      <div class="trust-header">
        <span class="trust-tag">{{ $t('home.trust.tag') }}</span>
        <h2 class="trust-title">{{ $t('home.trust.title') }}</h2>
        <p class="trust-subtitle">{{ $t('home.trust.subtitle') }}</p>
      </div>

      <div class="stats-bar">
        <div v-for="(stat, index) in stats" :key="index" class="stat-item">
          <span class="stat-value" :class="{ 'stat-value--certs': index === 3 }">{{ stat.value }}</span>
          <span class="stat-label">{{ stat.label }}</span>
        </div>
      </div>

      <div class="highlights-grid">
        <div v-for="(item, index) in highlights" :key="index" class="highlight-card">
          <span class="highlight-index">{{ String(index + 1).padStart(2, '0') }}</span>
          <h3 class="highlight-title">{{ item.title }}</h3>
          <p class="highlight-text">{{ item.text }}</p>
        </div>
      </div>

      <div class="trust-cta-wrap">
        <NuxtLink :to="getLocalePath('/contact-us')" class="trust-cta">
          {{ $t('home.trust.ctaText') }}
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { $t, getLocalePath } = useSiteLocale()

const stats = computed(() => {
  const rawStats = $t('home.trust.stats')
  if (!Array.isArray(rawStats)) return []

  return rawStats.map((stat: any) => ({
    value: stat.value as string,
    label: stat.label as string,
  }))
})

const highlights = computed(() => {
  const raw = $t('home.trust.highlights')
  if (!Array.isArray(raw)) return []

  return raw.map((item: any) => ({
    title: item.title as string,
    text: item.text as string,
  }))
})
</script>

<style lang="less" scoped>
@import '~/assets/css/variables.less';

.trust-section {
  padding: 96px 0;
  background: @primary-color-dark;

  @media (max-width: @breakpoint-tablet) {
    padding: 72px 0;
  }
}

.trust-container {
  max-width: @breakpoint-wide;
  margin: 0 auto;
  padding: 0 @spacing-xl;

  @media (max-width: @breakpoint-tablet) {
    padding: 0 @spacing-md;
  }
}

.trust-header {
  text-align: center;
  max-width: 760px;
  margin: 0 auto @spacing-xxl;

  @media (max-width: @breakpoint-tablet) {
    margin-bottom: @spacing-xl;
  }
}

.trust-tag {
  display: inline-block;
  font-size: 0.875rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.8);
  letter-spacing: 0.15em;
  text-transform: uppercase;
  margin-bottom: @spacing-md;
}

.trust-title {
  font-size: 2.25rem;
  font-weight: 700;
  color: white;
  margin: 0 0 @spacing-md;
  letter-spacing: -0.02em;
  line-height: 1.25;

  @media (max-width: @breakpoint-tablet) {
    font-size: 1.75rem;
  }
}

.trust-subtitle {
  margin: 0;
  font-size: 1.0625rem;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.88);
}

.stats-bar {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: @radius-md;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.04);
  margin-bottom: @spacing-xxl;

  @media (max-width: @breakpoint-tablet) {
    grid-template-columns: repeat(2, 1fr);
    margin-bottom: @spacing-xl;
  }
}

.stat-item {
  text-align: center;
  display: grid;
  grid-template-rows: 1fr auto;
  align-items: end;
  justify-items: center;
  min-height: 8.5rem;
  padding: @spacing-xl @spacing-md;
  position: relative;

  &:not(:last-child)::after {
    content: '';
    position: absolute;
    top: 20%;
    right: 0;
    width: 1px;
    height: 60%;
    background: rgba(255, 255, 255, 0.18);
  }

  @media (max-width: @breakpoint-tablet) {
    min-height: 7rem;
    padding: @spacing-lg @spacing-md;

    &:nth-child(2n)::after {
      display: none;
    }

    &:nth-child(-n+2) {
      border-bottom: 1px solid rgba(255, 255, 255, 0.18);
    }
  }
}

.stat-value {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  font-size: 2.75rem;
  font-weight: 700;
  color: white;
  line-height: 1.15;
  width: 100%;

  @media (max-width: @breakpoint-tablet) {
    font-size: 2rem;
  }

  &--certs {
    font-size: 1.5rem;
    line-height: 1.25;
    letter-spacing: 0.01em;
    max-width: 14em;

    @media (max-width: @breakpoint-tablet) {
      font-size: 1.125rem;
    }
  }
}

.stat-label {
  display: block;
  font-size: 0.9375rem;
  color: rgba(255, 255, 255, 0.92);
  margin-top: @spacing-sm;
  line-height: 1.3;
}

.highlights-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: @spacing-lg;
  margin-bottom: @spacing-xxl;

  @media (max-width: @breakpoint-desktop) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: @breakpoint-mobile) {
    grid-template-columns: 1fr;
    gap: @spacing-md;
    margin-bottom: @spacing-xl;
  }
}

.highlight-card {
  padding: @spacing-lg;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: @radius-md;
  background: rgba(255, 255, 255, 0.05);
  transition: background @transition-fast, transform @transition-fast;

  &:hover {
    background: rgba(255, 255, 255, 0.09);
    transform: translateY(-2px);
  }
}

.highlight-index {
  display: inline-block;
  font-size: 0.8125rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: rgba(255, 255, 255, 0.55);
  margin-bottom: @spacing-sm;
}

.highlight-title {
  margin: 0 0 @spacing-sm;
  font-size: 1.125rem;
  font-weight: 700;
  color: white;
  line-height: 1.35;
}

.highlight-text {
  margin: 0;
  font-size: 0.9375rem;
  line-height: 1.65;
  color: rgba(255, 255, 255, 0.88);
}

.trust-cta-wrap {
  text-align: center;
}

.trust-cta {
  display: inline-flex;
  align-items: center;
  gap: @spacing-sm;
  padding: @spacing-sm @spacing-xl;
  background: white;
  color: @primary-color-dark;
  font-weight: 600;
  text-decoration: none;
  border-radius: @radius-sm;
  transition: transform @transition-fast, box-shadow @transition-fast;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.18);
  }
}
</style>
