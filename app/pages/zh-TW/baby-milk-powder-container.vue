<template>
  <CategoryPage
    :category-slug="categorySlug"
    :page-title="pageTitle"
    :page-description="pageDescription"
  />
</template>

<script setup lang="ts">
const categorySlug = 'baby-milk-powder-container'
const { $t } = useI18n()
const pageTitle = $t('products.milkPowderContainer.title')
const pageDescription = $t('products.milkPowderContainer.description')
</script>