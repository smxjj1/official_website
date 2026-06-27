<template>
  <div class="layout">
    <LayoutHeader />
    <main class="main">
      <slot />
    </main>
    <LayoutFooter />
    <InquiryListFab :contact-path="contactPath" />
  </div>
</template>

<script setup lang="ts">
const { getLocalePath } = useI18n()
const contactPath = computed(() => getLocalePath('/contact-us'))
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
  /* top bar ~32px + main nav 60px */
  padding-top: 92px;

  @media (max-width: 992px) {
    padding-top: 88px;
  }
}
</style>
