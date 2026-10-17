<template>
  <section class="why-section">
    <div class="why-inner">
      <HomeSectionHeader
        :subtitle="$t('home.whyChooseSection.subtitleTag')"
        :title="$t('home.whyChooseSection.title')"
        :description="$t('home.whyChooseSection.subtitle')"
      />
      <div class="why-grid">
        <article v-for="(item, index) in items" :key="index" class="why-card">
          <span class="why-index">{{ String(index + 1).padStart(2, '0') }}</span>
          <h3>{{ item.title }}</h3>
          <p>{{ item.text }}</p>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { $t } = useSiteLocale()

const items = computed(() => {
  const raw = $t('home.whyChooseSection.items')
  if (!Array.isArray(raw)) return []
  return raw.map((item: any) => ({
    title: String(item.title || ''),
    text: String(item.text || ''),
  }))
})
</script>

<style lang="less" scoped>
@import '~/assets/css/variables.less';

.why-section {
  padding: 96px 0;
  background: @card-background;

  @media (max-width: @breakpoint-tablet) {
    padding: 72px 0;
  }
}

.why-inner {
  max-width: @breakpoint-wide;
  margin: 0 auto;
  padding: 0 @spacing-xl;

  @media (max-width: @breakpoint-tablet) {
    padding: 0 @spacing-md;
  }
}

.why-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: @spacing-md;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: @breakpoint-tablet) {
    grid-template-columns: 1fr;
  }
}

.why-card {
  background: @background-color;
  border: 1px solid @border-color;
  border-radius: @radius-md;
  padding: @spacing-lg @spacing-md;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.why-index {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: @primary-color;
  margin-bottom: @spacing-sm;
}

.why-card h3 {
  margin: 0 0 @spacing-sm;
  font-size: 1.05rem;
  color: @text-color;
  line-height: 1.35;
}

.why-card p {
  margin: 0;
  font-size: 0.9rem;
  color: @text-light-accessible;
  line-height: 1.6;
  flex: 1;
}
</style>
