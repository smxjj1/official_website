# OyaBabies.com SEO 可执行方案

| 项 | 内容 |
|---|---|
| 站点 | https://oyababies.com |
| 品牌（代码现状） | Huangyan Oya Plastic Factory（指南建议改为 Oya Babies，见 D7） |
| 代码仓库 | `official_website` |
| 技术栈（实际） | Nuxt 4 + `@nuxtjs/seo` + `nuxt-llms`；产品/新闻/博客走 analytics CMS |
| 多语言 | en（默认）/ zh-CN / zh-TW |
| 依据文档 | 《OyaBabies_SEO实操指南》v1.1（2026-04-21） |
| 本方案版本 | **v1.0 · 2026-07-09** |
| 编制原则 | 只写可派工任务；与代码不符的原文已改写；SV/KD 未工具复核，不作承诺数字 |

---

## 0. 对原指南的合理性结论

### 0.1 应保留

| 原指南内容 | 为何保留 |
|---|---|
| B2B+B2C 双受众内容策略 | 与工厂直销+终端信任模式一致 |
| Pillar + 4 Cluster 内容架构 | 已落地为博客分类：`buying-guide` / `how-to` / `problem-solving` / `b2b` / `pillar` |
| 信息型长尾用博客承接 | 分类页无法覆盖 how-to / vs / best |
| 产品 SEO 友好命名公式 | 当前仍大量内部型号/工厂描述串 |
| GSC 提交 + sitemap + 分批索引 | 基础动作，永远有效 |
| Schema：Organization / FAQ / Article / Product | 方向正确；禁止编造 AggregateRating |
| 变体 SKU 合并（同色不独立 URL） | 避免薄内容，优于盲目 2000 URL |

### 0.2 应否决 / 改写

| 原指南假设 | 实际情况 | 正确做法 |
|---|---|---|
| Nuxt 3 + 本地 `blog-posts` API | Nuxt 4；博客走 CMS `useBlog` | 按 CMS 公开 API 实现 |
| 无 `/blog`，应用 blog **替代** news | `/blog` 与 `/news` **已并存** | D2：news=品牌动态，blog=SEO 长文 |
| 30 天上线 2000+ 产品 URL | 产品仍是分类页+弹窗，无 slug | 先做 Top SPU 详情页，再评估扩量 |
| `/petfeedingbottle` 需 301 | 代码库已无 pet 类目 | 从清单删除，勿做无效重定向 |
| Product Schema 含评分示例 | 无评价系统 | **禁止**写虚假 review |
| SV/KD 具体数字 | 未用 Ahrefs/GSC 复核 | 仅作选题方向 |
| 首页 Title 10 分钟改完 | 全站 `siteName` 仍是工厂名 | 需品牌决策 D7 后统一改 |

---

## 1. 现状基线（2026-07-09）

| 模块 | 状态 | 说明 |
|---|---|---|
| `/blog` 列表+详情 | ✅ 已上线 | CMS；空列表不回退本地 |
| 博客分类 | ✅ 五类 | 对齐指南 Cluster |
| `/news` | ✅ 保留 | 手风琴列表，无独立文章 URL |
| 产品分类页 | ✅ 有 | `/baby-feeding-bottles` 等 + `[categorySlug]` |
| 产品详情 URL | ❌ 无 | 弹窗 modal，不可索引 |
| Sitemap | ⚠️ | 含 `/blog`、分类、CMS blog slug；**无 lastmod**；无产品详情 |
| 品牌 Title | ⚠️ | 仍为工厂名 |
| Schema | ⚠️ | 部分 Organization + ProductGroup；博客无 Article |
| llms.txt | ✅ | 已接入；需补 `/blog` |
| 死链 | ⚠️ | 部分组件仍链 `/products/...`（错误路径） |

---

## 2. 决策项

| ID | 决策 | 选择 | 执行含义 |
|---|---|---|---|
| D1 | `/blog` 与 `/news` | **并存** | 勿删 news；sitemap 两套都管 |
| D2 | 博客分类 | **五类 Cluster** | `buying-guide` / `how-to` / `problem-solving` / `b2b` / `pillar` |
| D3 | 产品详情页 | **要做** | 分阶段：先 Top 50 SPU，禁止一步 2000 URL |
| D4 | 虚假评价/价格 | **禁止** | Schema 不写 AggregateRating；无售价则不写 offers.price |
| D5 | 主攻语言 | **英文优先** | zh 第二阶段 |
| D6 | Pet 类目 | **忽略** | 代码无此类，不写进 sitemap/301 |
| D7 | 品牌名 | **待拍板** | `Huangyan Oya Plastic Factory` vs `Oya Babies`；未定前 Title 只做增量优化 |

---

## 3. 技术任务（按顺序）

### T0 · 基线与死链（Day 1）

- [ ] GSC 域名属性验证；导出收录/Coverage 截图
- [ ] 确认 GA4 询盘事件（无则加 `generate_lead`）
- [ ] 抓取 live sitemap / robots，核对 URL 数
- [ ] 修复死链：`HomeCarousel`、`ProductCard` 等 `/products/*` → 真实分类路径（如 `/baby-feeding-bottles`）
- [ ] Screaming Frog 或等价工具扫 404 清单

**验收**：有基线包；首页/轮播无错误产品路径。

---

### T1 · 技术 SEO 快赢（2–3 天）

- [ ] Sitemap 补 `lastmod`（博客 `publishDate`、分类可用 CMS `generatedAt`）
- [ ] 首页 / 六大分类页 meta description 对齐核心词（不编造 SV）
- [ ] `HomeFAQ` 加 FAQPage JSON-LD
- [ ] `BlogDetailPage` 加 Article Schema（可选文内 FAQ）
- [ ] 验证页面级 hreflang（不仅 sitemap）
- [ ] `llms.txt` / `llms-full` 补充 `/blog` 与分类说明
- [ ] （D7 若已定）统一 `siteName` + 首页 Title

