<script setup lang="ts">
// 全局默认设置 - 仅 favicon 和基础配置
// SEO 设置由各页面通过 useSeo composable 自行管理
useHead({
  link: [{ rel: 'icon', type: 'image/x-icon', href: '/toukie.jpg' }],
  htmlAttrs: {
    lang: 'en',
  },
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
