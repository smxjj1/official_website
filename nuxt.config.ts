import tailwindcss from '@tailwindcss/vite';
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/eslint', '@nuxt/image', '@pinia/nuxt'],
  css: ['~/assets/css/theme.css', '~/assets/css/tailwind.css', '~/assets/css/global.css', '~/assets/iconfont/iconfont.css'],
  // 关闭模块自带的规则使用antfu的规则
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
  },
  vite: {
    plugins: [
      tailwindcss({
        optimize: {
          minify: true,
        },
      }),
    ],
    build: {
      minify: 'esbuild', // 构建时是否进行代码压缩
      sourcemap: false, // 打包时是否生成 sourcemap 文件
      rollupOptions: {
        output: {
          chunkFileNames: `_nuxt/[name].[hash].js`,
          entryFileNames: '_nuxt/[name].[hash].js',
          assetFileNames: '_nuxt/[name].[hash].[ext]',
        },
        cache: true, // 缓存
      },
      cssCodeSplit: true, // 是否开启css代码分割
      chunkSizeWarningLimit: 100, // 构建时超过这个阈值的文件打包会标黄
      reportCompressedSize: true, // 构建时是否生成 gzip 压缩包
      assetsInlineLimit: 1024, // 所有图片都不用打包进js文件中，【当静态资源小于1kb时候，会被转换为base64打入js文件】
    },
    css: {
      modules: {
        generateScopedName: `[hash:base64:5]_[local]`, // css module
      },
    },
  },
});