**验收**：源码可见 Schema；sitemap 条目有 lastmod；GSC 可重新提交。

---

### T2 · 索引与内链（并行，3–7 天）

- [ ] GSC 提交 sitemap
- [ ] 按优先级 Request Indexing：`/` → 核心分类 → `/blog` → `/about-us` → `/contact-us` → `/news`
- [ ] 分类页增加「Learn More」链到已发布博客（先链分类，勿链不存在的 `/products/[slug]`）
- [ ] 博客文末 B2B CTA → `/contact-us`（内容规范）

**验收**：GSC 无「无法获取 sitemap」；至少 3 篇博客有从分类页的内链。

---

### T3 · 内容集群 MVP（第 2–3 周，CMS 运营）

在后台选站点 **oyababies.com**，按分类发布（英文优先）：

| 优先级 | 建议选题 | category | 内链目标（现状） |
|---|---|---|---|
| P0 | How to Sterilize Baby Bottles | `how-to` | `/baby-feeding-bottles` |
| P0 | PPSU vs PP Baby Bottles | `buying-guide` | 奶瓶分类 |
| P0 | When to Change Bottle Nipple | `how-to` | `/other-accessory` |
| P1 | Anti-Colic vs Regular | `buying-guide` | 奶瓶分类 |
| P1 | How to Choose a Baby Bottle Manufacturer | `b2b` | `/about-us`、`/contact-us` |
| P2 | Complete Baby Feeding Guide | `pillar` | 回链已发集群文 |

- [ ] 封面一律「上传到服务器」（媒体 URL），勿用前台相对路径
- [ ] 每篇含：唯一 H1、Meta、内链 ≥2、文末批发 CTA
- [ ] 发布后确认公开 API：`/api/public/blog?site_key=oyababies.com&locale=en` 有数据
- [ ] 确认 sitemap 自动出现新 slug

**验收**：前台 `/blog` 可见 CMS 文章；隐藏后前台不显示。

---

### T4 · 产品详情 URL（第 3–5 周，开发）

**阶段 A**
- [ ] CMS 产品增加 `seoSlug` / `seoTitle` / `seoDescription`（或等价）
- [ ] 公开 API 支持按 slug 取产品
- [ ] 前台 `pages/products/[slug].vue`（三语镜像）
- [ ] 分类页主 CTA 改为链到详情（modal 可保留为预览）
- [ ] Sitemap 纳入产品 URL + lastmod

**阶段 B**
- [ ] Top 50 SPU 人工 SEO 命名质检
- [ ] Product Schema（无虚假 Review；无售价则不写 price）
- [ ] 颜色变体合并策略落地

**阶段 C（评估后）**
- [ ] 是否扩到更多 SPU —— 以 GSC「已编入索引 / 软 404 / 重复」数据决定，禁止按日历硬冲 2000 URL

**验收**：至少 20 个产品 URL 可抓取正文；sitemap 含产品；GSC 无大量软 404。

---

### T5 · 可选增强（第 4 周+）

- [ ] `/wholesale` B2B 落地页（若 Contact 不够用）
- [ ] 外链 / Guest Post / 社媒（与开发解耦）
- [ ] 材质筛选若要做 SEO，用可索引路径而非仅 `?material=`

---

## 4. 90 天 KPI（可衡量、不承诺流量）

| 指标 | 基线 | 90 天目标 | 来源 |
|---|---|---|---|
| Sitemap 有效 en URL | 静态+分类+博客列表 | +≥8 博文 +≥20 产品详情（若 T4 完成） | sitemap |
| GSC 已编入索引 | T0 实测 | 上升且软 404 下降 | GSC |
| 博客已发布（en） | 0（CMS） | ≥8（含 1 pillar） | CMS |
| 产品独立 URL | 0 | ≥20（阶段 A） | 线上 |
| Organic 询盘可追踪 | 未知 | GA4 可区分 | GA4 |

---

## 5. Checklist 总表（打印用）

### 技术

- [ ] T0 基线包完成
- [ ] 死链修复完成
- [ ] Sitemap lastmod
- [ ] FAQ / Article Schema
- [ ] hreflang 页面级验证
- [ ] llms 含 blog
- [ ] GSC 提交 sitemap + 核心 URL 索引请求
- [ ] （可选）品牌名 D7 统一

### 内容

- [ ] CMS 站点选对 `oyababies.com`
- [ ] 分类只用五类 Cluster key
- [ ] P0 三篇英文上线
- [ ] Pillar 在集群文 ≥4 篇后发布
- [ ] 每篇封面为媒体绝对 URL
- [ ] 每篇有分类页内链 + Contact CTA

### 产品（T4）

- [ ] seoSlug 数据模型
- [ ] 详情页路由
- [ ] Sitemap 含产品
- [ ] Top 20+ 可索引
- [ ] Schema 无假评价

### 禁止事项

- [ ] 不删除 `/news`
- [ ] 不提交不存在的 `/products/[slug]`（T4 前）
- [ ] 不写虚假 AggregateRating / 编造价格
- [ ] 不把 SV/KD 估算当 KPI
- [ ] 不一步上线 2000 变体 URL

---

## 6. 修订历史

| 版本 | 日期 | 说明 |
|---|---|---|
| v1.0 | 2026-07-09 | 基于原指南 v1.1 对照 Nuxt4+CMS 现状重写；锁定 D1–D7 |
