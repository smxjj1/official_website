<template>
  <CategoryPage
    :category-slug="categorySlug"
    :page-title="pageTitle"
    :page-description="pageDescription"
  />
</template>

<script setup lang="ts">
const categorySlug = 'baby-tableware'
const pageTitle = 'Baby Tableware'
const pageDescription = 'Ergonomic plates, bowls, and utensils designed for self-feeding. Suction bases and soft edges for safer mealtimes.'
</script>