<template>
  <div class="layout">
    <LayoutHeader />
    <main class="main" :class="{ 'has-top-bar': hasTopBar }">
      <slot />
    </main>
    <LayoutFooter />
    <InquiryListFab :contact-path="contactPath" />
  </div>
</template>

<script setup lang="ts">
const { getLocalePath } = useSiteLocale()
const { contactLinks, socialLinks } = useContactLinks()
const contactPath = computed(() => getLocalePath('/contact-us'))
const hasTopBar = computed(() => contactLinks.value.length > 0 || socialLinks.value.length > 0)
</script>

<style lang="less" scoped>
@import '~/assets/css/variables.less';

.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main {
  flex: 1;
  /* 主导航 60px + border；有顶部联系栏时再加 40px */
  padding-top: 61px;

  &.has-top-bar {
    padding-top: 101px;
  }
}
</style>
