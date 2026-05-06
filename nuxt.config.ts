import tailwindcss from '@tailwindcss/vite';

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/eslint', '@nuxt/image', '@pinia/nuxt'],
  css: ['~/assets/css/theme.css', '~/assets/css/tailwind.css', '~/assets/css/global.css', '~/assets/iconfont/iconfont.css'],
  runtimeConfig: {
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://oyababies.com',
      siteName: 'Oya Plastic Factory',
      analyticsToken: process.env.NUXT_PUBLIC_ANALYTICS_TOKEN || '',
      analyticsBaseUrl: process.env.NUXT_PUBLIC_ANALYTICS_BASE_URL || 'https://analytics.oyababies.com',
      analyticsSiteId: process.env.NUXT_PUBLIC_ANALYTICS_SITE_ID || 'oyababies.com',
      /** 为 true 时不发起任何上报（如本地调试） */
      analyticsDisabled: process.env.NUXT_PUBLIC_ANALYTICS_DISABLED === 'true',
      /** 为 true 时匿名用户 ID 仅存 sessionStorage，关闭标签后重置（偏隐私） */
      analyticsSessionOnlyUser: process.env.NUXT_PUBLIC_ANALYTICS_SESSION_ONLY_USER === 'true',
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
          entryFileNames: '_nuxt/[name].[hash].js',
          assetFileNames: '_nuxt/[name].[hash].[ext]',
        },
        cache: true,
      },
      cssCodeSplit: true,
      chunkSizeWarningLimit: 100,
      reportCompressedSize: true,
      assetsInlineLimit: 1024,
    },
  },
});