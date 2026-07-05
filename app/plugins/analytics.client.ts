/**
 * 全站 PV：路由完成后上报；启动与离开页面时尝试 flush 失败队列（fetch keepalive）。
 */
export default defineNuxtPlugin(() => {
  const router = useRouter();
  const { trackPageview, flushRetryQueue } = useAnalytics();

  const start = () => {
    void flushRetryQueue();

    router.afterEach((to) => {
      void trackPageview(to.fullPath);
    });
  };

  if ('requestIdleCallback' in window)
    requestIdleCallback(start, { timeout: 2000 });
  else
    setTimeout(start, 1500);

  if (import.meta.client) {
    window.addEventListener('pagehide', () => {
      void flushRetryQueue({ keepalive: true });
    });
  }
});
