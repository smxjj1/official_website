import tailwindcss from '@tailwindcss/vite';

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/eslint', '@nuxt/image', '@pinia/nuxt'],
  css: ['~/assets/css/theme.css', '~/assets/css/tailwind.css', '~/assets/css/global.css', '~/assets/iconfont/iconfont.css'],
  runtimeConfig: {
    public: {
      siteUrl: 'https://yourdomain.com',
      siteName: 'Oya Plastic Factory',
      analyticsToken: process.env.NUXT_PUBLIC_ANALYTICS_TOKEN || '',
      analyticsBaseUrl: 'https://analytics.oyaplasticfactory.com',
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
  nitro: {
    compressPublicAssets: true,
    devProxy: {
      '/api/contact': {
        target: 'https://analytics.oyaplasticfactory.com/api/contact',
        changeOrigin: true,
      },
    },
  },
  vite: {
    plugins: [
      tailwindcss({
        optimize: {
          minify: true,
        },
      }),
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