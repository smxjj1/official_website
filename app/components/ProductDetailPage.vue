<template>
  <div v-if="product" class="product-detail-page">
    <nav class="detail-breadcrumb" aria-label="Breadcrumb">
      <NuxtLink :to="categoryPath" class="crumb-link">
        {{ categoryTitle }}
      </NuxtLink>
      <span class="crumb-sep" aria-hidden="true">/</span>
      <span class="crumb-current">{{ product.itemNo }}</span>
    </nav>

    <div class="detail-layout">
      <div class="detail-gallery">
        <div class="gallery-main">
          <img
            v-if="gallery.length"
            :src="gallery[galleryIndex]"
            :alt="product.name"
          >
          <div v-else class="gallery-placeholder">
            <span>{{ product.itemNo.charAt(0) }}</span>
          </div>
        </div>
        <div v-if="gallery.length > 1" class="gallery-thumbs">
          <button
            v-for="(img, i) in gallery"
            :key="i"
            type="button"
            class="thumb"
            :class="{ active: galleryIndex === i }"
            @click="galleryIndex = i"
          >
            <OptimImg :src="img" :alt="`${product.name} ${i + 1}`" loading="lazy" />
          </button>
        </div>
      </div>

      <div class="detail-info">
        <h1 class="detail-name">{{ product.name }}</h1>
        <p class="detail-item-no">{{ $t('products.itemNo', { itemNo: product.itemNo }) }}</p>

        <div v-if="product.description" class="detail-desc">
          <h2>{{ $t('products.description') }}</h2>
          <p>{{ product.description }}</p>
        </div>

        <div class="detail-specs">
          <h2>{{ $t('products.specifications') }}</h2>
          <table class="specs-table">
            <tbody>
              <tr v-if="product.capacity">
                <td>{{ $t('products.capacity') }}</td>
                <td>{{ product.capacity }}</td>
              </tr>
              <tr v-if="product.material">
                <td>{{ $t('products.material') }}</td>
                <td>{{ product.material }}</td>
              </tr>
              <tr v-if="product.specs?.pcsPerCtn">
                <td>{{ $t('products.pcsPerCtn') }}</td>
                <td>{{ product.specs.pcsPerCtn }}</td>
              </tr>
              <tr v-if="product.specs?.ctnSize">
                <td>{{ $t('products.ctnSize') }}</td>
                <td>{{ product.specs.ctnSize }}</td>
              </tr>
              <tr v-if="product.specs?.nw">
                <td>{{ $t('products.nw') }}</td>
                <td>{{ product.specs.nw }}</td>
              </tr>
              <tr v-if="product.specs?.gw">
                <td>{{ $t('products.gw') }}</td>
                <td>{{ product.specs.gw }}</td>
              </tr>
              <tr v-if="product.specs?.pcs20gp">
                <td>{{ $t('products.pcs20gp') }}</td>
                <td>{{ Number(product.specs.pcs20gp).toLocaleString() }}</td>
              </tr>
              <tr v-if="product.specs?.pcs40hq">
                <td>{{ $t('products.pcs40hq') }}</td>
                <td>{{ Number(product.specs.pcs40hq).toLocaleString() }}</td>
              </tr>
              <tr v-if="product.specs?.moq">
                <td>{{ $t('products.moq') }}</td>
                <td>{{ Number(product.specs.moq).toLocaleString() }}</td>
              </tr>
              <tr v-if="product.specs?.hsCode">
                <td>{{ $t('products.hsCode') }}</td>
                <td>{{ product.specs.hsCode }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="detail-actions">
          <button type="button" class="detail-add-list" @click="handleAddToList">
            {{ $t('inquiryList.addToList') }}
          </button>
          <NuxtLink
            :to="{ path: getLocalePath('/contact-us'), query: { products: product.itemNo } }"
            class="detail-cta"
          >
            {{ $t('products.contactInquiry') }}
          </NuxtLink>
        </div>

        <NuxtLink :to="categoryPath" class="back-link">
          ← {{ $t('products.backToCategory') }}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface ProductDetailSpecs {
  pcsPerCtn?: number | string | null
  nw?: number | string | null
  gw?: number | string | null
  ctnSize?: string | null
  pcs20gp?: number | string | null
  pcs40hq?: number | string | null
  moq?: number | string | null
  hsCode?: string | null
  [key: string]: unknown
}

export interface ProductDetailModel {
  id?: number
  itemNo: string
  name: string
  description?: string
  material?: string
  capacity?: string
  categorySlug: string
  category?: string
  mainImage?: string
  gallery?: string[]
  images?: string[]
  specs?: ProductDetailSpecs
}

const props = defineProps<{
  product: ProductDetailModel
  categoryTitle: string
}>()

const { $t, getLocalePath } = useSiteLocale()
const { add, showFeedback } = useInquiryList()

const galleryIndex = ref(0)

const gallery = computed(() => {
  const list = props.product.gallery?.length
    ? props.product.gallery
    : (props.product.images?.length ? props.product.images : [])
  if (list.length)
    return list
  return props.product.mainImage ? [props.product.mainImage] : []
})

const categoryPath = computed(() => getLocalePath(`/${props.product.categorySlug}`))

watch(() => props.product.itemNo, () => {
  galleryIndex.value = 0
})

const handleAddToList = () => {
  const result = add({
    itemNo: props.product.itemNo,
    name: props.product.name,
    categorySlug: props.product.categorySlug,
    mainImage: props.product.mainImage || gallery.value[0] || '',
  })

  if (result.ok) {
    showFeedback(String($t('inquiryList.added')))
    return
  }
  if (result.reason === 'duplicate') {
    showFeedback(String($t('inquiryList.alreadyInList')))
    return
  }
  if (result.reason === 'limit') {
    showFeedback(String($t('inquiryList.limitReached')))
  }
}
</script>

<style lang="less" scoped>
@import '~/assets/css/variables.less';

.product-detail-page {
  max-width: @breakpoint-wide;
  margin: 0 auto;
  padding: @spacing-xl @spacing-md @spacing-xxl;
}

.detail-breadcrumb {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: @spacing-xs;
  margin-bottom: @spacing-xl;
  font-size: 0.9rem;
  color: @text-light;
}

.crumb-link {
  color: @primary-color-dark;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
}

.crumb-sep {
  opacity: 0.5;
}

.crumb-current {
  color: @text-color;
  font-weight: 600;
}

.detail-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: @spacing-xxl;
  align-items: start;

  @media (max-width: @breakpoint-tablet) {
    grid-template-columns: 1fr;
    gap: @spacing-xl;
  }
}

