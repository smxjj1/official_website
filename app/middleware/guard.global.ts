export default defineNuxtRouteMiddleware(async (to, from) => {
  // 处理守卫，例如验证用户
  console.log(`from: ${from.fullPath} to: ${to.fullPath}`);
});
