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
            <h3>{{ $t('home.process.ctaTitle') }}</h3>
            <p>{{ $t('home.process.ctaText') }}</p>
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
  align-items: start;

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
}

.cta-image {
  width: 100%;
  height: 180px;
  object-fit: cover;
  display: block;
}

.cta-body {
  padding: @spacing-lg;
}

.cta-body h3 {
  margin: 0 0 @spacing-sm;
  color: @text-color;
}

.cta-body p {
  margin: 0 0 @spacing-lg;
  color: @text-light-accessible;
  line-height: 1.6;
}

.cta-btn {
  display: inline-block;
  padding: 0.75rem 1.25rem;
  background: @primary-color-dark;
  color: #fff;
  text-decoration: none;
  border-radius: @radius-sm;
  font-weight: 600;

  &:hover {
    background: lighten(@primary-color-dark, 6%);
  }
}
</style>
