export default defineStore('counter', {
  // 状态
  state: () => ({
    count: 0,
  }),

  // 计算属性
  getters: {
    doubleCount: state => state.count * 2,
    isPositive: state => state.count > 0,
    isNegative: state => state.count < 0,
    isZero: state => state.count === 0,
  },

  // 动作
  actions: {
    // 增加数值
    increment(amount: number = 1) {
      this.count += amount;
    },

    // 减少数值
    decrement(amount: number = 1) {
      this.count -= amount;
    },

    // 重置为零
    reset() {
      this.count = 0;
    },

    // 设置指定值
    setCount(value: number) {
      this.count = value;
    },

    // 异步增加（模拟 API 调用）
    async asyncIncrement(amount: number = 1) {
      await new Promise(resolve => setTimeout(resolve, 500)); // 模拟延迟
      this.increment(amount);
    },
  },
});
