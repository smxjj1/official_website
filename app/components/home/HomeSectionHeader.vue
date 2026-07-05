<template>
  <div class="section-header">
    <span v-if="subtitle" class="section-tag">{{ subtitle }}</span>
    <h2 class="section-title">{{ title }}</h2>
    <p v-if="description" class="section-desc">{{ description }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  subtitle?: string
  title: string
  description?: string
}>()
</script>

<style lang="less" scoped>
@import '~/assets/css/variables.less';

.section-header {
  text-align: center;
  max-width: 800px;
  margin: 0 auto 60px;

  @media (max-width: @breakpoint-tablet) {
    margin-bottom: 40px;
  }
}

.section-tag {
  display: inline-block;
  font-size: 0.875rem;
  font-weight: 600;
  color: @primary-color-dark;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  margin-bottom: @spacing-md;
}

.section-title {
  font-size: 2.75rem;
  font-weight: 700;
  color: @text-color;
  margin: 0 0 @spacing-lg;
  line-height: 1.25;
  letter-spacing: -0.02em;

  @media (max-width: @breakpoint-tablet) {
    font-size: 2rem;
  }

  @media (max-width: @breakpoint-mobile) {
    font-size: 1.625rem;
  }
}

.section-desc {
  font-size: 1.125rem;
  color: @text-light-accessible;
  line-height: 1.75;
  margin: 0;

  @media (max-width: @breakpoint-tablet) {
    font-size: 1rem;
  }
}
</style>
