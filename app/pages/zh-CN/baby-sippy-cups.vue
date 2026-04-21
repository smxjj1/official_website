<template>
  <CategoryPage
    :category-slug="categorySlug"
    :page-title="pageTitle"
    :page-description="pageDescription"
  />
</template>

<script setup lang="ts">
const categorySlug = 'baby-sippy-cups'
const { $t } = useI18n()
const pageTitle = $t('products.sippyCups.title')
const pageDescription = $t('products.sippyCups.description')
</script>