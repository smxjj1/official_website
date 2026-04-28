# Nuxt4 模板

## 项目简介
- 这是一个 Nuxt 4 最小可用骨架，拉取后即可用于 SSR/SSG 开发，也可以扩展为 BFF。
- 默认启用 Pinia、Nuxt Image、Tailwind CSS 4、Nitro API、Iconfont，全链路 TypeScript。
- 目录中演示了示例页面、组合式函数、服务端 API 以及 shared 目录的跨端工具，方便复用。

## 技术栈
- `Nuxt 4.2 + Vue 3.5`：提供服务端渲染、路由、文件系统约定。
- `Pinia 3`：集中管理应用状态，示例 store 位于 `app/stores/useCounterStore.ts`。
- `@nuxt/image 2`：服务端图片优化，`public/images/default-logo.png` 用于演示。
- `Tailwind CSS 4 + typography`：在 `app/assets/css` 中集中配置，Vite 插件负责产物优化。
- `ESLint 9 + @antfu 配置`：通过 `pnpm lint` 保证代码风格；`.nuxt` 目录也内置类型声明。
- `Nitro server`：`server/api`、`server/routes`、`server/plugins`、`server/utils` 演示自定义 API、中间件与通用响应封装。

## 目录速览
```
.
├─app
│  ├─assets/        全局样式 (theme/global/tailwind) 与 iconfont 资源
│  ├─components/    框架级组件 (frame/head、frame/foot、iconfont/index)
│  ├─composables/   自定义组合式函数 (useExample.global)
│  ├─layouts、middleware
│  ├─pages/         首页、example 示例页、[...slug].vue 动态路由
│  ├─stores/        Pinia 示例 useCounterStore
│  ├─types、utils
├─public/           静态资源 (favicon、images/default-logo.png)
├─server/
│  ├─api/test.get.ts        H3 API 示例
│  ├─routes/ping.get.ts     Nitro 直出路由
│  ├─plugins/0.nitroInit.ts 启动时自定义钩子
│  └─utils/                 localFile、response 工具
├─shared/          Node/客户端共享的 types 与 utils
├─nuxt.config.ts   模块、Tailwind、Nitro 与 Vite 统一配置
├─eslint.config.mjs / tsconfig.json
└─package.json
```
> 未列出 `.nuxt` 与 `node_modules` 等构建目录。

## 示例与约定
- `app/pages/example/index.vue` + `useCounterStore` 结合展示了同步/异步计数逻辑与 `useExample.global` 的全局日志。
- `app/assets/css/global.css`、`tailwind.css`、`theme.css` 预留了主题变量与基础样式，可直接扩展。
- `app/assets/iconfont` 内含已下载的字体文件及组件封装，可统一管理业务 icon。
- `shared/types`、`shared/utils` 用于抽离通用类型/方法，便于未来多项目共用。
- `server/routes/ping.get.ts`、`server/api/test.get.ts` 分别覆盖 Nitro 直出和 H3 handler 两种写法，可按需复制扩展。

## 快速开始
1. **安装依赖**（推荐 `pnpm`，亦可 `npm`/`yarn`/`bun`）  
   ```bash
   pnpm install
   ```
2. **启动开发服务器**（默认 `http://localhost:3000`）  
   ```bash
   pnpm dev
   ```
3. **构建与预览**  
   ```bash
   pnpm build
   pnpm preview
   ```
4. **代码质量**  
   ```bash
   pnpm lint        # 仅检查
   pnpm lint:fix    # 自动修复
   ```

## 未来分支规划
- `feature/google-ads`：专注 Google Ads 业务场景，计划在当前模板基础上扩展广告账户、投放配置等模块，形成营销团队专用脚手架。
- `feature/website-prisma`：面向官网项目，预置 Prisma、数据库连接、i18n 方案及与 CMS/后台的数据流，便于一键生成多语言官网。
> 两个分支将在当前主干稳定后陆续创建，README 会同步补充各自的初始化步骤与特性清单。

## 开发建议
- 默认启用 Nuxt DevTools，可在 `nuxt.config.ts` 中切换。
- 若需要在 `shared/` 复用服务器逻辑，请确保仅导出与运行时兼容的代码。
- 构建产物默认压缩并启用 `Nuxt Image` 的 WebP 输出，若部署目标不支持可在 `nuxt.config.ts` → `image.format` 中调整。

## 生产环境变量（analytics）
- 仅保留以下 3 个键（最终版）：
  - `NUXT_PUBLIC_ANALYTICS_BASE_URL`（示例：`https://analytics.oyaplasticfactory.com`）
  - `NUXT_PUBLIC_ANALYTICS_SITE_ID`（示例：`oyaplasticfactory.com`）
  - `NUXT_PUBLIC_ANALYTICS_TOKEN`（可空，按后端鉴权策略配置）
- 请以 `.env.production.example` 为唯一模板，避免使用历史字段名（如 `...ENDPOINT`、`...CONTACT_ENDPOINT`）。
