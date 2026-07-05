<script setup lang="ts">
defineOptions({
  name: 'FrameHead',
});
</script>

<template>
  <header class="w-full">
    <div class="container mx-auto h-full flex-between">
      <a href="/">
        <OptimImg src="/images/default-logo.png" alt="logo" class="w-auto h-10" loading="eager" />
      </a>
      <nav>
        <a href="/">Home</a>
        <a href="/about">About</a>
      </nav>
    </div>
  </header>
</template>

<style scoped>

</style>
