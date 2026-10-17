<template>
  <section class="qg-section">
    <div class="qg-inner">
      <div class="quality-col">
        <HomeSectionHeader
          :subtitle="$t('home.quality.subtitleTag')"
          :title="$t('home.quality.title')"
          :description="$t('home.quality.subtitle')"
        />
        <div class="cert-tags">
          <span v-for="cert in certs" :key="cert" class="cert-tag">{{ cert }}</span>
        </div>
        <div class="cert-docs">
          <a
            v-for="(img, index) in qualityImages"
            :key="index"
            :href="img"
            target="_blank"
            rel="noopener"
            class="cert-doc"
          >
            <OptimImg :src="img" :webp-src="img" alt="Certification document" loading="lazy" />
          </a>
        </div>
        <ol class="qc-steps">
          <li v-for="(step, index) in qcSteps" :key="index">
            <strong>{{ step.title }}</strong>
            <span>{{ step.text }}</span>
          </li>
        </ol>
      </div>

      <div class="global-col">
        <HomeSectionHeader
          :subtitle="$t('home.global.subtitleTag')"
          :title="$t('home.global.title')"
          :description="$t('home.global.subtitle')"
        />
        <OptimImg
          v-if="globalImage"
          :src="globalImage"
          :webp-src="globalImage"
          alt="Global partnership"
          class="global-hero"
          loading="lazy"
        />
        <div class="partner-grid">
          <article v-for="(item, index) in partners" :key="index" class="partner-card">
            <h3>{{ item.title }}</h3>
            <p>{{ item.text }}</p>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { $t } = useSiteLocale()

const qualityGlob = import.meta.glob(
  '~/assets/images/home/quality/*.webp',
  { eager: true, query: '?url', import: 'default' },
)
const globalGlob = import.meta.glob(
  '~/assets/images/home/global/*.webp',
  { eager: true, query: '?url', import: 'default' },
)

const qualityImages = computed(() => Object.values(qualityGlob) as string[])
const globalImage = computed(() => (Object.values(globalGlob) as string[])[0] || '')

const certs = computed(() => {
  const raw = $t('home.quality.certs')
  return Array.isArray(raw) ? raw.map(String) : []
})

const qcSteps = computed(() => {
  const raw = $t('home.quality.steps')
  if (!Array.isArray(raw)) return []
  return raw.map((item: any) => ({
    title: String(item.title || ''),
    text: String(item.text || ''),
  }))
})

const partners = computed(() => {
  const raw = $t('home.global.partners')
  if (!Array.isArray(raw)) return []
  return raw.map((item: any) => ({
    title: String(item.title || ''),
    text: String(item.text || ''),
  }))
})
</script>

<style lang="less" scoped>
@import '~/assets/css/variables.less';

.qg-section {
  padding: 96px 0;
  background: @section-background;

  @media (max-width: @breakpoint-tablet) {
    padding: 72px 0;
  }
}

.qg-inner {
  max-width: @breakpoint-wide;
  margin: 0 auto;
  padding: 0 @spacing-xl;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: @spacing-xxl;

  @media (max-width: @breakpoint-tablet) {
    grid-template-columns: 1fr;
    padding: 0 @spacing-md;
  }
}

.cert-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: @spacing-md;
}

.cert-tag {
  display: inline-block;
  padding: 0.35rem 0.75rem;
  border-radius: 999px;
  background: @card-background;
  border: 1px solid @border-color;
  color: @primary-color-dark;
  font-size: 0.8rem;
  font-weight: 600;
}

.cert-docs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: @spacing-sm;
  margin-bottom: @spacing-lg;
}

.cert-doc {
  display: block;
  border: 1px solid @border-color;
  border-radius: @radius-sm;
  overflow: hidden;
  background: @card-background;

  :deep(img) {
    width: 100%;
    height: 160px;
    object-fit: cover;
    object-position: top;
    display: block;
  }
}

.qc-steps {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: @spacing-sm;
}

.qc-steps li {
  background: @card-background;
  border-left: 3px solid @primary-color;
  padding: @spacing-sm @spacing-md;
  border-radius: 0 @radius-sm @radius-sm 0;

  strong {
    display: block;
    color: @text-color;
    margin-bottom: 0.2rem;
  }

  span {
    color: @text-light-accessible;
    font-size: 0.88rem;
    line-height: 1.5;
  }
}

.global-hero {
  width: 100%;
  height: 220px;
  object-fit: cover;
  border-radius: @radius-md;
  margin-bottom: @spacing-lg;
  display: block;
  background: @card-background;
}

.partner-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: @spacing-md;
}

.partner-card {
  background: @card-background;
  border: 1px solid @border-color;
  border-radius: @radius-md;
  padding: @spacing-md;

  h3 {
    margin: 0 0 0.35rem;
    color: @primary-color-dark;
    font-size: 1rem;
  }

  p {
    margin: 0;
    color: @text-light-accessible;
    font-size: 0.88rem;
  }
}
</style>
