<template>
  <div class="blog-detail-page">
    <section class="hero-section">
      <div class="hero-container">
        <span v-if="article" class="hero-category">{{ categoryLabel(article.category) }}</span>
        <h1 class="hero-title">
          {{ article ? article.title : $t('blogDetail.articleNotFound') }}
        </h1>
      </div>
    </section>

    <div v-if="isLoading" class="state-message">
      {{ $t('blogDetail.loadingArticle') }}
    </div>

    <article v-else-if="article" class="article-wrapper">
      <div class="article-container">
        <nav class="breadcrumb" aria-label="Breadcrumb">
          <NuxtLink :to="getLocalePath('/')">{{ $t('blogDetail.home') }}</NuxtLink>
          <span>/</span>
          <NuxtLink :to="getLocalePath('/blog')">{{ $t('nav.blog') }}</NuxtLink>
          <span>/</span>
          <span class="current">{{ article.title }}</span>
        </nav>

        <div class="article-meta">
          <time :datetime="article.publishDate">{{ formatDate(article.publishDate) }}</time>
          <span>{{ readTime(article.content) }}</span>
        </div>

        <div v-if="article.summary" class="article-summary">
          <p>{{ article.summary }}</p>
        </div>

        <div class="article-content" v-html="article.content" />

        <section v-if="article.tags?.length" class="article-tags">
          <h2>{{ $t('blogDetail.tags') }}</h2>
          <ul>
            <li v-for="tag in article.tags" :key="tag">{{ tag }}</li>
          </ul>
        </section>

        <section class="cta-section">
          <h2>{{ $t('blogDetail.needHelp') }}</h2>
          <p>{{ $t('blogDetail.needHelpDesc') }}</p>
          <NuxtLink :to="getLocalePath('/contact-us')" class="cta-btn">
            {{ $t('blogDetail.contactUs') }}
          </NuxtLink>
        </section>

        <section v-if="relatedArticles.length" class="related-section">
          <h2>
            {{ article?.category === 'pillar' ? $t('blogDetail.clusterArticles') : $t('blogDetail.relatedArticles') }}
          </h2>
          <div class="related-grid">
            <NuxtLink
              v-for="related in relatedArticles"
              :key="related.slug"
              :to="getLocalePath(`/blog/${related.slug}`)"
              class="related-card"
            >
              <span class="related-category">{{ categoryLabel(related.category) }}</span>
              <h3>{{ related.title }}</h3>
              <time :datetime="related.publishDate">{{ formatDate(related.publishDate) }}</time>
            </NuxtLink>
          </div>
        </section>
      </div>
    </article>

    <div v-else class="state-message">
      <p>{{ $t('blogDetail.articleNotFound') }}</p>
      <NuxtLink :to="getLocalePath('/blog')" class="back-link">
        {{ $t('blogDetail.backToBlog') }}
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { $t, getLocalePath, locale } = useSiteLocale()
const { fetchBlogDetail } = useBlog()

const slug = computed(() => String(route.params.slug || ''))

const { data: articleData, pending: isLoading } = await useAsyncData(
  () => `oya-blog-detail-${slug.value}-${locale.value}`,
  () => fetchBlogDetail(slug.value, locale.value, 8),
  {
    server: true,
    watch: [slug, locale],
  },
)

const article = computed(() => articleData.value?.article || null)
const relatedArticles = computed(() => articleData.value?.relatedArticles || [])

