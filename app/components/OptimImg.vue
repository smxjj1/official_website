<script setup lang="ts">
const props = withDefaults(defineProps<{
  src: string
  webpSrc?: string
  alt?: string
  loading?: 'lazy' | 'eager'
  fetchpriority?: 'high' | 'low' | 'auto'
  decoding?: 'async' | 'sync' | 'auto'
  width?: number | string
  height?: number | string
}>(), {
  alt: '',
  loading: 'lazy',
  fetchpriority: 'auto',
  decoding: 'async',
})

const resolvedWebp = computed(() => {
  if (props.webpSrc)
    return props.webpSrc
  if (props.src.startsWith('/images/'))
    return props.src.replace(/\.(png|jpe?g)$/i, '.webp')
  return ''
})

/** Prefer WebP-only delivery to avoid downloading large PNG/JPEG fallbacks. */
const displaySrc = computed(() => resolvedWebp.value || props.src)
</script>

<template>
  <img
    :src="displaySrc"
    :alt="alt"
    :loading="loading"
    :fetchpriority="fetchpriority"
    :decoding="decoding"
    :width="width"
    :height="height"
    class="optim-img"
  >
</template>

<style scoped>
.optim-img {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
