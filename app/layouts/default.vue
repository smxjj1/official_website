<template>
  <div class="layout">
    <LayoutHeader />
    <main class="main">
      <slot />
    </main>
    <LayoutFooter />
  </div>
</template>

<script setup lang="ts">
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
  padding-top: 60px;
}
</style>