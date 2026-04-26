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

// Category names mapping
const categoryNames: Record<string, string> = {
  'feeding-bottles': 'Baby Feeding Bottles',
  'water-cups': 'Baby Sippy Cups',
  'baby-tableware': 'Baby Tableware',
  'bath-potty': 'Baby Bath & Potty',
  'milk-container': 'Baby Milk Powder Container',
  'accessories': 'Other Accessory',
}

/**
 * Generate SEO-friendly alt text
 */
function generateAltText(categorySlug: string, index: number): string {
  const categoryName = categoryNames[categorySlug] ?? categorySlug
  return `${categoryName} - Product ${index + 1}`
}

/**
 * Main composable
 */
export function useCategoryImages() {
  // Load all category images
  const allImages = import.meta.glob(
    '~/assets/images/home/categories/**/*.{jpg,jpeg,png,webp}',
    { eager: true, as: 'url' }
  )

  /**
   * Get curated images for a specific category
   */
  const getCategoryImages = (categorySlug: string): ProductImage[] => {
    const images: ProductImage[] = []
    const folderMap: Record<string, string> = {
      'feeding-bottles': 'bottles',
      'water-cups': 'cups',
      'baby-tableware': 'tableware',
      'bath-potty': 'bath-potty',
      'milk-container': 'milk-container',
      'accessories': 'accessories',
    }

    const folder = folderMap[categorySlug]
    if (!folder) return []

    // Find images in this category folder
    const categoryImages: { path: string; url: string; index: number }[] = []

    for (const imagePath in allImages) {
      const normalizedPath = imagePath.replace(/\\/g, '/')
      if (normalizedPath.includes(`/categories/${folder}/`)) {
        const filename = imagePath.split('/').pop() ?? ''
        // Extract index from filename (img1, img2, etc.)
        const match = filename.match(/img(\d)/)
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

    // Convert to ProductImage format
    for (const img of categoryImages) {
      images.push({
        src: img.url,
        alt: generateAltText(categorySlug, img.index - 1),
        filename: img.path.split('/').pop() ?? '',
      })
    }

    return images
  }

  /**
   * Get all categories with their curated images
   */
  const getAllCategoryImages = (): CategoryImageData[] => {
    const slugs = ['feeding-bottles', 'water-cups', 'baby-tableware', 'bath-potty', 'milk-container', 'accessories']

    return slugs.map(slug => ({
      slug,
      name: categoryNames[slug] ?? slug,
      images: getCategoryImages(slug),
      imageCount: getCategoryImages(slug).length,
    }))
  }

  return {
    getCategoryImages,
    getAllCategoryImages,
  }
}