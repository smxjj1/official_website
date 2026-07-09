export interface BlogArticle {
  slug: string
  title: string
  publishDate: string
  category: string
  tags: string[]
  summary: string
  content: string
  coverImage?: string
  author?: string
  viewCount?: number
}

export interface BlogDataModule {
  en: BlogArticle[]
  'zh-CN': BlogArticle[]
  'zh-TW': BlogArticle[]
}
