<template>
  <div class="news-page">
    <section class="hero-section">
      <div class="hero-container">
        <h1 class="hero-title">{{ $t('news.title') }}</h1>
        <p class="hero-subtitle">{{ $t('news.subtitle') }}</p>
      </div>
    </section>

    <section class="news-section">
      <div class="news-container">
        <div class="news-tabs">
          <button
            type="button"
            class="tab-btn"
            :class="{ active: activeTab === 'company' }"
            @click="switchTab('company')"
          >
            {{ $t('news.tabs.company') }}
          </button>
          <button
            type="button"
            class="tab-btn"
            :class="{ active: activeTab === 'industry' }"
            @click="switchTab('industry')"
          >
            {{ $t('news.tabs.industry') }}
          </button>
        </div>

        <div v-if="pending" class="state-message">
          {{ $t('news.loading') }}
        </div>
        <div v-else-if="!articles.length" class="state-message">
          {{ $t('news.empty') }}
        </div>
        <div v-else class="accordion">
          <article
            v-for="item in articles"
            :key="item.id"
            class="accordion-item"
            :class="{ expanded: expandedId === item.id }"
          >
            <button
              type="button"
              class="accordion-header"
              :aria-expanded="expandedId === item.id"
              @click="toggleArticle(item)"
            >
              <div class="header-main">
                <h2 class="article-title">{{ item.title }}</h2>
                <p v-if="item.summary && expandedId !== item.id" class="article-summary">
                  {{ item.summary }}
                </p>
              </div>
              <div class="header-meta">
                <time v-if="item.publishedAt" class="article-date">
                  {{ formatDate(item.publishedAt) }}
                </time>
                <span class="view-count">
                  {{ $t('news.views', { count: displayViewCount(item) }) }}
                </span>
                <span class="chevron" aria-hidden="true" />
              </div>
            </button>

            <div v-show="expandedId === item.id" class="accordion-body">
              <div class="article-content" v-html="item.contentHtml" />
              <ul v-if="item.attachments?.length" class="attachment-list">
                <li v-for="att in item.attachments" :key="att.id">
                  <a :href="att.url" target="_blank" rel="noopener noreferrer" download>
                    {{ $t('news.download') }}: {{ att.fileName }}
                  </a>
                </li>
              </ul>
            </div>
          </article>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { NewsArticle, NewsCategory } from '~/composables/useNews'

const { $t, getLocalePath } = useSiteLocale()
const { fetchNews, recordNewsView } = useNews()
const { trackNewsView } = useAnalytics()

useSeo({
  title: $t('news.metaTitle'),
  description: $t('news.metaDescription'),
  canonicalPath: getLocalePath('/news'),
})

const activeTab = ref<NewsCategory>('company')
const expandedId = ref<number | null>(null)
const viewCounts = ref<Record<number, number>>({})
const trackedIds = ref<Set<number>>(new Set())

const { data: articles, pending, refresh } = await useAsyncData(
  'news-list',
  () => fetchNews(activeTab.value),
  { watch: [activeTab] },
)

watch(articles, (list) => {
  if (!list?.length) {
    expandedId.value = null
    return
  }
  expandedId.value = list[0].id
  for (const item of list) {
    viewCounts.value[item.id] = item.viewCount
  }
  if (import.meta.client && list[0])
    onArticleExpanded(list[0])
}, { immediate: true })

function formatDate(value: string) {
  const d = new Date(value)
  if (Number.isNaN(d.getTime()))
    return ''
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
}

function displayViewCount(item: NewsArticle) {
  return viewCounts.value[item.id] ?? item.viewCount
}

async function onArticleExpanded(item: NewsArticle) {
  if (trackedIds.value.has(item.id))
    return
  trackedIds.value.add(item.id)

  await trackNewsView({
    newsId: item.id,
    category: item.category,
    title: item.title,
  })

  const updated = await recordNewsView(item.id)
  if (updated != null)
    viewCounts.value[item.id] = updated
}

function toggleArticle(item: NewsArticle) {
  if (expandedId.value === item.id) {
    expandedId.value = null
    return
  }
  expandedId.value = item.id
  onArticleExpanded(item)
}

function switchTab(tab: NewsCategory) {
  if (activeTab.value === tab)
    return
  activeTab.value = tab
  expandedId.value = null
  trackedIds.value = new Set()
  refresh()
}

definePageMeta({
  layout: 'default',
})
</script>

<style scoped lang="less">
.news-page {
  background: #f8fafc;
}

.hero-section {
  background: linear-gradient(135deg, #0f766e 0%, #14b8a6 100%);
  color: #fff;
  padding: 64px 24px 48px;
}

.hero-container {
  max-width: 960px;
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

.news-section {
  padding: 40px 24px 80px;
}

.news-container {
  max-width: 960px;
  margin: 0 auto;
}

.news-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
}

.tab-btn {
  flex: 1;
  max-width: 200px;
  padding: 12px 20px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  background: #fff;
  color: #475569;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &.active {
    background: #0f766e;
    border-color: #0f766e;
    color: #fff;
  }
}

.state-message {
  text-align: center;
  padding: 48px 16px;
  color: #64748b;
}

.accordion-item {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  margin-bottom: 12px;
  overflow: hidden;
  transition: box-shadow 0.2s;

  &.expanded {
    box-shadow: 0 4px 16px rgba(15, 118, 110, 0.12);
    border-color: #99f6e4;
  }
}

.accordion-header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  padding: 20px 24px;
  border: none;
  background: transparent;
  text-align: left;
  cursor: pointer;
}

.header-main {
  flex: 1;
  min-width: 0;
}

.article-title {
  margin: 0 0 6px;
  font-size: 1.1rem;
  color: #0f172a;
  line-height: 1.4;
}

.article-summary {
  margin: 0;
  font-size: 0.9rem;
  color: #64748b;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.header-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
  flex-shrink: 0;
  font-size: 0.8rem;
  color: #94a3b8;
}

.chevron {
  width: 10px;
  height: 10px;
  border-right: 2px solid #64748b;
  border-bottom: 2px solid #64748b;
  transform: rotate(45deg);
  margin-top: 8px;
  transition: transform 0.2s;
}

.expanded .chevron {
  transform: rotate(-135deg);
  margin-top: 12px;
}

.accordion-body {
  padding: 0 24px 24px;
  border-top: 1px solid #f1f5f9;
}

.article-content {
  padding-top: 20px;
  line-height: 1.75;
  color: #334155;

  :deep(p) {
    margin: 0 0 1em;
  }

  :deep(ul),
  :deep(ol) {
    margin: 0 0 1em;
    padding-left: 1.5em;
  }

  :deep(a) {
    color: #0f766e;
  }

  :deep(img) {
    max-width: 100%;
    height: auto;
    border-radius: 6px;
  }
}

.attachment-list {
  margin: 20px 0 0;
  padding: 16px;
  list-style: none;
  background: #f8fafc;
  border-radius: 8px;

  li + li {
    margin-top: 8px;
  }

  a {
    color: #0f766e;
    font-weight: 500;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
}

@media (max-width: 640px) {
  .accordion-header {
    flex-direction: column;
  }

  .header-meta {
    flex-direction: row;
    align-items: center;
    width: 100%;
    justify-content: space-between;
  }
}
</style>
