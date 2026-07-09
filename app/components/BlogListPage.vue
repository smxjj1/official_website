<template>
  <div class="blog-list-page">
    <section class="hero-section">
      <div class="hero-container">
        <h1 class="hero-title">{{ $t('blogPage.pageTitle') }}</h1>
        <p class="hero-subtitle">{{ $t('blogPage.pageDesc') }}</p>
      </div>
    </section>

    <section class="blog-section">
      <div class="blog-container">
        <div v-if="isLoading" class="state-message">
          {{ $t('blogPage.loading') }}
        </div>

        <template v-else>
          <!-- Pillar Hub -->
          <section v-if="showPillarSection" class="pillar-section" aria-label="Pillar guides">
            <div class="section-header">
              <h2 class="section-title">{{ $t('blogPage.pillarSectionTitle') }}</h2>
              <p class="section-desc">{{ $t('blogPage.pillarSectionDesc') }}</p>
            </div>

            <div class="pillar-grid">
              <article
                v-for="article in filteredPillars"
                :key="article.slug"
                class="pillar-card"
              >
                <div v-if="article.coverImage" class="pillar-card-image">
                  <img :src="article.coverImage" :alt="article.title" loading="lazy">
                </div>
                <div class="pillar-card-body">
                  <span class="pillar-badge">{{ categoryLabel('pillar') }}</span>
                  <h3 class="pillar-card-title">
                    <NuxtLink :to="getLocalePath(`/blog/${article.slug}`)">
                      {{ article.title }}
                    </NuxtLink>
                  </h3>
                  <p class="pillar-card-summary">{{ article.summary }}</p>
                  <NuxtLink
                    :to="getLocalePath(`/blog/${article.slug}`)"
                    class="pillar-cta"
                  >
                    {{ $t('blogPage.readPillar') }}
                  </NuxtLink>
                </div>
              </article>
            </div>
          </section>

          <!-- Cluster Section -->
          <section class="cluster-section" aria-label="Topic guides">
            <div class="section-header">
              <h2 class="section-title">{{ $t('blogPage.clusterSectionTitle') }}</h2>
            </div>

            <div class="filter-bar">
              <nav class="category-tabs" aria-label="Blog categories">
                <button
                  v-for="category in clusterTabs"
                  :key="category"
                  type="button"
                  class="tab-btn"
                  :class="{ active: activeCategory === category }"
                  @click="activeCategory = category"
                >
                  {{ category === 'all' ? $t('blogPage.all') : categoryLabel(category) }}
                </button>
              </nav>
              <div class="search-wrap">
                <input
                  v-model="searchQuery"
                  type="search"
                  class="search-input"
                  :placeholder="String($t('blogPage.searchPlaceholder'))"
                  aria-label="Search blog"
                >
              </div>
            </div>

            <div v-if="filteredClusters.length === 0" class="state-message">
              {{ $t('blogPage.empty') }}
            </div>
            <div v-else class="articles-grid">
              <article
                v-for="article in filteredClusters"
                :key="article.slug"
                class="article-card"
              >
                <div v-if="article.coverImage" class="card-image">
                  <img :src="article.coverImage" :alt="article.title" loading="lazy">
                </div>
                <div class="card-body">
                  <span class="card-category">{{ categoryLabel(article.category) }}</span>
                  <h3 class="card-title">
                    <NuxtLink :to="getLocalePath(`/blog/${article.slug}`)">
                      {{ article.title }}
                    </NuxtLink>
                  </h3>
                  <time class="card-date" :datetime="article.publishDate">
                    {{ formatDate(article.publishDate) }}
                  </time>
                  <p class="card-summary">{{ article.summary }}</p>
                  <ul v-if="article.tags?.length" class="card-tags">
                    <li v-for="tag in article.tags.slice(0, 3)" :key="tag">{{ tag }}</li>
                  </ul>
                </div>
              </article>
            </div>
          </section>
        </template>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const { $t, getLocalePath, locale } = useSiteLocale()
const { fetchBlogList } = useBlog()

useHead({
  title: computed(() => `${$t('blogPage.metaTitle')} | ${$t('siteName')}`),
  htmlAttrs: { lang: locale },
  meta: [
    { name: 'description', content: computed(() => String($t('blogPage.metaDescription'))) },
  ],
})

const activeCategory = ref('all')
const searchQuery = ref('')

const { data: blogData, pending: isLoading } = await useAsyncData(
  () => `oya-blog-list-${locale.value}`,
  () => fetchBlogList(locale.value),
  {
    server: true,
    watch: [locale],
  },
)

const allArticles = computed(() => blogData.value || [])

const pillarArticles = computed(() =>
  allArticles.value.filter(a => a.category === 'pillar'),
)

const clusterArticles = computed(() =>
  allArticles.value.filter(a => a.category !== 'pillar'),
)

const clusterTabs = computed(() => {
  const order = ['buying-guide', 'how-to', 'problem-solving', 'b2b']
  const unique = [...new Set(clusterArticles.value.map(a => a.category).filter(Boolean))]
  const sorted = [
    ...order.filter(key => unique.includes(key)),
    ...unique.filter(key => !order.includes(key)),
  ]
  return ['all', ...sorted]
})

function matchesSearch(article: { title: string; summary: string; tags: string[] }, q: string) {
  return (
    article.title.toLowerCase().includes(q)
    || article.summary.toLowerCase().includes(q)
    || article.tags.some(tag => tag.toLowerCase().includes(q))
  )
}

const filteredPillars = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q)
    return pillarArticles.value
  return pillarArticles.value.filter(a => matchesSearch(a, q))
})

const showPillarSection = computed(() => filteredPillars.value.length > 0)

