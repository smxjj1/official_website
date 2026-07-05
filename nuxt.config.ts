import tailwindcss from '@tailwindcss/vite'
import { buildHybridRouteRules, fetchCategorySlugs, getFallbackCategorySlugs } from './shared/seo/rendering'

const siteUrl = process.env.NUXT_PUBLIC_SITE_URL || 'https://oyababies.com'
const siteName = 'Huangyan Oya Plastic Factory'
const siteDescription = 'Premium baby products for happy families — feeding bottles, water cups, tableware, bath essentials, and accessories.'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/eslint', '@nuxt/image', '@pinia/nuxt', '@nuxtjs/i18n', '@nuxtjs/seo'],

  i18n: {
    locales: [
      { code: 'en', language: 'en-US', name: 'English' },
      { code: 'zh-CN', language: 'zh-CN', name: '简体中文' },
      { code: 'zh-TW', language: 'zh-TW', name: '繁體中文' },
    ],
    defaultLocale: 'en',
    strategy: 'prefix_except_default',
    detectBrowserLanguage: false,
  },
  css: ['~/assets/css/theme.css', '~/assets/css/tailwind.css', '~/assets/css/global.css', '~/assets/iconfont/iconfont.css'],

  site: {
    url: siteUrl,
    name: siteName,
    description: siteDescription,
    defaultLocale: 'en',
  },

  runtimeConfig: {
    public: {
      siteUrl,
      siteName,
      analyticsToken: process.env.NUXT_PUBLIC_ANALYTICS_TOKEN || '',
      analyticsBaseUrl: process.env.NUXT_PUBLIC_ANALYTICS_BASE_URL || 'https://analytics.oyababies.com',
      analyticsSiteId: process.env.NUXT_PUBLIC_ANALYTICS_SITE_ID || 'oyababies.com',
      /** 为 true 时不发起任何上报（如本地调试） */
      analyticsDisabled: process.env.NUXT_PUBLIC_ANALYTICS_DISABLED === 'true',
      /** 为 true 时匿名用户 ID 仅存 sessionStorage，关闭标签后重置（偏隐私） */
      analyticsSessionOnlyUser: process.env.NUXT_PUBLIC_ANALYTICS_SESSION_ONLY_USER === 'true',
      /** 产品 CMS（analytics-platform /api/public） */
      cmsSiteKey: process.env.NUXT_PUBLIC_CMS_SITE_KEY || 'oyababies.com',
      cmsApi: process.env.NUXT_PUBLIC_CMS_API || 'https://analytics.oyababies.com/api/public',
      cmsMediaBase: process.env.NUXT_PUBLIC_CMS_MEDIA_BASE || 'https://analytics.oyababies.com/media',
    },
  },

  /** Hybrid Rendering：首页 SSG，产品页 ISR 5 分钟，新闻页 ISR 30 分钟 */
  routeRules: buildHybridRouteRules(getFallbackCategorySlugs()),

  nitro: {
    prerender: {
      routes: ['/', '/zh-CN', '/zh-TW'],
    },
  },

  sitemap: {
    /** 仅使用自定义数据源，避免与 @nuxtjs/i18n 自动源重复生成脏 URL */
    excludeAppSources: true,
    autoI18n: false,
    sources: ['/api/__sitemap__/urls'],
    defaults: {
      changefreq: 'weekly',
      priority: 0.7,
    },
    xslColumns: [
      { label: 'URL', width: '50%' },
      { label: 'Last Modified', select: 'sitemap:lastmod', width: '25%' },
      { label: 'Hreflangs', select: 'count(xhtml:link)', width: '25%' },
    ],
  },

  linkChecker: {
    skipInspections: ['no-uppercase-chars', 'trailing-slash'],
  },

  robots: {
    disallow: ['/example', '/example/**', '/api/**'],
  },

  /** 未使用动态 OG 图生成，关闭以减小构建体积 */
  ogImage: {
    enabled: false,
  },

  schemaOrg: {
    identity: {
      type: 'Organization',
      name: siteName,
      url: siteUrl,
      logo: `${siteUrl}/images/default-logo.png`,
      description: siteDescription,
    },
  },

  eslint: {
    config: {
      standalone: false,
    },
  },
  image: {
    quality: 80,
    format: ['webp'],
  },
  vite: {
    plugins: [
      tailwindcss({
        optimize: {
          minify: true,
        },
      }) as unknown as any,
    ],
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
        },
      },
    },
    build: {
      minify: 'esbuild',
      sourcemap: false,
      rollupOptions: {
        output: {
          chunkFileNames: `_nuxt/[name].[hash].js`,
          entryFileNames: `_nuxt/[name].[hash].js`,
          assetFileNames: `_nuxt/[name].[hash].[ext]`,
        },
        cache: true,
      },
      cssCodeSplit: true,
      chunkSizeWarningLimit: 100,
      reportCompressedSize: true,
      assetsInlineLimit: 1024,
    },
  },

  hooks: {
    async 'nitro:config'(nitroConfig) {
      const categorySlugs = await fetchCategorySlugs()
      nitroConfig.routeRules = {
        ...nitroConfig.routeRules,
        ...buildHybridRouteRules(categorySlugs),
      }
    },
  },
})
