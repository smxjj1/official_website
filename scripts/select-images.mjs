/**
 * Image Selection and Migration Script
 *
 * Selects best images from photo/ folder based on:
 * 1. Quantity: 5 images if >10 available, 3 if ≤10
 * 2. Quality: Prefer square/near-square aspect ratio
 * 3. Language: Prefer English versions, avoid Chinese text
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Configuration
const PHOTO_DIR = path.join(__dirname, '../photo')
const DEST_DIR = path.join(__dirname, '../app/assets/images/products')

// Category mapping (source folder -> destination folder)
const categoryMapping = {
  'baby feeding bottle 奶瓶': 'feeding-bottles',
  'baby sippy cup  water bottle 水杯': 'water-cups',
  'baby tableware  宝宝餐具': 'baby-tableware',
  'bathtub  &potty 浴盆和座便器': 'bath-potty',
  '其他： 奶粉盒 奶瓶刷 牙胶': 'accessories'
}

// Image extensions to process
const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif']

/**
 * Recursively find all images in a directory
 */
function findAllImages(dir) {
  const images = []

  function scan(currentDir) {
    try {
      const entries = fs.readdirSync(currentDir, { withFileTypes: true })

      for (const entry of entries) {
        const fullPath = path.join(currentDir, entry.name)

        // Skip hidden files
        if (entry.name.startsWith('.')) continue

        if (entry.isDirectory()) {
          scan(fullPath)
        } else if (entry.isFile()) {
          const ext = path.extname(entry.name).toLowerCase()
          if (imageExtensions.includes(ext)) {
            images.push(fullPath)
          }
        }
      }
    } catch (err) {
      console.error(`Error scanning ${currentDir}:`, err.message)
    }
  }

  scan(dir)
  return images
}

/**
 * Score an image based on selection criteria
 * Higher score = better candidate
 */
function scoreImage(imagePath, sourceFolder) {
  let score = 100
  const filename = path.basename(imagePath).toLowerCase()
  const parentDir = path.dirname(imagePath).toLowerCase()
  const fullPath = imagePath.toLowerCase()

  // PENALTY: Chinese characters in path/filename (strong indicator of Chinese text in image)
  const chinesePattern = /[\u4e00-\u9fff]/
  if (chinesePattern.test(imagePath)) {
    score -= 50
  }

  // BONUS: "英文" (English) in folder name - likely English version
  if (fullPath.includes('英文') || fullPath.includes('english')) {
    score += 30
  }

  // BONUS: Common clean product shot patterns
  if (/^[0-9]+\.(jpg|png|webp)$/i.test(filename)) {
    score += 10 // Simple numeric names like "1.jpg", "2.jpg" are often clean shots
  }

  // PENALTY: Files with descriptive suffixes that suggest overlays
  if (filename.includes('副本') || filename.includes('copy')) {
    score -= 20
  }

  // BONUS: xqy_ prefix often indicates detail shots
  if (filename.startsWith('xqy_')) {
    score += 5
  }

  // PENALTY: Very long filenames might have promotional text
  if (filename.length > 30) {
    score -= 10
  }

  // BONUS: PNG files often have clean backgrounds
  if (filename.endsWith('.png')) {
    score += 5
  }

  // PENALTY: Likely promotional/composite images
  if (filename.includes('promo') || filename.includes('banner') || filename.includes('poster')) {
    score -= 15
  }

  return Math.max(0, score)
}

/**
 * Get aspect ratio score from image (using sharp if available, otherwise skip)
 */
function getAspectRatioScore(imagePath) {
  // We'll skip aspect ratio scoring since it requires additional dependencies
  // In production, you could use 'sharp' package here
  return 0
}

/**
 * Select best images from a category
 */
function selectBestImages(images, category, maxCount = 5) {
  // Score all images
  const scoredImages = images.map(img => ({
    path: img,
    score: scoreImage(img, category),
    filename: path.basename(img)
  }))

  // Sort by score descending
  scoredImages.sort((a, b) => b.score - a.score)

  // Select top N
  return scoredImages.slice(0, maxCount)
}

