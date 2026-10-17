<template>
  <section class="mf-section">
    <div class="mf-inner">
      <div class="materials-col">
        <HomeSectionHeader
          :subtitle="$t('home.materials.subtitleTag')"
          :title="$t('home.materials.title')"
          :description="$t('home.materials.subtitle')"
        />
        <div class="materials-grid">
          <article
            v-for="(item, index) in materials"
            :key="item.name"
            class="material-card"
          >
            <OptimImg
              v-if="materialImages[index]"
              :src="materialImages[index]"
              :webp-src="materialImages[index]"
              :alt="item.name"
              class="material-img"
              loading="lazy"
            />
            <div class="material-body">
              <h3>{{ item.name }}</h3>
              <p>{{ item.traits }}</p>
            </div>
          </article>
        </div>
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
  '~/assets/images/home/materials/*.webp',
  { eager: true, query: '?url', import: 'default' },
)
const factoryGlob = import.meta.glob(
  '~/assets/images/home/factory/*.webp',
  { eager: true, query: '?url', import: 'default' },
)

const materialImages = computed(() => Object.values(materialGlob) as string[])
const factoryImages = computed(() => (Object.values(factoryGlob) as string[]).slice(0, 6))

const materials = computed(() => {
  const raw = $t('home.materials.items')
  if (!Array.isArray(raw)) return []
  return raw.map((item: any) => ({
    name: String(item.name || ''),
    traits: String(item.traits || ''),
  }))
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

  @media (max-width: @breakpoint-tablet) {
    grid-template-columns: 1fr;
    padding: 0 @spacing-md;
    gap: @spacing-xl;
  }
}

.materials-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: @spacing-md;
  margin-bottom: @spacing-lg;
}

.material-card {
  border: 1px solid @border-color;
  border-radius: @radius-md;
  overflow: hidden;
  background: @background-color;
}

.material-img {
  width: 100%;
  height: 110px;
  object-fit: cover;
  display: block;
  background: @section-background;
}

.material-body {
  padding: @spacing-sm @spacing-md @spacing-md;
}

.material-body h3 {
  margin: 0 0 0.25rem;
  color: @primary-color-dark;
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

  &:hover {
    color: @primary-color;
  }
}
</style>
