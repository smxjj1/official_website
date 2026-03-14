/**
 * Deep Nested Asset Migration Script
 *
 * Scans photo/ directory recursively, identifies leaf folders with images,
 * applies selection logic (quantity, quality, text heuristics), and
 * migrates selected images to assets/images/products/ preserving structure.
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Configuration
const PHOTO_DIR = path.join(__dirname, '../photo')
const DEST_DIR = path.join(__dirname, '../app/assets/images/products')

// Image extensions
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif']

/**
 * Check if path has Chinese characters
 */
function hasChinese(str) {
  return /[\u4e00-\u9fff]/.test(str)
}

/**
 * Generate slug from folder name
 */
function generateSlug(name) {
  return name
    .toLowerCase()
    .replace(/[\u4e00-\u9fff]/g, '') // Remove Chinese
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 30) || 'product'
}

/**
 * Generate SEO-friendly filename
 */
function generateSEOFilename(originalName, index) {
  const ext = path.extname(originalName).toLowerCase()
  const nameWithoutExt = path.basename(originalName, ext)

  // Clean the name
  let cleaned = nameWithoutExt
    .replace(/[\u4e00-\u9fff]/g, '') // Remove Chinese chars
    .replace(/[^a-z0-9-_]/gi, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 40)

  if (!cleaned || cleaned.length < 2) {
    cleaned = `image-${index + 1}`
  }

  return `${cleaned}${ext}`
}

/**
 * Score an image for selection priority
 * Higher score = better candidate
 */
function scoreImage(filePath, fileName) {
  let score = 100

  const lowerPath = filePath.toLowerCase()
  const lowerName = fileName.toLowerCase()

  // PENALTY: Chinese characters in path/filename (likely has Chinese text in image)
  if (hasChinese(filePath)) {
    score -= 40
  }

  // BONUS: English version indicators
  if (lowerPath.includes('英文') || lowerPath.includes('english')) {
    score += 30
  }

  // BONUS: No-text indicators
  if (lowerPath.includes('无字') || lowerName.includes('no-text')) {
    score += 25
  }

  // BONUS: Clean simple filenames (often product shots)
  if (/^[0-9]+\.(jpg|png|webp)$/i.test(fileName)) {
    score += 15
  }

  // BONUS: Product detail shots (xqy prefix often used)
  if (/^xqy_[0-9]+/i.test(fileName)) {
    score += 10
  }

  // PENALTY: Copy/duplicate indicators
  if (lowerName.includes('副本') || lowerName.includes('copy')) {
    score -= 20
  }

  // PENALTY: Promotional overlays likely
  if (lowerName.includes('promo') || lowerName.includes('banner') || lowerName.includes('poster')) {
    score -= 15
  }

  // BONUS: PNG often has clean background
  if (fileName.toLowerCase().endsWith('.png')) {
    score += 5
  }

  // BONUS: High resolution indicator (800x800, etc.)
  if (/[0-9]+x[0-9]+/.test(lowerPath)) {
    score += 5
  }

  return Math.max(0, score)
}

/**
 * Find all leaf folders (folders containing images directly)
 */
function findLeafFolders(dir, basePath = '') {
  const leafFolders = []

  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true })

    const files = entries.filter(e => e.isFile() && !e.name.startsWith('.'))
    const subdirs = entries.filter(e => e.isDirectory() && !e.name.startsWith('.'))

    // Check if this folder has images
    const images = files.filter(f =>
      IMAGE_EXTENSIONS.includes(path.extname(f.name).toLowerCase())
    )

    // If this folder has images, it's a leaf (or we treat it as a category)
    if (images.length > 0) {
      leafFolders.push({
        path: dir,
        relativePath: basePath,
        imageCount: images.length,
        images: images.map(f => ({
          name: f.name,
          fullPath: path.join(dir, f.name)
        }))
      })
    }

    // Recursively scan subdirectories
    for (const subdir of subdirs) {
      const subPath = path.join(dir, subdir.name)
      const subRelativePath = basePath ? `${basePath}/${subdir.name}` : subdir.name
      leafFolders.push(...findLeafFolders(subPath, subRelativePath))
    }
  } catch (err) {
    console.error(`Error scanning ${dir}:`, err.message)
  }

  return leafFolders
}

