<script setup lang="ts">

</script>

<template>
  <div class="default-layout">
    <FrameHead class="h-12" />
    <main class="container mx-auto min-h-[calc(100vh-96px)] py-4 md:py-6 lg:py-8">
      <slot />
    </main>
    <FrameFoot class="h-12" />
  </div>
</template>

<style scoped>

</style>
