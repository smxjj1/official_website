<template>
  <CategoryPage
    :category-slug="categorySlug"
    :page-title="pageTitle"
    :page-description="pageDescription"
  />
</template>

<script setup lang="ts">
const categorySlug = 'baby-bath-potty'
const { $t } = useSiteLocale()
const pageTitle = $t('products.bathPotty.title')
const pageDescription = $t('products.bathPotty.description')
</script>