.detail-gallery {
  position: sticky;
  top: 88px;

  @media (max-width: @breakpoint-tablet) {
    position: static;
  }
}

.gallery-main {
  aspect-ratio: 1;
  border-radius: @radius-md;
  overflow: hidden;
  background: @background-color;
  border: 1px solid @border-light;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    display: block;
  }
}

.gallery-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
  font-weight: 700;
  color: @primary-color;
  opacity: 0.25;
}

.gallery-thumbs {
  display: flex;
  flex-wrap: wrap;
  gap: @spacing-xs;
  margin-top: @spacing-sm;
}

.thumb {
  width: 64px;
  height: 64px;
  padding: 0;
  border: 2px solid transparent;
  border-radius: @radius-sm;
  overflow: hidden;
  cursor: pointer;
  background: @card-background;

  &.active {
    border-color: @primary-color;
  }

  :deep(img),
  :deep(.optim-img) {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.detail-name {
  font-size: 1.75rem;
  font-weight: 700;
  color: @text-color;
  margin: 0 0 @spacing-sm;
  line-height: 1.3;

  @media (max-width: @breakpoint-tablet) {
    font-size: 1.4rem;
  }
}

.detail-item-no {
  margin: 0 0 @spacing-lg;
  color: @text-light;
  font-size: 0.95rem;
}

.detail-desc,
.detail-specs {
  margin-bottom: @spacing-xl;

  h2 {
    font-size: 1rem;
    font-weight: 700;
    margin: 0 0 @spacing-sm;
    color: @text-color;
  }

  p {
    margin: 0;
    line-height: 1.7;
    color: @text-light;
  }
}

.specs-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;

  td {
    padding: @spacing-sm @spacing-md;
    border-bottom: 1px solid @border-light;
    vertical-align: top;
  }

  td:first-child {
    width: 42%;
    color: @text-light;
    font-weight: 600;
  }

  td:last-child {
    color: @text-color;
  }
}

.detail-actions {
  display: flex;
  flex-wrap: wrap;
  gap: @spacing-md;
  margin-bottom: @spacing-xl;
}

.detail-add-list,
.detail-cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: @spacing-sm @spacing-xl;
  border-radius: @radius-sm;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  border: none;
  font-size: 0.95rem;
}

.detail-add-list {
  background: @card-background;
  color: @primary-color-dark;
  border: 1px solid @border-color;
}

.detail-cta {
  background: @primary-color;
  color: #fff;
}

.back-link {
  display: inline-block;
  color: @primary-color-dark;
  text-decoration: none;
  font-size: 0.9rem;

  &:hover {
    text-decoration: underline;
  }
}
</style>
