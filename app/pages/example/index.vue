<script setup lang="ts">
useExampleGlobal();
const counterStore = useCounterStore();
// 使用计算属性展示状态
const statusText = computed(() => {
  if (counterStore.isPositive)
    return '正数';
  if (counterStore.isNegative)
    return '负数';
  return '零';
});

function asyncIncrement() {
  counterStore.asyncIncrement();
}
</script>

<template>
  <div>
    <div>
      <NuxtLink to="/" class="text-primary">
        <NuxtImg format="webp" src="/images/default-logo.png" height="128" alt="logo" class="w-auto" /> go back
      </NuxtLink>
    </div>
    <div>
      <h2>计数器: {{ counterStore.count }}</h2>
      <p>双倍数值: {{ counterStore.doubleCount }}</p>
      <p>状态: {{ statusText }}</p>

      <div>
        <button @click="counterStore.increment()">
          +1
        </button>
        <button @click="counterStore.increment(5)">
          +5
        </button>
        <button @click="counterStore.decrement()">
          -1
        </button>
        <button @click="counterStore.decrement(5)">
          -5
        </button>
        <button @click="counterStore.reset()">
          重置
        </button>
        <button @click="asyncIncrement">
          异步+1 (500ms)
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