useHead({
  title: computed(() =>
    article.value
      ? `${article.value.title} | ${$t('nav.blog')}`
      : String($t('blogDetail.articleNotFound')),
  ),
  htmlAttrs: { lang: locale },
  meta: [
    { name: 'description', content: computed(() => article.value?.summary || '') },
  ],
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

function readTime(content: string) {
  const words = content.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(Boolean).length
  const minutes = Math.max(1, Math.ceil(words / 200))
  return `${minutes} ${$t('blogDetail.readTime')}`
}
</script>

<style scoped lang="less">
.blog-detail-page {
  background: #f8fafc;
  min-height: 60vh;
}

.hero-section {
  background: linear-gradient(135deg, #0f766e 0%, #14b8a6 100%);
  color: #fff;
  padding: 56px 24px 40px;
}

.hero-container {
  max-width: 860px;
  margin: 0 auto;
}

.hero-category {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  opacity: 0.9;
  margin-bottom: 10px;
}

.hero-title {
  margin: 0;
  font-size: clamp(1.5rem, 3.5vw, 2.25rem);
  font-weight: 700;
  line-height: 1.25;
}

.state-message {
  text-align: center;
  padding: 64px 24px;
  color: #64748b;
}

.back-link {
  display: inline-block;
  margin-top: 12px;
  color: #0f766e;
  font-weight: 600;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
}

.article-wrapper {
  padding: 0 24px 80px;
}

.article-container {
  max-width: 860px;
  margin: 0 auto;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 28px 32px 40px;
  margin-top: -24px;
  position: relative;
}

.breadcrumb {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  font-size: 0.875rem;
  color: #94a3b8;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f1f5f9;

  a {
    color: #0f766e;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  .current {
    color: #334155;
  }
}

.article-meta {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  font-size: 0.875rem;
  color: #94a3b8;
  margin-bottom: 20px;
}

.article-summary {
  padding: 16px 18px;
  background: rgba(15, 118, 110, 0.06);
  border-left: 4px solid #0f766e;
  border-radius: 0 8px 8px 0;
  margin-bottom: 28px;

  p {
    margin: 0;
    color: #334155;
    line-height: 1.6;
  }
}

.article-content {
  font-size: 1rem;
  line-height: 1.8;
  color: #334155;

  :deep(h2),
  :deep(h3) {
    color: #0f172a;
    margin: 1.6em 0 0.7em;
  }

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
    border-radius: 8px;
  }
}

.article-tags {
  margin-top: 36px;
  padding-top: 24px;
  border-top: 1px solid #f1f5f9;

  h2 {
    margin: 0 0 12px;
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #64748b;
  }

  ul {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  li {
    font-size: 0.8125rem;
    color: #0f766e;
    background: rgba(15, 118, 110, 0.08);
    padding: 6px 12px;
    border-radius: 4px;
  }
}

.cta-section {
  margin-top: 36px;
  padding: 28px;
  background: rgba(15, 118, 110, 0.06);
  border-radius: 12px;

  h2 {
    margin: 0 0 8px;
    font-size: 1.2rem;
    color: #0f172a;
  }

  p {
    margin: 0 0 16px;
    color: #64748b;
  }
}

.cta-btn {
  display: inline-flex;
  padding: 12px 22px;
  background: #0f766e;
  color: #fff;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;

  &:hover {
    background: #0d9488;
  }
}

.related-section {
  margin-top: 48px;

  h2 {
    margin: 0 0 20px;
    font-size: 1.25rem;
    color: #0f172a;
  }
}

.related-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.related-card {
  display: block;
  padding: 18px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  text-decoration: none;
  transition: border-color 0.2s, box-shadow 0.2s;

  &:hover {
    border-color: #99f6e4;
    box-shadow: 0 4px 12px rgba(15, 118, 110, 0.1);
  }

  .related-category {
    display: block;
    font-size: 0.7rem;
    font-weight: 700;
    color: #0f766e;
    text-transform: uppercase;
    margin-bottom: 6px;
  }

  h3 {
    margin: 0 0 10px;
    font-size: 0.95rem;
    color: #0f172a;
    line-height: 1.4;
  }

  time {
    font-size: 0.8rem;
    color: #94a3b8;
  }
}

@media (max-width: 768px) {
  .article-container {
    padding: 22px 18px 32px;
  }

  .related-grid {
    grid-template-columns: 1fr;
  }
}
</style>
