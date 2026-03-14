export interface ProductCategory {
  slug: string
  name: string
  title: string
  description: string
  hero: HeroContent
  imageFolder: string
}

export interface HeroContent {
  headline: string
  subheadline: string
}

export interface ProductImage {
  filename: string
  path: string
  alt: string
}

export function defineProductCategory(category: ProductCategory): ProductCategory {
  return category
}