const filteredClusters = computed(() => {
  let list = [...clusterArticles.value]
  if (activeCategory.value !== 'all') {
    list = list.filter(a => a.category === activeCategory.value)
  }
  const q = searchQuery.value.trim().toLowerCase()
  if (q) {
    list = list.filter(a => matchesSearch(a, q))
  }
  return list
})

function categoryLabel(category: string) {
  const key = `blogPage.categories.${category}`
  const label = $t(key)
  return label === key ? category : String(label)
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  if (Number.isNaN(date.getTime()))
    return dateStr
  const localeMap: Record<string, string> = {
    en: 'en-US',
    'zh-CN': 'zh-CN',
    'zh-TW': 'zh-TW',
  }
  return date.toLocaleDateString(localeMap[locale.value] || 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
</script>

<style scoped lang="less">
.blog-list-page {
  background: #f8fafc;
}

.hero-section {
  background: linear-gradient(135deg, #0f766e 0%, #14b8a6 100%);
  color: #fff;
  padding: 64px 24px 48px;
}

.hero-container {
  max-width: 1100px;
  margin: 0 auto;
  text-align: center;
}

.hero-title {
  margin: 0 0 12px;
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 700;
}

.hero-subtitle {
  margin: 0;
  opacity: 0.92;
  font-size: 1.05rem;
}

.blog-section {
  padding: 40px 24px 80px;
}

.blog-container {
  max-width: 1100px;
  margin: 0 auto;
}

.section-header {
  margin-bottom: 24px;
}

.section-title {
  margin: 0 0 8px;
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
  line-height: 1.3;
}

.section-desc {
  margin: 0;
  font-size: 0.95rem;
  color: #64748b;
  line-height: 1.6;
}

.pillar-section {
  margin-bottom: 48px;
  padding-bottom: 40px;
  border-bottom: 1px solid #e2e8f0;
}

.pillar-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

.pillar-card {
  display: flex;
  flex-direction: column;
  background: #fff;
  border: 1px solid #99f6e4;
  border-radius: 14px;
  overflow: hidden;
  transition: box-shadow 0.2s, border-color 0.2s;

  &:hover {
    border-color: #0f766e;
    box-shadow: 0 10px 28px rgba(15, 118, 110, 0.14);
  }
}

.pillar-card-image {
  aspect-ratio: 16 / 9;
  background: #f1f5f9;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }
}

.pillar-card:hover .pillar-card-image img {
  transform: scale(1.03);
}

.pillar-card-body {
  padding: 24px 26px 28px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.pillar-badge {
  display: inline-block;
  align-self: flex-start;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #0f766e;
  background: rgba(15, 118, 110, 0.1);
  padding: 4px 10px;
  border-radius: 4px;
  margin-bottom: 12px;
}

.pillar-card-title {
  margin: 0 0 12px;
  font-size: 1.35rem;
  font-weight: 700;
  line-height: 1.3;

  a {
    color: #0f172a;
    text-decoration: none;

    &:hover {
      color: #0f766e;
    }
  }
}

.pillar-card-summary {
  margin: 0 0 20px;
  font-size: 0.95rem;
  color: #64748b;
  line-height: 1.65;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.pillar-cta {
  display: inline-flex;
  align-self: flex-start;
  font-size: 0.9rem;
  font-weight: 600;
  color: #0f766e;
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: border-color 0.2s;

  &:hover {
    border-bottom-color: #0f766e;
  }
}

.filter-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 28px;
  flex-wrap: wrap;
}

.category-tabs {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tab-btn {
  padding: 10px 18px;
  border: 1px solid #cbd5e1;
  border-radius: 999px;
  background: #fff;
  color: #475569;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &.active {
    background: #0f766e;
    border-color: #0f766e;
    color: #fff;
  }
}

.search-wrap {
  min-width: 220px;
  flex: 0 1 260px;
}

.search-input {
  width: 100%;
  padding: 10px 16px;
  border: 1px solid #cbd5e1;
  border-radius: 999px;
  font-size: 0.9rem;
  outline: none;

  &:focus {
    border-color: #0f766e;
  }
}

.state-message {
  text-align: center;
  padding: 48px 16px;
  color: #64748b;
}

.articles-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

.article-card {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  transition: box-shadow 0.2s, border-color 0.2s;

  &:hover {
    border-color: #99f6e4;
    box-shadow: 0 8px 24px rgba(15, 118, 110, 0.12);
  }
}

.card-image {
  aspect-ratio: 16 / 10;
  background: #f1f5f9;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.card-body {
  padding: 20px 22px 24px;
}

.card-category {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 700;
  color: #0f766e;
  letter-spacing: 0.02em;
  margin-bottom: 8px;
  text-transform: uppercase;
}

.card-title {
  margin: 0 0 8px;
  font-size: 1.15rem;
  line-height: 1.35;

  a {
    color: #0f172a;
    text-decoration: none;

    &:hover {
      color: #0f766e;
    }
  }
}

.card-date {
  display: block;
  font-size: 0.85rem;
  color: #94a3b8;
  margin-bottom: 10px;
}

.card-summary {
  margin: 0 0 14px;
  font-size: 0.92rem;
  color: #64748b;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  list-style: none;
  margin: 0;
  padding: 0;

  li {
    font-size: 0.75rem;
    color: #0f766e;
    background: rgba(15, 118, 110, 0.08);
    padding: 4px 10px;
    border-radius: 4px;
  }
}

@media (max-width: 768px) {
  .pillar-grid,
  .articles-grid {
    grid-template-columns: 1fr;
  }

  .filter-bar {
    flex-direction: column;
    align-items: stretch;
  }

  .search-wrap {
    flex: 1;
    min-width: 0;
  }

  .pillar-card-title {
    font-size: 1.2rem;
  }
}
</style>
