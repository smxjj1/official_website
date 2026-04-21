<template>
  <CategoryPage
    :category-slug="categorySlug"
    :page-title="pageTitle"
    :page-description="pageDescription"
  />
</template>

<script setup lang="ts">
const categorySlug = 'baby-bath-potty'
const pageTitle = 'Baby Bath & Potty'
const pageDescription = 'Comfortable bath time essentials and potty training solutions designed with safety and convenience in mind.'
</script>