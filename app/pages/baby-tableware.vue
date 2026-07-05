<template>
  <CategoryPage
    :category-slug="categorySlug"
    :page-title="pageTitle"
    :page-description="pageDescription"
  />
</template>

<script setup lang="ts">
const categorySlug = 'baby-tableware'
const { $t } = useSiteLocale()
const pageTitle = $t('products.tableware.title')
const pageDescription = $t('products.tableware.description')
</script>