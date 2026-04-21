import type { RouterConfig } from '@nuxt/schema'

export default <RouterConfig>{
  routes: (routes) => {
    // Clone routes for zh-CN and zh-TW prefixes
    const localizedRoutes = []

    for (const route of routes) {
      // Skip if already a localized route
      if (route.path.startsWith('/zh-CN') || route.path.startsWith('/zh-TW')) {
        continue
      }

      // Add zh-CN version
      if (route.path !== '/') {
        localizedRoutes.push({
          ...route,
          path: `/zh-CN${route.path}`,
          name: `zh-CN-${route.name || route.path}`,
        })

        // Add zh-TW version
        localizedRoutes.push({
          ...route,
          path: `/zh-TW${route.path}`,
          name: `zh-TW-${route.name || route.path}`,
        })
      } else {
        // Handle root path
        localizedRoutes.push({
          ...route,
          path: '/zh-CN',
          name: 'zh-CN-home',
        })

        localizedRoutes.push({
          ...route,
          path: '/zh-TW',
          name: 'zh-TW-home',
        })
      }
    }

    return [...routes, ...localizedRoutes]
  },
}