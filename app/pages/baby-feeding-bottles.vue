<template>
  <CategoryPage
    :category-slug="categorySlug"
    :page-title="pageTitle"
    :page-description="pageDescription"
  />
</template>

<script setup lang="ts">
const categorySlug = 'baby-feeding-bottles'
const pageTitle = 'Baby Feeding Bottles'
const pageDescription = 'Premium feeding bottles designed for safe, comfortable feeding. BPA-free materials with anti-colic technology for your baby\'s wellbeing.'
</script>