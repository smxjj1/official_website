<template>
  <CategoryPage
    :category-slug="categorySlug"
    :page-title="pageTitle"
    :page-description="pageDescription"
  />
</template>

<script setup lang="ts">
const categorySlug = 'other-accessory'
const pageTitle = 'Other Accessories'
const pageDescription = 'Essential baby care accessories including teethers, pacifiers, bottle brushes, breast pumps, and more to complete your baby care kit.'
</script>