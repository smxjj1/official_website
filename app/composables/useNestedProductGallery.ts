/**
 * useNestedProductGallery Composable
 *
 * Loads product images from nested folder structure in assets/images/products/.
 * Groups images by their immediate parent folder (subcategory).
 */

export interface ProductImage {
  src: string
  alt: string
  filename: string
}

export interface SubcategoryGroup {
  id: string // slugified subcategory
  label: string // Human readable name
  mainCategory: string // Parent category slug
  fullSlug: string // e.g., "feeding-bottles/xtq-6077-160ml"
  images: ProductImage[]
  imageCount: number
}

export interface MainCategory {
  slug: string
  name: string
  subcategories: SubcategoryGroup[]
  totalImages: number
}

// Color keywords for alt text
const colorKeywords = [
  'pink', 'blue', 'green', 'yellow', 'orange', 'red', 'purple', 'white', 'black',
  'gray', 'grey', 'brown', 'beige', 'gold', 'silver', 'navy', 'teal', 'cyan',
]

// Category display names
const categoryNames: Record<string, string> = {
  'feeding-bottles': 'Feeding Bottles',
  'water-cups': 'Water Cups',
  'baby-tableware': 'Baby Tableware',
  'bath-potty': 'Bath & Potty',
  'accessories': 'Accessories',
}

/**
 * Generate human-readable label from slug
 */
function generateLabel(slug: string): string {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * Generate SEO-friendly alt text
 */
function generateAltText(filename: string, subcategory: string, mainCategory: string): string {
  const nameWithoutExt = filename.replace(/\.[^/.]+$/, '')
  const cleaned = nameWithoutExt
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  const words = cleaned.split(' ')
  const colors: string[] = []
  const otherWords: string[] = []

  for (const word of words) {
    const lowerWord = word.toLowerCase()
    if (colorKeywords.includes(lowerWord)) {
      colors.push(word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    } else {
      otherWords.push(word)
    }
  }

  let altText = ''
  if (colors.length > 0) {
    altText = colors.join(' ') + ' '
  }
  altText += otherWords
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')

  // Add category context
  const categoryName = categoryNames[mainCategory] || mainCategory
  if (subcategory && subcategory !== 'all-products') {
    altText = `${altText} - ${generateLabel(subcategory)} ${categoryName}`
  } else {
    altText = `${altText} - ${categoryName}`
  }

  return altText.trim() || 'Product Image'
}

/**
 * Main composable
 */
export function useNestedProductGallery() {
  // Load all product images
  const allImages = import.meta.glob('~/assets/images/products/**/*.{jpg,jpeg,png,webp,gif}', {
    eager: true,
    as: 'url',
  })

  /**
   * Build nested structure from flat image paths
   */
  const buildNestedStructure = (): MainCategory[] => {
    const categoryMap = new Map<string, Map<string, ProductImage[]>>()

    for (const imagePath in allImages) {
      const filename = imagePath.split('/').pop() || ''

      // Skip hidden files
      if (filename.startsWith('.')) continue

      // Parse path: ~/assets/images/products/{mainCategory}/{subcategory}/{filename}
      const normalizedPath = imagePath.replace(/\\/g, '/')
      const pathParts = normalizedPath.split('/')
      const productsIndex = pathParts.findIndex(p => p === 'products')

      if (productsIndex === -1 || pathParts.length < productsIndex + 3) continue

      const mainCategory = pathParts[productsIndex + 1]
      const subcategory = pathParts[productsIndex + 2]

      if (!mainCategory || !subcategory) continue

      // Initialize nested maps
      if (!categoryMap.has(mainCategory)) {
        categoryMap.set(mainCategory, new Map())
      }
      const subMap = categoryMap.get(mainCategory)!
      if (!subMap.has(subcategory)) {
        subMap.set(subcategory, [])
      }

      // Add image to subcategory
      subMap.get(subcategory)!.push({
        src: allImages[imagePath] as string,
        alt: generateAltText(filename, subcategory, mainCategory),
        filename,
      })
    }

    // Convert to array structure
    const categories: MainCategory[] = []

    for (const [mainSlug, subMap] of categoryMap) {
      const subcategories: SubcategoryGroup[] = []
      let totalImages = 0

      for (const [subSlug, images] of subMap) {
        // Sort images by filename
        images.sort((a, b) => a.filename.localeCompare(b.filename))

        subcategories.push({
          id: subSlug,
          label: generateLabel(subSlug),
          mainCategory: mainSlug,
          fullSlug: `${mainSlug}/${subSlug}`,
          images,
          imageCount: images.length,
        })

        totalImages += images.length
      }

      // Sort subcategories alphabetically
      subcategories.sort((a, b) => a.label.localeCompare(b.label))

      categories.push({
        slug: mainSlug,
        name: categoryNames[mainSlug] || generateLabel(mainSlug),
        subcategories,
        totalImages,
      })
    }

    // Sort categories by defined order
    const categoryOrder = ['feeding-bottles', 'water-cups', 'baby-tableware', 'bath-potty', 'accessories']
    categories.sort((a, b) => {
      const aIndex = categoryOrder.indexOf(a.slug)
      const bIndex = categoryOrder.indexOf(b.slug)
      return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex)
    })

    return categories
  }

  /**
   * Get all main categories with summary
   */
  const getAllCategories = (): MainCategory[] => {
    return buildNestedStructure()
  }

  /**
   * Get a specific main category by slug
   */
  const getCategory = (slug: string): MainCategory | null => {
    const categories = buildNestedStructure()
    return categories.find(c => c.slug === slug) || null
  }

  /**
   * Get subcategories for a main category
   */
  const getSubcategories = (mainSlug: string): SubcategoryGroup[] => {
    const category = getCategory(mainSlug)
    return category ? category.subcategories : []
  }

  /**
   * Get a specific subcategory
   */
  const getSubcategory = (mainSlug: string, subSlug: string): SubcategoryGroup | null => {
    const category = getCategory(mainSlug)
    if (!category) return null
    return category.subcategories.find(s => s.id === subSlug) || null
  }

  /**
   * Get all subcategories across all main categories (flat list)
   */
  const getAllSubcategories = (): SubcategoryGroup[] => {
    const categories = buildNestedStructure()
    return categories.flatMap(c => c.subcategories)
  }

  /**
   * Get statistics
   */
  const getStats = (): { totalImages: number; totalSubcategories: number; categoriesCount: number } => {
    const categories = buildNestedStructure()
    return {
      totalImages: categories.reduce((sum, c) => sum + c.totalImages, 0),
      totalSubcategories: categories.reduce((sum, c) => sum + c.subcategories.length, 0),
      categoriesCount: categories.length,
    }
  }

  return {
    getAllCategories,
    getCategory,
    getSubcategories,
    getSubcategory,
    getAllSubcategories,
    getStats,
    buildNestedStructure,
  }
}