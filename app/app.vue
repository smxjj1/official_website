<script setup lang="ts">
// 这里实现动态的主题色和Title以及Favicon
useHead({
  title: 'Nuxt4 Template',
  meta: [{ name: 'description', content: 'This is my Nuxt4 application' }],
  link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  // 这里style属性的优先级高于css中的，这里定义的主题色优先级高于/assets/css/theme.css中的样式
  // style: [
  //   {
  //     innerHTML: `:root {\n
  //                     --color-brand: ${brandColor.value} !important;\n
  //                     @media (prefers-color-scheme: dark) {\n
  //                       --color-brand: #3B82F6;\n
  //                       }\n
  //                     }`,
  //   },
  // ],
});
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
