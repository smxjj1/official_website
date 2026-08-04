<template>
  <ProductDetailPage
    v-if="product"
    :product="product"
    :category-title="categoryTitle"
  />
</template>

<script setup lang="ts">
import {
  buildProductPath,
  buildProductSlug,
  findProductByRouteSlug,
} from '~/utils/productSlug'

const route = useRoute()
const config = useRuntimeConfig()
const { getLocalePath } = useSiteLocale()
const {
  findCategoryBySlug,
  getCategoryPageTitle,
  pending: navPending,
} = useProductCategoryNav()

const categorySlug = computed(() => String(route.params.categorySlug || ''))
const productSlug = computed(() => String(route.params.productSlug || ''))

const category = computed(() => findCategoryBySlug(categorySlug.value))
const categoryTitle = computed(() => getCategoryPageTitle(categorySlug.value)
  || category.value?.name
  || categorySlug.value)

const { products, pending: productsPending } = useProductCatalog(categorySlug)

const product = computed(() => {
  if (productsPending.value || navPending.value)
    return null
  return findProductByRouteSlug(
    products.value as Array<{
      itemNo?: string
      name?: string
      categorySlug?: string
      [key: string]: unknown
    }>,
    productSlug.value,
    categorySlug.value,
  )
})

watch([navPending, productsPending, category, product, productSlug], async () => {
  if (navPending.value || productsPending.value)
    return

  // 分类导航偶发未就绪时，只要产品能命中仍展示详情（避免误 404）
  if (!product.value) {
    throw createError({ statusCode: 404, statusMessage: 'Product not found' })
  }

  const canonicalSlug = buildProductSlug(
    String(product.value.itemNo || ''),
    String(product.value.name || ''),
  )
  if (canonicalSlug && productSlug.value.toLowerCase() !== canonicalSlug) {
    const path = buildProductPath(
      categorySlug.value,
      String(product.value.itemNo || ''),
      String(product.value.name || ''),
    )
    await navigateTo(getLocalePath(path), { redirectCode: 301, replace: true })
  }
}, { immediate: true })

const seoTitle = computed(() => {
  if (!product.value)
    return 'Product'
  return `${product.value.name} (${product.value.itemNo})`
})

const seoDescription = computed(() => {
  if (!product.value)
    return ''
  const desc = String(product.value.description || '').trim()
  if (desc)
    return desc.slice(0, 160)
  const bits = [
    product.value.name,
    product.value.itemNo,
    product.value.material,
    product.value.capacity,
    categoryTitle.value,
  ].filter(Boolean)
  return bits.join(' · ').slice(0, 160)
})

const canonicalPath = computed(() => {
  if (!product.value)
    return route.path
  return getLocalePath(buildProductPath(
    categorySlug.value,
    String(product.value.itemNo || ''),
    String(product.value.name || ''),
  ))
})

useHead(() => {
  if (!product.value)
    return {}

  const siteName = config.public.siteName || 'Huangyan Oya Plastic Factory'
  const siteUrl = String(config.public.siteUrl || 'https://oyababies.com').replace(/\/$/, '')
  const fullTitle = `${seoTitle.value} | ${siteName}`
  const canonicalUrl = `${siteUrl}${canonicalPath.value}`
  const images = ([
    product.value.mainImage,
    ...((product.value.gallery || product.value.images || []) as string[]),
  ].filter(Boolean) as string[])

  return {
    title: fullTitle,
    meta: [
      { name: 'description', content: seoDescription.value },
      { name: 'robots', content: 'index, follow' },
      { property: 'og:title', content: fullTitle },
      { property: 'og:description', content: seoDescription.value },
      { property: 'og:type', content: 'product' },
      { property: 'og:url', content: canonicalUrl },
      { property: 'og:site_name', content: siteName },
      ...(images[0] ? [{ property: 'og:image', content: images[0] }] : []),
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: fullTitle },
      { name: 'twitter:description', content: seoDescription.value },
    ],
    link: [{ rel: 'canonical', href: canonicalUrl }],
    script: [
      {
        type: 'application/ld+json',
        children: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: product.value.name,
          sku: product.value.itemNo,
          mpn: product.value.itemNo,
          description: seoDescription.value,
          image: images,
          url: canonicalUrl,
          brand: {
            '@type': 'Brand',
            name: siteName,
          },
          category: categoryTitle.value,
        }),
      },
    ],
  }
})

definePageMeta({
  layout: 'default',
})
</script>
