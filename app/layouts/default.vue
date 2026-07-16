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
const { getLocalePath } = useSiteLocale()
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
  /* 顶栏锁定 40px + 主导航 60px，避免 fixed header 遮挡轮播 */
  padding-top: 100px;

  @media (max-width: 992px) {
    padding-top: 100px;
  }
}
</style>
