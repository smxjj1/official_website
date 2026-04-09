import type { ProductCategory } from '~/types/product'

interface SeoOptions {
  title: string
  description: string
  canonicalPath?: string
  ogImage?: string
  noIndex?: boolean
}

export function useSeo(options: SeoOptions) {
  const route = useRoute()
  const config = useRuntimeConfig()

  const siteName = config.public.siteName || 'Oya Plastic Factory'
  const siteUrl = config.public.siteUrl || 'https://yourdomain.com'

  const canonicalUrl = options.canonicalPath
    ? `${siteUrl}${options.canonicalPath}`
    : `${siteUrl}${route.path}`

  const fullTitle = `${options.title} | ${siteName}`

  useHead({
    title: fullTitle,
    meta: [
      { name: 'description', content: options.description },
      { name: 'robots', content: options.noIndex ? 'noindex, nofollow' : 'index, follow' },
      { property: 'og:title', content: fullTitle },
      { property: 'og:description', content: options.description },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: canonicalUrl },
      { property: 'og:site_name', content: siteName },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: fullTitle },
      { name: 'twitter:description', content: options.description },
    ],
    link: [
      { rel: 'canonical', href: canonicalUrl },
    ],
  })
}

export function useProductCategorySeo(category: ProductCategory) {
  const route = useRoute()
  const config = useRuntimeConfig()

  const siteName = config.public.siteName || 'Oya Plastic Factory'
  const siteUrl = config.public.siteUrl || 'https://yourdomain.com'

  const canonicalUrl = `${siteUrl}${route.path}`
  const fullTitle = `${category.title} | ${siteName}`

  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'ProductGroup',
    name: category.name,
    description: category.description,
    url: canonicalUrl,
    category: 'Baby Products',
  }

  useHead({
    title: fullTitle,
    meta: [
      { name: 'description', content: category.description },
      { name: 'robots', content: 'index, follow' },
      { property: 'og:title', content: fullTitle },
      { property: 'og:description', content: category.description },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: canonicalUrl },
      { property: 'og:site_name', content: siteName },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: fullTitle },
      { name: 'twitter:description', content: category.description },
    ],
    link: [
      { rel: 'canonical', href: canonicalUrl },
    ],
    script: [
      {
        type: 'application/ld+json',
        children: JSON.stringify(schemaData),
      },
    ],
  })
}

export function useHomeSeo() {
  const config = useRuntimeConfig()
  const siteName = config.public.siteName || 'Oya Plastic Factory'
  const siteUrl = config.public.siteUrl || 'https://yourdomain.com'

  useSeo({
    title: 'Premium Baby Products | Feeding, Bath & More',
    description: 'Discover Oya Plastic Factory\'s collection of safe, high-quality baby products. Feeding bottles, water cups, tableware, bath essentials, and accessories for your little one.',
    canonicalPath: '/',
  })

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteName,
    url: siteUrl,
    logo: `${siteUrl}/images/default-logo.png`,
    description: 'Premium baby products for happy families',
  }

  useHead({
    script: [
      {
        type: 'application/ld+json',
        children: JSON.stringify(organizationSchema),
      },
    ],
  })
}

export function useProductsPageSeo() {
  useSeo({
    title: 'Our Products | Baby Feeding & Care Essentials',
    description: 'Explore Oya Plastic Factory\'s complete range of baby products. Feeding bottles, water cups, tableware, bath products, and accessories designed for your baby\'s safety and comfort.',
    canonicalPath: '/products',
  })
}