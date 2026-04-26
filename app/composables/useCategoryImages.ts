/**
 * useCategoryImages Composable
 *
 * Loads curated category images from assets/images/home/categories/.
 * Each category has 4 representative product images.
 */

import type { ProductImage } from '~/types/product'

export interface CategoryImageData {
  slug: string
  name: string
  images: ProductImage[]
  imageCount: number
}

/**
 * Main composable
 */
export function useCategoryImages() {
  const { $t } = useI18n()

  // Load all category images
  const allImages = import.meta.glob(
    '~/assets/images/home/categories/**/*.{jpg,jpeg,png,webp}',
    { eager: true, as: 'url' }
  )

  // Category names mapping with i18n keys
  const categoryI18nKeys: Record<string, string> = {
    'feeding-bottles': 'products.feedingBottles.title',
    'water-cups': 'products.sippyCups.title',
    'baby-tableware': 'products.tableware.title',
    'bath-potty': 'products.bathPotty.title',
    'milk-container': 'products.milkPowderContainer.title',
    'accessories': 'products.accessories.title',
  }

  // Folder mapping
  const folderMap: Record<string, string> = {
    'feeding-bottles': 'bottles',
    'water-cups': 'cups',
    'baby-tableware': 'tableware',
    'bath-potty': 'bath-potty',
    'milk-container': 'milk-container',
    'accessories': 'accessories',
  }

  /**
   * Generate SEO-friendly alt text (reactive)
   */
  const generateAltText = (categorySlug: string, index: number): string => {
    const categoryName = $t(categoryI18nKeys[categorySlug] ?? categorySlug) as string
    return `${categoryName} - Product ${index + 1}`
  }

  /**
   * Get curated images for a specific category (static images, reactive alt text)
   */
  const getCategoryImagesBySlug = (categorySlug: string): ProductImage[] => {
    const folder = folderMap[categorySlug]
    if (!folder) return []

    // Find images in this category folder
    const categoryImages: { path: string; url: string; index: number }[] = []

    for (const imagePath in allImages) {
      const normalizedPath = imagePath.replace(/\\/g, '/')
      if (normalizedPath.includes(`/categories/${folder}/`)) {
        const filename = imagePath.split('/').pop() ?? ''
        // Extract index from filename (1, 2, 3, 4 or img1, img2, etc.)
        const match = filename.match(/(?:img)?(\d)/)
        const index = match?.[1] ? parseInt(match[1]) : 1

        const imgData = allImages[imagePath]
        if (imgData) {
          categoryImages.push({
            path: imagePath,
            url: imgData as string,
            index,
          })
        }
      }
    }

    // Sort by index
    categoryImages.sort((a, b) => a.index - b.index)

    // Convert to ProductImage format with reactive alt text
    return categoryImages.map(img => ({
      src: img.url,
      alt: generateAltText(categorySlug, img.index - 1),
      filename: img.path.split('/').pop() ?? '',
    }))
  }

  /**
   * Get all categories with their curated images (reactive)
   */
  const getAllCategoryImages = computed<CategoryImageData[]>(() => {
    const slugs = ['feeding-bottles', 'water-cups', 'baby-tableware', 'bath-potty', 'milk-container', 'accessories']

    return slugs.map(slug => ({
      slug,
      name: $t(categoryI18nKeys[slug] ?? slug) as string,
      images: getCategoryImagesBySlug(slug),
      imageCount: getCategoryImagesBySlug(slug).length,
    }))
  })

  return {
    getCategoryImagesBySlug,
    getAllCategoryImages,
  }
}