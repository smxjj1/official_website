<template>
  <section class="qg-section">
    <div class="qg-inner">
      <div class="quality-col">
        <HomeSectionHeader
          :subtitle="$t('home.quality.subtitleTag')"
          :title="$t('home.quality.title')"
          :description="$t('home.quality.subtitle')"
        />

        <div class="quality-pillars">
          <article
            v-for="(item, index) in pillars"
            :key="index"
            class="quality-pillar"
          >
            <div v-if="item.logoSrc" class="pillar-logo">
              <OptimImg
                :src="item.logoSrc"
                :webp-src="item.logoSrc"
                :alt="item.value"
                loading="lazy"
              />
            </div>
            <strong>{{ item.value }}</strong>
            <span>{{ item.label }}</span>
          </article>
        </div>

        <div class="compliance-block">
          <h3 class="compliance-title">{{ $t('home.quality.complianceTitle') }}</h3>
          <div class="cert-tags">
            <span v-for="cert in certs" :key="cert" class="cert-tag">{{ cert }}</span>
          </div>
        </div>

        <h3 class="docs-title">{{ $t('home.quality.docsTitle') }}</h3>
        <div class="cert-docs">
          <a
            v-for="(doc, index) in qualityDocs"
            :key="index"
            :href="doc.src"
            target="_blank"
            rel="noopener"
            class="cert-doc"
          >
            <OptimImg :src="doc.src" :webp-src="doc.src" :alt="doc.alt" loading="lazy" />
          </a>
        </div>

        <ol class="qc-steps">
          <li v-for="(step, index) in qcSteps" :key="index">
            <span class="qc-no">{{ step.no }}</span>
            <div class="qc-body">
              <strong>{{ step.title }}</strong>
              <span>{{ step.text }}</span>
            </div>
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

        <h3 class="block-title">{{ $t('home.global.marketsTitle') }}</h3>
        <div class="market-grid">
          <div v-for="(item, index) in markets" :key="index" class="market-card">
            <strong>{{ item.value }}</strong>
            <span>{{ item.label }}</span>
          </div>
        </div>

        <h3 class="block-title">{{ $t('home.global.partnersTitle') }}</h3>
        <div class="partner-grid">
          <article v-for="(item, index) in partners" :key="index" class="partner-card">
            <h3>{{ item.title }}</h3>
            <p>{{ item.text }}</p>
          </article>
        </div>

        <ul class="strength-list">
          <li v-for="(item, index) in globalStrengths" :key="index">{{ item }}</li>
        </ul>

        <NuxtLink :to="getLocalePath('/contact-us')" class="global-cta">
          {{ $t('home.global.ctaButton') }}
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { $t, getLocalePath } = useSiteLocale()

const qualityGlob = import.meta.glob(
  '~/assets/images/home/quality/*.webp',
  { eager: true, query: '?url', import: 'default' },
) as Record<string, string>

const globalGlob = import.meta.glob(
  '~/assets/images/home/global/*.webp',
  { eager: true, query: '?url', import: 'default' },
)

function qualityAsset(name: string) {
  const entry = Object.entries(qualityGlob).find(([path]) => path.includes(name))
  return entry?.[1] || ''
}

const logoIso = computed(() => qualityAsset('logo-iso9001'))
const logoBsci = computed(() => qualityAsset('logo-bsci'))
const globalImage = computed(() => (Object.values(globalGlob) as string[])[0] || '')

const qualityDocs = computed(() => ([
  { src: qualityAsset('doc-iso-cert'), alt: 'ISO 9001 Certificate' },
  { src: qualityAsset('doc-bsci-report'), alt: 'BSCI Monitoring Report' },
  { src: qualityAsset('doc-sgs-report'), alt: 'SGS Test Report' },
]).filter(item => item.src))

const pillars = computed(() => {
  const raw = $t('home.quality.pillars')
  if (!Array.isArray(raw)) return []
  return raw.map((item: any) => {
    const logo = String(item.logo || '')
    return {
      value: String(item.value || ''),
      label: String(item.label || ''),
      logoSrc: logo === 'iso' ? logoIso.value : logo === 'bsci' ? logoBsci.value : '',
    }
  })
})

const certs = computed(() => {
  const raw = $t('home.quality.certs')
  return Array.isArray(raw) ? raw.map(String) : []
})

