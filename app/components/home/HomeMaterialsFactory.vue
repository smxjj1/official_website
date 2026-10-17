<template>
  <section class="mf-section">
    <div class="mf-inner">
      <div class="materials-col">
        <HomeSectionHeader
          :subtitle="$t('home.materials.subtitleTag')"
          :title="$t('home.materials.title')"
          :description="$t('home.materials.subtitle')"
        />
        <div class="chip-row">
          <span v-for="(tag, index) in materialHighlights" :key="index" class="chip">{{ tag }}</span>
        </div>
        <div class="materials-grid">
          <article
            v-for="item in materials"
            :key="item.name"
            class="material-card"
          >
            <div v-if="item.image" class="material-media">
              <OptimImg
                :src="item.image"
                :webp-src="item.image"
                :alt="item.name"
                loading="lazy"
              />
            </div>
            <div class="material-body">
              <h3>{{ item.name }}</h3>
              <p>{{ item.traits }}</p>
            </div>
          </article>
        </div>
        <p class="col-note">{{ $t('home.materials.note') }}</p>
        <NuxtLink :to="getLocalePath('/contact-us')" class="mf-link">
          {{ $t('home.materials.ctaButton') }}
        </NuxtLink>
      </div>

      <div class="factory-col">
        <HomeSectionHeader
          :subtitle="$t('home.factory.subtitleTag')"
          :title="$t('home.factory.title')"
          :description="$t('home.factory.subtitle')"
        />
        <div class="chip-row">
          <span v-for="(shop, index) in factoryWorkshops" :key="index" class="chip">{{ shop }}</span>
        </div>
        <div class="factory-grid">
          <OptimImg
            v-for="(img, index) in factoryImages"
            :key="index"
            :src="img"
            :webp-src="img"
            alt="Oya factory"
            class="factory-img"
            loading="lazy"
          />
        </div>
        <div class="factory-stats">
          <div v-for="(stat, index) in factoryStats" :key="index" class="f-stat">
            <strong>{{ stat.value }}</strong>
            <span>{{ stat.label }}</span>
          </div>
        </div>
        <NuxtLink :to="getLocalePath('/about-us')" class="mf-link">
          {{ $t('home.factory.ctaButton') }}
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { $t, getLocalePath } = useSiteLocale()

const materialGlob = import.meta.glob(
  '~/assets/images/home/materials/material-*.webp',
  { eager: true, query: '?url', import: 'default' },
)
const factoryGlob = import.meta.glob(
  '~/assets/images/home/factory/*.webp',
  { eager: true, query: '?url', import: 'default' },
)

const materialImageMap = computed(() => {
  const map: Record<string, string> = {}
  for (const [path, url] of Object.entries(materialGlob)) {
    const file = path.split('/').pop()?.toLowerCase() || ''
    const key = file.replace(/^material-/, '').replace(/\.webp$/, '')
    if (key) map[key] = url as string
  }
  return map
})

const factoryImages = computed(() => (Object.values(factoryGlob) as string[]).slice(0, 6))

function materialImageKey(name: string) {
  return name.trim().toLowerCase().replace(/\s+/g, '')
}

const materials = computed(() => {
  const raw = $t('home.materials.items')
  if (!Array.isArray(raw)) return []
  return raw.map((item: any) => {
    const name = String(item.name || '')
    return {
      name,
      traits: String(item.traits || ''),
      image: materialImageMap.value[materialImageKey(name)] || '',
    }
  })
})

const materialHighlights = computed(() => {
  const raw = $t('home.materials.highlights')
  return Array.isArray(raw) ? raw.map(String) : []
})

const factoryWorkshops = computed(() => {
  const raw = $t('home.factory.workshops')
  return Array.isArray(raw) ? raw.map(String) : []
})

const factoryStats = computed(() => {
  const raw = $t('home.factory.stats')
  if (!Array.isArray(raw)) return []
  return raw.map((item: any) => ({
    value: String(item.value || ''),
    label: String(item.label || ''),
  }))
})
</script>

<style lang="less" scoped>
@import '~/assets/css/variables.less';

.mf-section {
  padding: 96px 0;
  background: @card-background;

  @media (max-width: @breakpoint-tablet) {
    padding: 72px 0;
  }
}

.mf-inner {
  max-width: @breakpoint-wide;
  margin: 0 auto;
  padding: 0 @spacing-xl;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: @spacing-xxl;
  align-items: stretch;

  @media (max-width: @breakpoint-tablet) {
    grid-template-columns: 1fr;
    padding: 0 @spacing-md;
    gap: @spacing-xl;
  }
}

.materials-col,
.factory-col {
  display: flex;
  flex-direction: column;
  min-height: 100%;
}

.chip-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
  margin-bottom: @spacing-md;
}

.chip {
  display: inline-block;
  padding: 0.3rem 0.7rem;
  border-radius: 999px;
  border: 1px solid @border-color;
  background: @section-background;
  color: @primary-color-dark;
  font-size: 0.78rem;
  font-weight: 600;
}

.col-note {
  margin: 0 0 @spacing-md;
  font-size: 0.9rem;
  line-height: 1.6;
  color: @text-light-accessible;
}

.materials-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: @spacing-md;
  margin-bottom: @spacing-lg;
  flex: 1;
  align-content: start;
}

.material-card {
  border: 1px solid @border-color;
  border-radius: @radius-md;
  overflow: hidden;
  background: @card-background;
  display: flex;
  flex-direction: column;
  transition: border-color @transition-fast, box-shadow @transition-fast;

  &:hover {
    border-color: fade(@primary-color, 45%);
    box-shadow: 0 8px 24px rgba(42, 34, 28, 0.06);
  }
}

.material-media {
  width: 100%;
  aspect-ratio: 4 / 3;
  background: @section-background;
  overflow: hidden;

  :deep(img) {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    display: block;
  }
}

.material-body {
  padding: @spacing-md;
  flex: 1;
}

.material-body h3 {
  margin: 0 0 0.35rem;
  color: @primary-color-dark;
  font-size: 1.05rem;
}

.material-body p {
  margin: 0;
  font-size: 0.85rem;
  color: @text-light-accessible;
  line-height: 1.45;
}

.factory-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: @spacing-sm;
  margin-bottom: @spacing-md;
  flex: 1;
  align-content: start;

  @media (max-width: @breakpoint-mobile) {
    grid-template-columns: 1fr 1fr;
  }
}

.factory-img {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  border-radius: @radius-sm;
  display: block;
  background: @section-background;
}

.factory-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: @spacing-sm;
  margin-bottom: @spacing-lg;

  @media (max-width: @breakpoint-mobile) {
    grid-template-columns: 1fr 1fr;
  }
}

.f-stat {
  background: @section-background;
  border-radius: @radius-sm;
  padding: @spacing-sm;
  text-align: center;

  strong {
    display: block;
    color: @primary-color-dark;
    font-size: 1.1rem;
  }

  span {
    display: block;
    font-size: 0.75rem;
    color: @text-light-accessible;
    margin-top: 0.2rem;
  }
}

.mf-link {
  display: inline-block;
  font-weight: 600;
  color: @primary-color-dark;
  text-decoration: none;
  margin-top: auto;
  padding-top: @spacing-md;

  &:hover {
    color: @primary-color;
  }
}
</style>
