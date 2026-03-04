<script setup lang="ts">
defineOptions({
  name: 'Iconfont',
});

// 接收图标名称（必填）和自定义样式（可选）
const props = withDefaults(
  defineProps<{
    domId?: string;
    name: string; // 图标名称（如 "home" 对应 iconfont.css 中的 .icon-home）
    size?: 'custom' | string; // 图标大小（如 "20px"）
    color?: 'custom' | string; // 图标颜色（如 "#ff0000"）
  }>(),
  {
    size: '16px',
    color: 'currentColor', // 默认继承父元素颜色
  },
);

const domRef = ref<HTMLElement>();

// 动态生成样式
const style = computed(() => {
  if (props.color === 'custom' && props.size === 'custom') {
    return {};
  }
  else if (props.color === 'custom' && props.size !== 'custom') {
    return {
      fontSize: props.size,
    };
  }
  else if (props.color !== 'custom' && props.size === 'custom') {
    return {
      color: props.color,
    };
  }
  else {
    return {
      fontSize: props.size,
      color: props.color,
    };
  }
});

defineExpose({
  domRef,
});
</script>

<template>
  <i :id="domId" ref="domRef" class="iconfont" :class="[`icon-${name}`]" :style="style" />
</template>

<style scoped>
</style>