const qcSteps = computed(() => {
  const raw = $t('home.quality.steps')
  if (!Array.isArray(raw)) return []
  return raw.map((item: any, index: number) => ({
    no: String(item.no || String(index + 1).padStart(2, '0')),
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

const markets = computed(() => {
  const raw = $t('home.global.markets')
  if (!Array.isArray(raw)) return []
  return raw.map((item: any) => ({
    value: String(item.value || ''),
    label: String(item.label || ''),
  }))
})

const globalStrengths = computed(() => {
  const raw = $t('home.global.strengths')
  return Array.isArray(raw) ? raw.map(String) : []
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
  grid-template-columns: 1.15fr 0.85fr;
  gap: @spacing-xxl;
  align-items: stretch;

  @media (max-width: @breakpoint-tablet) {
    grid-template-columns: 1fr;
    padding: 0 @spacing-md;
  }
}

.quality-col,
.global-col {
  display: flex;
  flex-direction: column;
  min-height: 100%;
}

.quality-pillars {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: @spacing-md;
  margin-bottom: @spacing-lg;

  @media (max-width: @breakpoint-mobile) {
    grid-template-columns: 1fr;
  }
}

.quality-pillar {
  background: @card-background;
  border: 1px solid @border-color;
  border-radius: @radius-md;
  padding: @spacing-md;
  text-align: center;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;

  strong {
    display: block;
    color: @primary-color-dark;
    font-size: 0.95rem;
    margin-bottom: 0.3rem;
    line-height: 1.35;
  }

  span {
    display: block;
    color: @text-light-accessible;
    font-size: 0.8rem;
    line-height: 1.4;
  }
}

.pillar-logo {
  height: 56px;
  margin-bottom: @spacing-sm;
  display: flex;
  align-items: center;
  justify-content: center;

  :deep(img) {
    max-width: 100%;
    max-height: 56px;
    width: auto;
    height: auto;
    object-fit: contain;
  }
}

.compliance-block {
  margin-bottom: @spacing-lg;
}

.compliance-title,
.docs-title {
  margin: 0 0 @spacing-sm;
  font-size: 1rem;
  color: @text-color;
}

.cert-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
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
  grid-template-columns: repeat(3, 1fr);
  gap: @spacing-sm;
  margin-bottom: @spacing-lg;

  @media (max-width: @breakpoint-mobile) {
    grid-template-columns: 1fr;
  }
}

.cert-doc {
  display: block;
  border: 1px solid @border-color;
  border-radius: @radius-sm;
  overflow: hidden;
  background: @card-background;

  :deep(img) {
    width: 100%;
    height: 180px;
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
  display: grid;
  grid-template-columns: auto 1fr;
  gap: @spacing-md;
  align-items: start;
  background: @card-background;
  border: 1px solid @border-color;
  border-radius: @radius-sm;
  padding: @spacing-sm @spacing-md;
}

.qc-no {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 2.25rem;
  height: 2.25rem;
  border-radius: @radius-sm;
  background: fade(@primary-color, 14%);
  color: @primary-color-dark;
  font-weight: 700;
  font-size: 0.85rem;
}

.qc-body {
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
  height: 180px;
  object-fit: cover;
  border-radius: @radius-md;
  margin-bottom: @spacing-md;
  display: block;
  background: @card-background;
}

.block-title {
  margin: 0 0 @spacing-sm;
  font-size: 1rem;
  color: @text-color;
}

.market-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: @spacing-sm;
  margin-bottom: @spacing-md;
}

.market-card {
  background: @card-background;
  border: 1px solid @border-color;
  border-radius: @radius-sm;
  padding: @spacing-sm;
  text-align: center;

  strong {
    display: block;
    color: @primary-color-dark;
    font-size: 1.15rem;
  }

  span {
    display: block;
    margin-top: 0.2rem;
    color: @text-light-accessible;
    font-size: 0.78rem;
  }
}

.partner-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: @spacing-sm;
  margin-bottom: @spacing-md;
  align-content: start;
}

.partner-card {
  background: @card-background;
  border: 1px solid @border-color;
  border-radius: @radius-md;
  padding: @spacing-sm @spacing-md;
  height: 100%;
  display: flex;
  flex-direction: column;

  h3 {
    margin: 0 0 0.25rem;
    color: @primary-color-dark;
    font-size: 0.95rem;
  }

  p {
    margin: 0;
    color: @text-light-accessible;
    font-size: 0.82rem;
    flex: 1;
  }
}

.strength-list {
  list-style: none;
  margin: 0 0 @spacing-md;
  padding: 0;
  display: grid;
  gap: 0.45rem;
  flex: 1;

  li {
    position: relative;
    padding-left: 1rem;
    color: @text-light-accessible;
    font-size: 0.88rem;
    line-height: 1.5;

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0.55em;
      width: 0.4rem;
      height: 0.4rem;
      border-radius: 50%;
      background: @primary-color;
    }
  }
}

.global-cta {
  display: inline-block;
  margin-top: auto;
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
