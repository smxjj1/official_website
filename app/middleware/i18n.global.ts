export default defineNuxtRouteMiddleware((to) => {
  const locale = useState<string>('locale')

  // Detect locale from URL path
  if (to.path.startsWith('/zh-CN')) {
    locale.value = 'zh-CN'
  } else if (to.path.startsWith('/zh-TW')) {
    locale.value = 'zh-TW'
  } else {
    locale.value = 'en'
  }

  // Strip locale prefix for internal routing
  if (to.path.startsWith('/zh-CN/') || to.path === '/zh-CN') {
    const pathWithoutLocale = to.path.replace(/^\/zh-CN/, '') || '/'
    // Use navigateTo for proper internal routing
    // But we want to keep the locale prefix visible in URL for SEO
    // So we don't redirect, just set the locale
  }

  if (to.path.startsWith('/zh-TW/') || to.path === '/zh-TW') {
    const pathWithoutLocale = to.path.replace(/^\/zh-TW/, '') || '/'
  }
})
