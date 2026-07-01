<template>
  <section class="trust-section">
    <div class="trust-container">
      <div class="stats-bar">
        <div v-for="(stat, index) in stats" :key="index" class="stat-item">
          <span class="stat-value" :class="{ 'stat-value--certs': index === 3 }">{{ stat.value }}</span>
          <span class="stat-label">{{ stat.label }}</span>
        </div>
      </div>

      <h2 class="features-title">{{ $t('home.whyChoose') }}</h2>
      <div class="features-grid">
        <div class="feature">
          <div class="feature-header">
            <div class="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <h3 class="feature-title">{{ $t('home.safetyFirst') }}</h3>
          </div>
          <p class="feature-text">{{ $t('home.safetyFirstText') }}</p>
        </div>
        <div class="feature">
          <div class="feature-header">
            <div class="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </div>
            <h3 class="feature-title">{{ $t('home.thoughtfulDesign') }}</h3>
          </div>
          <p class="feature-text">{{ $t('home.thoughtfulDesignText') }}</p>
        </div>
        <div class="feature">
          <div class="feature-header">
            <div class="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <h3 class="feature-title">{{ $t('home.builtToLast') }}</h3>
          </div>
          <p class="feature-text">{{ $t('home.builtToLastText') }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { $t } = useI18n()

const stats = computed(() => {
  const rawStats = $t('home.trust.stats')
  if (!Array.isArray(rawStats)) return []

  return rawStats.map((stat: any) => ({
    value: stat.value as string,
    label: stat.label as string,
  }))
})
</script>

<style lang="less" scoped>
@import '~/assets/css/variables.less';

.trust-section {
  padding: 100px 0;
  background: @primary-color;

  @media (max-width: @breakpoint-tablet) {
    padding: 60px 0;
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

.stats-bar {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: @spacing-lg;
  margin-bottom: @spacing-xxl;
  padding-bottom: @spacing-xxl;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);

  @media (max-width: @breakpoint-tablet) {
    grid-template-columns: repeat(2, 1fr);
    gap: @spacing-md;
    margin-bottom: @spacing-xl;
    padding-bottom: @spacing-xl;
  }
}

.stat-item {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 2.25rem;
  font-weight: 700;
  color: white;
  line-height: 1.2;

  @media (max-width: @breakpoint-tablet) {
    font-size: 1.75rem;
  }

  &--certs {
    font-size: 1.125rem;
    line-height: 1.35;
    letter-spacing: 0.01em;

    @media (max-width: @breakpoint-tablet) {
      font-size: 0.9375rem;
    }
  }
}

.stat-label {
  display: block;
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.75);
  margin-top: @spacing-xs;
}

.features-title {
  font-size: 2rem;
  font-weight: 700;
  color: white;
  text-align: center;
  margin: 0 0 @spacing-xxl;

  @media (max-width: @breakpoint-tablet) {
    font-size: 1.5rem;
    margin-bottom: @spacing-xl;
  }
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: @spacing-xl;

  @media (max-width: @breakpoint-tablet) {
    grid-template-columns: 1fr;
    gap: @spacing-lg;
  }
}

.feature {
  text-align: center;
  padding: @spacing-lg;
}

.feature-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: @spacing-sm;
  margin-bottom: @spacing-sm;
}

.feature-icon {
  color: white;
  opacity: 0.9;
  flex-shrink: 0;
}

.feature-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: white;
  margin: 0;
}

.feature-text {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  margin: 0;
}
</style>
