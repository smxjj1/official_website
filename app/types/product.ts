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
  src: string
  alt: string
  filename: string
}

export function defineProductCategory(category: ProductCategory): ProductCategory {
  return category
}