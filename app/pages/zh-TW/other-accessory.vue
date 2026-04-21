<template>
  <CategoryPage
    :category-slug="categorySlug"
    :page-title="pageTitle"
    :page-description="pageDescription"
  />
</template>

<script setup lang="ts">
const categorySlug = 'other-accessory'
const { $t } = useI18n()
const pageTitle = $t('products.accessories.title')
const pageDescription = $t('products.accessories.description')
</script>