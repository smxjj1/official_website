<template>
  <section class="process-section">
    <div class="process-inner">
      <HomeSectionHeader
        :subtitle="$t('home.process.subtitleTag')"
        :title="$t('home.process.title')"
        :description="$t('home.process.subtitle')"
      />

      <div class="process-layout">
        <ol class="process-steps">
          <li v-for="(step, index) in steps" :key="index" class="process-step">
            <span class="step-num">{{ String(index + 1).padStart(2, '0') }}</span>
            <div>
              <h3>{{ step.title }}</h3>
              <p>{{ step.text }}</p>
            </div>
          </li>
        </ol>

        <aside class="process-cta-card">
          <OptimImg
            v-if="ctaImage"
            :src="ctaImage"
            :webp-src="ctaImage"
            alt=""
            class="cta-image"
            loading="lazy"
          />
          <div class="cta-body">
            <ul class="cta-points">
              <li v-for="(item, index) in ctaItems" :key="index" class="cta-point">
                <h3>{{ item.title }}</h3>
                <p>{{ item.text }}</p>
              </li>
            </ul>
            <NuxtLink :to="getLocalePath('/contact-us')" class="cta-btn">
              {{ $t('home.process.ctaButton') }}
            </NuxtLink>
          </div>
        </aside>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { $t, getLocalePath } = useSiteLocale()

const processImages = import.meta.glob(
  '~/assets/images/home/process/*.webp',
  { eager: true, query: '?url', import: 'default' },
)

const ctaImage = computed(() => {
  const values = Object.values(processImages) as string[]
  return values[0] || ''
})

const steps = computed(() => {
  const raw = $t('home.process.steps')
  if (!Array.isArray(raw)) return []
  return raw.map((item: any) => ({
    title: String(item.title || ''),
    text: String(item.text || ''),
  }))
})

const ctaItems = computed(() => {
  const raw = $t('home.process.ctaItems')
  if (Array.isArray(raw) && raw.length) {
    return raw.map((item: any) => ({
      title: String(item.title || ''),
      text: String(item.text || ''),
    }))
  }
  return [{
    title: String($t('home.process.ctaTitle') || ''),
    text: String($t('home.process.ctaText') || ''),
  }]
})
</script>

<style lang="less" scoped>
@import '~/assets/css/variables.less';

.process-section {
  padding: 96px 0;
  background: @section-background;

  @media (max-width: @breakpoint-tablet) {
    padding: 72px 0;
  }
}

.process-inner {
  max-width: @breakpoint-wide;
  margin: 0 auto;
  padding: 0 @spacing-xl;

  @media (max-width: @breakpoint-tablet) {
    padding: 0 @spacing-md;
  }
}

.process-layout {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: @spacing-xl;
  align-items: stretch;

  @media (max-width: @breakpoint-tablet) {
    grid-template-columns: 1fr;
  }
}

.process-steps {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: @spacing-md;
}

.process-step {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: @spacing-md;
  background: @card-background;
  border: 1px solid @border-color;
  border-radius: @radius-md;
  padding: @spacing-md @spacing-lg;
}

.step-num {
  font-weight: 700;
  color: @primary-color-dark;
  font-size: 0.95rem;
}

.process-step h3 {
  margin: 0 0 0.35rem;
  font-size: 1.05rem;
  color: @text-color;
}

.process-step p {
  margin: 0;
  font-size: 0.9rem;
  color: @text-light-accessible;
  line-height: 1.55;
}

.process-cta-card {
  background: @card-background;
  border: 1px solid @border-color;
  border-radius: @radius-md;
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.cta-image {
  width: 100%;
  height: 180px;
  object-fit: cover;
  display: block;
  flex-shrink: 0;
}

.cta-body {
  padding: @spacing-lg;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.cta-body .cta-btn {
  margin-top: auto;
}

.cta-points {
  list-style: none;
  margin: 0 0 @spacing-lg;
  padding: 0;
  display: grid;
  gap: @spacing-md;
  flex: 1;
}

.cta-point {
  padding-bottom: @spacing-md;
  border-bottom: 1px solid @border-color;

  &:last-child {
    padding-bottom: 0;
    border-bottom: none;
  }
}

.cta-point h3 {
  margin: 0 0 0.35rem;
  font-size: 1.05rem;
  color: @text-color;
}

.cta-point p {
  margin: 0;
  font-size: 0.9rem;
  color: @text-light-accessible;
  line-height: 1.55;
}

.cta-btn {
  display: inline-block;
  padding: 0.75rem 1.25rem;
  background: @primary-color-dark;
  color: #fff;
  text-decoration: none;
  border-radius: @radius-sm;
  font-weight: 600;
  align-self: flex-start;

  &:hover {
    background: lighten(@primary-color-dark, 6%);
  }
}
</style>
