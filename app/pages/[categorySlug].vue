<template>
  <CategoryPage
    v-if="isReady"
    :category-slug="categorySlug"
    :page-title="pageTitle"
    :page-description="pageDescription"
    :subcategory-order="subcategoryOrder"
  />
</template>

<script setup lang="ts">
const route = useRoute()
const categorySlug = computed(() => String(route.params.categorySlug || ''))

const {
  pending,
  findCategoryBySlug,
  getCategoryPageTitle,
  getCategoryPageDescription,
} = useProductCategoryNav()

const category = computed(() => findCategoryBySlug(categorySlug.value))

const isReady = computed(() => !pending.value && !!category.value)

const pageTitle = computed(() => getCategoryPageTitle(categorySlug.value))
const pageDescription = computed(() => getCategoryPageDescription(categorySlug.value))
const subcategoryOrder = computed(() => category.value?.subcategories || [])

watch([pending, category], () => {
  if (pending.value) {
    return
  }
  if (!category.value) {
    throw createError({ statusCode: 404, statusMessage: 'Category not found' })
  }
}, { immediate: true })

definePageMeta({
  layout: 'default',
})
</script>
