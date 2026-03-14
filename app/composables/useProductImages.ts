import type { ProductImage } from '~/types/product'

/**
 * Composable for loading product images from public/photo/ directory
 * Filters out files starting with . (hidden files)
 */
export function useProductImages() {
  const config = useRuntimeConfig()

  /**
   * Get all images from a specific category folder
   * @param folder - The folder name inside public/photo/
   */
  const getCategoryImages = (folder: string): ProductImage[] => {
    // In production, this would be replaced by server-side file reading
    // For now, we'll use a static image list that can be updated
    const images = import.meta.glob('~/public/photo/**/*', { eager: true, as: 'url' })

    const categoryImages: ProductImage[] = []

    for (const path in images) {
      // Extract filename from path
      const filename = path.split('/').pop() || ''

      // Skip hidden files (starting with .)
      if (filename.startsWith('.')) continue

      // Check if the image belongs to the requested folder
      if (path.includes(`/photo/${folder}/`)) {
        const imagePath = images[path] as string
        categoryImages.push({
          filename,
          path: imagePath.replace('/public', ''),
          alt: formatImageAlt(filename, folder),
        })
      }
    }

    return categoryImages.sort((a, b) => a.filename.localeCompare(b.filename))
  }

  /**
   * Get all images from public/photo/ root
   */
  const getAllImages = (): ProductImage[] => {
    const images = import.meta.glob('~/public/photo/**/*.{jpg,jpeg,png,webp,gif}', { eager: true, as: 'url' })

    const allImages: ProductImage[] = []

    for (const path in images) {
      const filename = path.split('/').pop() || ''
      if (filename.startsWith('.')) continue

      const imagePath = images[path] as string
      allImages.push({
        filename,
        path: imagePath.replace('/public', ''),
        alt: formatImageAlt(filename, 'product'),
      })
    }

    return allImages.sort((a, b) => a.filename.localeCompare(b.filename))
  }

  /**
   * Format filename into readable alt text
   */
  const formatImageAlt = (filename: string, category: string): string => {
    const nameWithoutExt = filename.replace(/\.[^/.]+$/, '')
    const formatted = nameWithoutExt
      .replace(/[-_]/g, ' ')
      .replace(/([A-Z])/g, ' $1')
      .trim()
    return `${category} - ${formatted}`
  }

  /**
   * Check if a folder has images
   */
  const hasImages = (folder: string): boolean => {
    return getCategoryImages(folder).length > 0
  }

  return {
    getCategoryImages,
    getAllImages,
    hasImages,
  }
}