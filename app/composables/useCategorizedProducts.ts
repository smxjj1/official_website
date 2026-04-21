/**
 * useCategorizedProducts Composable
 *
 * Folder-aware product image loading with grouped structure.
 * Respects subdirectory hierarchy within each product category.
 */

import type { ProductImage } from '~/types/product'

export interface ProductGroup {
  groupName: string
  slug: string
  images: ProductImage[]
  imageCount: number
}

export interface CategorizedProducts {
  category: string
  categorySlug: string
  groups: ProductGroup[]
  totalImages: number
}

// Color keywords for product variants
const colorKeywords = [
  'pink', 'blue', 'green', 'yellow', 'orange', 'red', 'purple', 'white', 'black',
  'gray', 'grey', 'brown', 'beige', 'gold', 'silver', 'navy', 'teal', 'cyan',
]

/**
 * Generate human-readable group name from folder name
 * Examples:
 * - "ppsu" -> "PPSU Bottles"
 * - "glass-bottles" -> "Glass Bottles"
 * - "spoons-forks" -> "Spoons & Forks"
 */
function generateGroupName(folderName: string, category: string): string {
  // Handle common abbreviations
  const abbreviations: Record<string, string> = {
    'ppsu': 'PPSU',
    'pp': 'PP (Polypropylene)',
    'tritan': 'Tritan',
    'sku': 'Product Variants',
    'bd': 'Main Images',
    'zt': 'Main Images',
    'xq': 'Detail Images',
  }

  // Check for abbreviation
  const lowerName = folderName.toLowerCase()
  if (abbreviations[lowerName]) {
    return abbreviations[lowerName]
  }

  // Convert kebab-case or snake_case to title case
  const words = folderName
    .replace(/[-_]/g, ' ')
    .replace(/([A-Z])/g, ' $1')
    .trim()
    .split(/\s+/)

  return words
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

/**
 * Generate SEO-friendly alt text from filename
 */
function generateAltText(filename: string, groupName: string, category: string): string {
  // Remove file extension
  const nameWithoutExt = filename.replace(/\.[^/.]+$/, '')

  // Clean up filename
  let cleaned = nameWithoutExt
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  // Split into words
  const words = cleaned.split(' ')

  // Extract colors
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

  // Build alt text
  let altText = ''

  if (colors.length > 0) {
    altText = colors.join(' ') + ' '
  }

  altText += otherWords
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')

  // Add context
  if (groupName && groupName !== 'All Products') {
    altText = `${altText} - ${groupName}`
  }

  return altText.trim() || `Product Image`
}

/**
 * Get category context for alt text
 */
function getCategoryContext(category: string): string {
  const contexts: Record<string, string> = {
    'feeding-bottles': 'Baby Feeding Bottle',
    'water-cups': 'Baby Water Cup',
    'baby-tableware': 'Baby Tableware',
    'bath-potty': 'Baby Bath & Potty',
    'accessories': 'Baby Accessories',
  }
  return contexts[category] || 'Product'
}

/**
 * Main composable for categorized products
 */
export function useCategorizedProducts() {
  // Load all product images with import.meta.glob
  const allImages = import.meta.glob('~/assets/images/products/**/*.{jpg,jpeg,png,webp,gif}', {
    eager: true,
    as: 'url',
  })

  /**
   * Build a tree structure from flat image paths
   */
  const buildImageTree = (): Record<string, Record<string, ProductImage[]>> => {
    const tree: Record<string, Record<string, ProductImage[]>> = {}

    for (const path in allImages) {
      const filename = path.split('/').pop() || ''

      // Skip hidden files
      if (filename.startsWith('.')) continue

      // Parse path: ~/assets/images/products/{category}/{group?}/{filename}
      const pathParts = path.replace(/\\/g, '/').split('/')
      const productsIndex = pathParts.findIndex(p => p === 'products')

      if (productsIndex === -1 || productsIndex + 1 >= pathParts.length) continue

      const category = pathParts[productsIndex + 1]

      // Determine if there's a subfolder between category and filename
      // Check if pathParts[productsIndex + 2] is a file (has extension) or folder
      const possibleGroupOrFile = pathParts[productsIndex + 2]
      const hasExtension = possibleGroupOrFile && /\.(jpg|jpeg|png|webp|gif)$/i.test(possibleGroupOrFile)

      // If the element after category is a file, no subfolder exists
      const group = (!possibleGroupOrFile || hasExtension) ? '_root' : possibleGroupOrFile

      if (!tree[category]) {
        tree[category] = {}
      }

      if (!tree[category][group]) {
        tree[category][group] = []
      }

      const groupName = group === '_root' ? 'All Products' : generateGroupName(group, category)

      tree[category][group].push({
        src: allImages[path] as string,
        alt: generateAltText(filename, groupName, category),
        filename,
      })
    }

    return tree
  }

  /**
   * Get categorized products for a specific category
   */
  const getCategoryProducts = (categorySlug: string): CategorizedProducts | null => {
    const tree = buildImageTree()
    const categoryData = tree[categorySlug]

    if (!categoryData) {
      return {
        category: getCategoryContext(categorySlug),
        categorySlug,
        groups: [],
        totalImages: 0,
      }
    }

    const groups: ProductGroup[] = []
    let totalImages = 0

    for (const groupSlug in categoryData) {
      const images = categoryData[groupSlug]
      const groupName = groupSlug === '_root' ? 'All Products' : generateGroupName(groupSlug, categorySlug)

      // Sort images by filename
      images.sort((a, b) => a.filename.localeCompare(b.filename))

      groups.push({
        groupName,
        slug: groupSlug,
        images,
        imageCount: images.length,
      })

      totalImages += images.length
    }

    // Sort groups - put 'All Products' first, then alphabetically
    groups.sort((a, b) => {
      if (a.slug === '_root') return -1
      if (b.slug === '_root') return 1
      return a.groupName.localeCompare(b.groupName)
    })

    return {
      category: getCategoryContext(categorySlug),
      categorySlug,
      groups,
      totalImages,
    }
  }

  /**
   * Get all categories with their image counts
   */
  const getAllCategoriesStats = (): Array<{ slug: string; name: string; imageCount: number }> => {
    const tree = buildImageTree()
    const stats: Array<{ slug: string; name: string; imageCount: number }> = []

    const categoryNames: Record<string, string> = {
      'feeding-bottles': 'Feeding Bottles',
      'water-cups': 'Water Cups',
      'baby-tableware': 'Baby Tableware',
      'bath-potty': 'Bath & Potty',
      'accessories': 'Accessories',
    }

    for (const categorySlug in tree) {
      let count = 0
      for (const group in tree[categorySlug]) {
        count += tree[categorySlug][group].length
      }
      stats.push({
        slug: categorySlug,
        name: categoryNames[categorySlug] || categorySlug,
        imageCount: count,
      })
    }

    return stats
  }

  return {
    getCategoryProducts,
    getAllCategoriesStats,
    buildImageTree,
  }
}