/**
 * Generate SEO-friendly filename
 */
function generateSEOFilename(originalPath, categorySlug, index) {
  const ext = path.extname(originalPath).toLowerCase()

  // Try to extract meaningful product code from path
  const parentDir = path.basename(path.dirname(originalPath))

  // Check if parent dir has product code
  const productCodeMatch = parentDir.match(/[A-Z]{2,4}-?[0-9]{3,5}/i)
  const productCode = productCodeMatch ? productCodeMatch[0].toUpperCase() : null

  if (productCode) {
    return `${categorySlug}-${productCode}-${index + 1}${ext}`
  }

  // Fallback to category-index format
  return `${categorySlug}-${index + 1}${ext}`
}

/**
 * Main migration function
 */
function migrateImages() {
  const report = []

  // Ensure destination directories exist
  for (const destCategory of Object.values(categoryMapping)) {
    const destPath = path.join(DEST_DIR, destCategory)
    if (!fs.existsSync(destPath)) {
      fs.mkdirSync(destPath, { recursive: true })
    }
  }

  // Process each category
  for (const [sourceFolder, destCategory] of Object.entries(categoryMapping)) {
    const sourcePath = path.join(PHOTO_DIR, sourceFolder)

    if (!fs.existsSync(sourcePath)) {
      console.log(`⚠️  Source folder not found: ${sourceFolder}`)
      continue
    }

    console.log(`\n📂 Processing: ${sourceFolder}`)

    // Find all images
    const allImages = findAllImages(sourcePath)
    console.log(`   Found ${allImages.length} images`)

    // Determine selection count (5 if >10, 3 if ≤10)
    const selectCount = allImages.length > 10 ? 5 : Math.min(3, allImages.length)

    // Select best images
    const selectedImages = selectBestImages(allImages, sourceFolder, selectCount)

    console.log(`   Selected ${selectedImages.length} images:`)

    // Copy selected images to destination
    const destPath = path.join(DEST_DIR, destCategory)

    selectedImages.forEach((img, index) => {
      const newFilename = generateSEOFilename(img.path, destCategory, index)
      const destFile = path.join(destPath, newFilename)

      try {
        fs.copyFileSync(img.path, destFile)
        console.log(`   ✅ ${img.filename} (score: ${img.score}) → ${newFilename}`)
      } catch (err) {
        console.error(`   ❌ Failed to copy ${img.filename}: ${err.message}`)
      }
    })

    // Add to report
    report.push({
      category: destCategory,
      totalFound: allImages.length,
      selectedCount: selectedImages.length,
      selectedImages: selectedImages.map(img => ({
        original: img.filename,
        score: img.score,
        reason: img.score >= 80 ? 'High quality, likely no Chinese text' :
                img.score >= 50 ? 'Medium quality, may have Chinese text' :
                'Low score, Chinese text likely present - MANUAL REVIEW NEEDED'
      })),
      destinationPath: destPath
    })
  }

  // Print report
  console.log('\n' + '='.repeat(80))
  console.log('MIGRATION REPORT')
  console.log('='.repeat(80))

  console.log('\n| Category | Total Found | Selected | Reason | Destination |')
  console.log('|----------|-------------|----------|--------|-------------|')

  for (const row of report) {
    const avgReason = row.selectedImages[0]?.reason || 'N/A'
    console.log(`| ${row.category} | ${row.totalFound} | ${row.selectedCount} | ${avgReason.substring(0, 30)}... | assets/images/products/${row.category} |`)
  }

  console.log('\n⚠️  MANUAL REVIEW RECOMMENDED:')
  for (const row of report) {
    const needsReview = row.selectedImages.filter(img => img.score < 80)
    if (needsReview.length > 0) {
      console.log(`\n  ${row.category}:`)
      needsReview.forEach(img => {
        console.log(`    - ${img.original} (score: ${img.score})`)
      })
    }
  }

  return report
}

// Run migration
migrateImages()