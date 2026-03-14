/**
 * useProductAssets Composable
 *
 * Loads product images from assets/images/products/ and generates SEO-friendly alt tags.
 * Files starting with . (hidden files) are automatically excluded via glob pattern.
 */

export interface ProductAsset {
  src: string
  alt: string
  filename: string
  category: string
}

export interface CategoryAssets {
  category: string
  images: ProductAsset[]
}

// Category keyword mapping for enhanced alt descriptions
const categoryKeywords: Record<string, string[]> = {
  'feeding-bottles': ['bottle', 'feeding', 'milk', 'nipple', 'ppsu', 'glass', 'silicone'],
  'water-cups': ['cup', 'sippy', 'water', 'bottle', 'straw', 'handle', 'toddler'],
  'baby-tableware': ['plate', 'bowl', 'spoon', 'fork', 'tableware', 'suction', 'feeding'],
  'bath-potty': ['bath', 'tub', 'potty', 'toilet', 'seat', 'baby', 'shower'],
  'accessories': ['brush', 'cleaner', 'powder', 'box', 'teether', 'pacifier', 'clip'],
}

// Color keywords for product variants
const colorKeywords = [
  'pink', 'blue', 'green', 'yellow', 'orange', 'red', 'purple', 'white', 'black',
  'gray', 'grey', 'brown', 'beige', 'gold', 'silver', 'navy', 'teal', 'cyan',
]

/**
 * Generate SEO-friendly alt text from filename
 * Examples:
 * - "baby-bottle-blue.png" → "Blue Baby Bottle"
 * - "XTQ-6077 160ml.jpg" → "XTQ-6077 160ml"
 * - "silicone feeding spoon set.jpg" → "Silicone Feeding Spoon Set"
 */
function generateAltText(filename: string, category: string): string {
  // Remove file extension
  const nameWithoutExt = filename.replace(/\.[^/.]+$/, '')

  // Replace underscores and multiple spaces with single space
  let cleaned = nameWithoutExt.replace(/[_-]+/g, ' ').replace(/\s+/g, ' ').trim()

  // Split into words
  const words = cleaned.split(' ')

  // Check for color keywords and move them to the front
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

  // Build the alt text
  let altText = ''

  // Add colors at the beginning
  if (colors.length > 0) {
    altText = colors.join(' ') + ' '
  }

  // Add remaining words with proper capitalization
  altText += otherWords
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')

  // Add category context if not already present
  const categoryContext = getCategoryContext(category)
  if (categoryContext && !altText.toLowerCase().includes(categoryContext.toLowerCase())) {
    altText = `${altText} - ${categoryContext}`
  }

  return altText.trim()
}

/**
 * Get human-readable category context
 */
function getCategoryContext(category: string): string {
  const contexts: Record<string, string> = {
    'feeding-bottles': 'Baby Feeding Bottle',
    'water-cups': 'Baby Water Cup',
    'baby-tableware': 'Baby Tableware',
    'bath-potty': 'Baby Bath & Potty',
    'accessories': 'Baby Accessories',
  }
  return contexts[category] || ''
}

/**
 * Main composable for product assets
 */
export function useProductAssets() {
  // Use import.meta.glob to load all product images
  const images = import.meta.glob('~/assets/images/products/**/*.{jpg,jpeg,png,webp,gif}', {
    eager: true,
    as: 'url',
  })

  /**
   * Get all product assets grouped by category
   */
  const getAllAssets = (): CategoryAssets[] => {
    const grouped: Record<string, ProductAsset[]> = {
      'feeding-bottles': [],
      'water-cups': [],
      'baby-tableware': [],
      'bath-potty': [],
      'accessories': [],
    }

    for (const path in images) {
      // Extract filename from path
      const filename = path.split('/').pop() || ''

      // Skip hidden files (starting with .)
      if (filename.startsWith('.')) continue

      // Extract category from path
      const pathParts = path.split('/')
      const productsIndex = pathParts.findIndex(p => p === 'products')
      const category = pathParts[productsIndex + 1] || 'unknown'

      if (grouped[category]) {
        grouped[category].push({
          src: images[path] as string,
          alt: generateAltText(filename, category),
          filename,
          category,
        })
      }
    }

    // Sort images within each category
    for (const category in grouped) {
      grouped[category].sort((a, b) => a.filename.localeCompare(b.filename))
    }

    return Object.entries(grouped).map(([category, images]) => ({
      category,
      images,
    }))
  }

  /**
   * Get assets for a specific category
   */
  const getCategoryAssets = (category: string): ProductAsset[] => {
    const allAssets = getAllAssets()
    const found = allAssets.find(a => a.category === category)
    return found ? found.images : []
  }

  /**
   * Get asset data for a specific filename
   */
  const getAssetData = (filename: string, category: string): ProductAsset | null => {
    const categoryAssets = getCategoryAssets(category)
    return categoryAssets.find(a => a.filename === filename) || null
  }

  /**
   * Get total image count
   */
  const getTotalCount = (): number => {
    return Object.keys(images).filter(path => {
      const filename = path.split('/').pop() || ''
      return !filename.startsWith('.')
    }).length
  }

  /**
   * Get count by category
   */
  const getCountByCategory = (category: string): number => {
    return getCategoryAssets(category).length
  }

  return {
    getAllAssets,
    getCategoryAssets,
    getAssetData,
    getTotalCount,
    getCountByCategory,
    generateAltText,
  }
}