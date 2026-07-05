<template>
  <CategoryPage
    :category-slug="categorySlug"
    :page-title="pageTitle"
    :page-description="pageDescription"
  />
</template>

<script setup lang="ts">
const categorySlug = 'baby-feeding-bottles'
const { $t } = useSiteLocale()
const pageTitle = $t('products.feedingBottles.title')
const pageDescription = $t('products.feedingBottles.description')
</script>