/**
 * Select best images from a folder
 */
function selectBestImages(folder, maxCount) {
  const scored = folder.images.map(img => ({
    ...img,
    score: scoreImage(img.fullPath, img.name)
  }))

  // Sort by score descending
  scored.sort((a, b) => b.score - a.score)

  // Return top N
  return scored.slice(0, maxCount)
}

/**
 * Convert folder path to category structure
 */
function parseCategoryPath(relativePath) {
  const parts = relativePath.split('/').filter(Boolean)

  // Main category is the first folder
  const mainCategory = parts[0] || 'uncategorized'

  // Map main categories to slugs
  const mainCategoryMap = {
    'baby feeding bottle 奶瓶': 'feeding-bottles',
    'baby sippy cup  water bottle 水杯': 'water-cups',
    'baby tableware  宝宝餐具': 'baby-tableware',
    'bathtub  &potty 浴盆和座便器': 'bath-potty',
    '其他： 奶粉盒 奶瓶刷 牙胶': 'accessories'
  }

  const mainSlug = mainCategoryMap[mainCategory] || generateSlug(mainCategory)

  // Subcategory is the last folder (leaf)
  const leafFolder = parts[parts.length - 1] || mainCategory
  const leafSlug = generateSlug(leafFolder)

  // Human-readable label from leaf folder
  const label = leafFolder
    .replace(/[\u4e00-\u9fff]/g, '')
    .replace(/[^a-zA-Z0-9\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim() || leafSlug

  return {
    mainCategory: mainSlug,
    subcategory: leafSlug,
    label: label,
    fullSlug: `${mainSlug}/${leafSlug}`,
    originalPath: relativePath
  }
}

/**
 * Main migration function
 */
function migrateImages() {
  console.log('🔍 Scanning photo directory for leaf folders...\n')

  // Find all leaf folders
  const leafFolders = findLeafFolders(PHOTO_DIR)

  console.log(`📁 Found ${leafFolders.length} folders with images\n`)

  // Track statistics
  const stats = {
    totalFolders: leafFolders.length,
    totalImages: 0,
    selectedImages: 0,
    categories: new Map()
  }

  // Process each leaf folder
  for (const folder of leafFolders) {
    const category = parseCategoryPath(folder.relativePath)

    // Determine selection count (5 if >10, 3 if ≤10)
    const selectCount = folder.imageCount > 10 ? 5 : Math.min(3, folder.imageCount)

    // Select best images
    const selected = selectBestImages(folder, selectCount)

    // Create destination directory
    const destDir = path.join(DEST_DIR, category.fullSlug)
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true })
    }

    // Copy selected images
    for (let i = 0; i < selected.length; i++) {
      const img = selected[i]
      const newFilename = generateSEOFilename(img.name, i)
      const destPath = path.join(destDir, newFilename)

      try {
        fs.copyFileSync(img.fullPath, destPath)
        stats.selectedImages++
      } catch (err) {
        console.error(`  ❌ Failed to copy ${img.name}: ${err.message}`)
      }
    }

    stats.totalImages += folder.imageCount

    // Track category stats
    if (!stats.categories.has(category.mainCategory)) {
      stats.categories.set(category.mainCategory, {
        folders: 0,
        images: 0
      })
    }
    const catStats = stats.categories.get(category.mainCategory)
    catStats.folders++
    catStats.images += selected.length

    // Log progress
    const avgScore = selected.length > 0
      ? Math.round(selected.reduce((sum, img) => sum + img.score, 0) / selected.length)
      : 0

    console.log(`✅ ${category.mainCategory}/${category.label}`)
    console.log(`   ${folder.imageCount} found → ${selected.length} selected (avg score: ${avgScore})`)
  }

  // Print summary
  console.log('\n' + '='.repeat(60))
  console.log('MIGRATION SUMMARY')
  console.log('='.repeat(60))
  console.log(`\nTotal folders processed: ${stats.totalFolders}`)
  console.log(`Total images found: ${stats.totalImages}`)
  console.log(`Images migrated: ${stats.selectedImages}`)

  console.log('\nBy Main Category:')
  for (const [cat, data] of stats.categories) {
    console.log(`  ${cat}: ${data.folders} subcategories, ${data.images} images`)
  }

  return stats
}

// Run migration
migrateImages()