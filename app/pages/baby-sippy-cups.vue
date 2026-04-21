<template>
  <CategoryPage
    :category-slug="categorySlug"
    :page-title="pageTitle"
    :page-description="pageDescription"
  />
</template>

<script setup lang="ts">
const categorySlug = 'baby-sippy-cups'
const pageTitle = 'Baby Sippy Cups'
const pageDescription = 'Spill-proof sippy cups and water bottles that help your little one transition to independent drinking with confidence.'
</script>