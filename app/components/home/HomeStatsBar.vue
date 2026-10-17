<template>
  <section class="stats-bar">
    <div class="stats-inner">
      <div v-for="(item, index) in items" :key="index" class="stat-item">
        <span class="stat-value">{{ item.value }}</span>
        <span class="stat-label">{{ item.label }}</span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { $t } = useSiteLocale()

const items = computed(() => {
  const raw = $t('home.statsBar')
  if (!Array.isArray(raw)) return []
  return raw.map((item: any) => ({
    value: String(item.value || ''),
    label: String(item.label || ''),
  }))
})
</script>

<style lang="less" scoped>
@import '~/assets/css/variables.less';

.stats-bar {
  background: @section-background;
  border-top: 1px solid @border-color;
  border-bottom: 1px solid @border-color;
}

.stats-inner {
  max-width: @breakpoint-wide;
  margin: 0 auto;
  padding: @spacing-xl;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: @spacing-md;

  @media (max-width: @breakpoint-tablet) {
    grid-template-columns: repeat(2, 1fr);
    padding: @spacing-lg @spacing-md;
  }

  @media (max-width: @breakpoint-mobile) {
    grid-template-columns: 1fr 1fr;
  }
}

.stat-item {
  text-align: center;
  padding: @spacing-sm;
}

.stat-value {
  display: block;
  font-size: 1.75rem;
  font-weight: 700;
  color: @primary-color-dark;
  line-height: 1.2;
  margin-bottom: 0.35rem;

  @media (max-width: @breakpoint-tablet) {
    font-size: 1.4rem;
  }
}

.stat-label {
  display: block;
  font-size: 0.875rem;
  color: @text-light-accessible;
  line-height: 1.35;
}
</style>
