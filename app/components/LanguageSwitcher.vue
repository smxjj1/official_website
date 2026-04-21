<template>
  <div class="language-switcher">
    <button
      v-for="lang in languages"
      :key="lang.code"
      class="lang-btn"
      :class="{ active: locale === lang.code }"
      @click="setLocale(lang.code)"
    >
      {{ lang.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
const { locale, setLocale, $t } = useI18n()

const languages = [
  { code: 'en', label: 'EN' },
  { code: 'zh-CN', label: '简' },
  { code: 'zh-TW', label: '繁' },
]
</script>

<style lang="less" scoped>
@import '~/assets/css/variables.less';

.language-switcher {
  display: flex;
  gap: 4px;
  margin-left: @spacing-md;

  @media (max-width: @breakpoint-tablet) {
    order: -1;
    margin-left: 0;
    margin-bottom: @spacing-sm;
    justify-content: center;
  }
}

.lang-btn {
  padding: 4px 8px;
  font-size: 0.75rem;
  font-weight: 500;
  border: 1px solid @border-color;
  background: transparent;
  color: @text-light;
  cursor: pointer;
  transition: all @transition-fast;
  border-radius: 4px;

  &:hover {
    border-color: @primary-color;
    color: @primary-color;
  }

  &.active {
    background: @primary-color;
    border-color: @primary-color;
    color: white;
  }
}
</style>