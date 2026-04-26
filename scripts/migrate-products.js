/**
 * Product Migration Script
 *
 * Reads products.xlsx, extracts embedded images to:
 *   public/images/products/{categorySlug}/{subcategory}/
 * and generates:
 *   app/data/products.json
 *
 * Categories:
 *   - baby-feeding-bottles   (Feeding Bottle variants)
 *   - baby-sippy-cups        (Sippy Cup variants)
 *   - baby-tableware         (Tableware, Spoons, Feeding Bowl Sets)
 *   - baby-bath-potty        (Potty & Bath Tub)
 *   - baby-milk-powder-container (Milk Powder Box)
 *   - other-accessory        (Teethers, Pacifiers, Brush, etc.)
 */

import XLSX from 'xlsx'
import JSZip from 'jszip'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const XLSX_PATH = path.join(ROOT, 'products.xlsx')
const IMG_DEST_BASE = path.join(ROOT, 'public', 'images', 'products')
const JSON_OUTPUT = path.join(ROOT, 'app', 'data', 'products.json')

// ─── Category Mapping ────────────────────────────────────────────────────────

const CATEGORY_MAP = {
  // baby-feeding-bottles
  'Feeding Bottle- PP': 'Baby Feeding Bottles',
  'Feeding Bottle- Glass': 'Baby Feeding Bottles',
  'Feeding Bottle- PPSU': 'Baby Feeding Bottles',
  'Feeding Bottle- Tritan': 'Baby Feeding Bottles',
  'Feeding Bottle- Others': 'Baby Feeding Bottles',
  'Feeding bottle set': 'Baby Feeding Bottles',
  // baby-sippy-cups
  'Sippy Cup- Tritan': 'Baby Sippy Cups',
  'Sippy Cup- PP': 'Baby Sippy Cups',
  'Sippy Cup- Others': 'Baby Sippy Cups',
  // baby-tableware
  'Tableware set': 'Baby Tableware',
  'Spoons': 'Baby Tableware',
  'Feeding Bowl Sets': 'Baby Tableware',
  // baby-bath-potty
  'Potty & Bath Tub': 'Baby Bath & Potty',
  // baby-milk-powder-container
  'Milk Powder Box': 'Milk Powder Container',
  // other-accessory
  'Teethers': 'Other Accessories',
  'Pacifiers': 'Other Accessories',
  'Brush': 'Other Accessories',
  'Breast Pump': 'Other Accessories',
  'Auxilaries- Others': 'Other Accessories',
}

const CATEGORY_SLUGS = {
  'Baby Feeding Bottles': 'baby-feeding-bottles',
  'Baby Sippy Cups': 'baby-sippy-cups',
  'Baby Tableware': 'baby-tableware',
  'Baby Bath & Potty': 'baby-bath-potty',
  'Milk Powder Container': 'baby-milk-powder-container',
  'Other Accessories': 'other-accessory',
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[\u4e00-\u9fff]/g, '') // remove Chinese
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 40) || 'general'
}

function generateImageName(itemNo, index) {
  // Normalize: strip spaces, make safe filename
  const safe = itemNo.replace(/[^a-zA-Z0-9]/g, '-').substring(0, 20)
  return `${safe}-${index + 1}`
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n🚀 Product Migration Script\n')
  console.log('=' .repeat(60))

  // 1. Parse Excel
  console.log('\n📊 Step 1: Reading products.xlsx...')
  const wb = XLSX.readFile(XLSX_PATH)
  const ws = wb.Sheets[wb.SheetNames[0]]
  const rows = XLSX.utils.sheet_to_json(ws, { header: 1 })
  console.log(`   Total rows in Excel: ${rows.length}`)

  // 2. Parse embedded image mapping from the Excel ZIP
  console.log('\n🖼️  Step 2: Parsing embedded images from Excel ZIP...')
  const zipData = fs.readFileSync(XLSX_PATH)
  const zip = await JSZip.loadAsync(zipData)

  // Extract all media files from xl/media/
  const mediaFiles = zip.file(/^xl\/media\//)
  console.log(`   Found ${mediaFiles.length} embedded media files`)

  // Build basename → normalized name map
  const extMap = {} // original basename → normalized name
  for (const file of mediaFiles) {
    const basename = path.basename(file.name)
    const ext = path.extname(basename).toLowerCase()
    const normalName = ext === '.jpeg' ? basename.replace('.jpeg', '.jpg') : basename
    extMap[basename] = normalName
  }

  // Parse cellimages.xml → DISPIMG ID → actual file
  const cellimagesRelsXml = await zip.file('xl/_rels/cellimages.xml.rels').async('string')
  const cellRelsMap = {}
  for (const m of cellimagesRelsXml.matchAll(/Id="(rId\d+)"[^>]*Target="[^"]*\/([^"]+)"/g)) {
    cellRelsMap[m[1]] = m[2]
  }

  const cellimagesXml = await zip.file('xl/cellimages.xml').async('string')
  const idToFileMap = {}
  for (const m of cellimagesXml.matchAll(/xdr:cNvPr[^>]*name="(ID_[^"]+)"[^>]*>[\s\S]*?r:embed="(rId\d+)"/g)) {
    const imgFile = cellRelsMap[m[2]]
    if (imgFile) idToFileMap[m[1]] = imgFile
  }
  console.log(`   Parsed ${Object.keys(idToFileMap).length} DISPIMG image references`)

  // Build row → images map
  const rowImages = {} // { rowIndex: [{ col, imageFile }] }
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i] || []
    for (let j = 0; j < row.length; j++) {
      const cell = row[j]
      if (typeof cell === 'string' && cell.includes('DISPIMG')) {
        const match = cell.match(/DISPIMG\("([^"]+)"/)
        if (match) {
          const imgFile = idToFileMap[match[1]]
          if (imgFile) {
            if (!rowImages[i]) rowImages[i] = []
            if (!rowImages[i].some(e => e.imageFile === imgFile && e.col === j)) {
              rowImages[i].push({ col: j, imageFile: imgFile })
            }
          }
        }
      }
    }
  }
  // Sort each row's images by column (A=0, B=1, C=2)
  for (const r of Object.keys(rowImages)) {
    rowImages[r].sort((a, b) => a.col - b.col)
  }

  const rowsWithImages = Object.keys(rowImages).length
  console.log(`   Rows with images: ${rowsWithImages}`)

  // 3. Clear existing destination folders
  console.log('\n🧹 Step 3: Clearing existing images in public/images/products/...')
  for (const slug of Object.values(CATEGORY_SLUGS)) {
    const dir = path.join(IMG_DEST_BASE, slug)
    if (fs.existsSync(dir)) {
      fs.rmSync(dir, { recursive: true, force: true })
    }
    fs.mkdirSync(dir, { recursive: true })
  }
  console.log('   Cleared and re-created all 6 category folders')

  // 4. Build product data and copy images
  console.log('\n📦 Step 4: Building product data and copying images...')

  let currentSubcategory = ''
  const products = []
  let id = 0

  // Track copy counts per category
  const copyStats = {}
  for (const slug of Object.values(CATEGORY_SLUGS)) {
    copyStats[slug] = { files: 0, rows: 0 }
  }

  for (let i = 9; i < rows.length; i++) {
    const row = rows[i]
    if (!row) continue

    const nonNull = row.filter(v => v != null && v !== '').length

    // Detect category header rows (single non-null cell)
    if (nonNull === 1 && row[0] && typeof row[0] === 'string' && !row[3]) {
      currentSubcategory = String(row[0]).trim()
      continue
    }

    // Product rows have Item No. in column D (index 3)
    if (!row[3]) continue

    const itemNo = String(row[3]).trim()
    const description = String(row[4] || '').trim()

    // Parse spec columns
    const pcsPerCtn = row[5]
    const nw = row[6]
    const gw = row[7]
    const ctnSize = row[8]
    const length = row[9]
    const width = row[10]
    const height = row[11]
    const pcs20gp = row[12]
    const pcs40hq = row[13]
    const moq = row[14]
    const hsCode = row[15]
    const remark = row[18]

    // Determine category
    let mainCategory = CATEGORY_MAP[currentSubcategory] || ''

    if (!mainCategory || currentSubcategory === '2025 new items') {
      if (
        itemNo.startsWith('XTQ6') && itemNo.includes('635')
        || /milk powder|powder box/i.test(description)
      ) {
        mainCategory = 'Milk Powder Container'
      }
      else if (
        itemNo.includes('620')
        || /tumbler|cup|sippy/i.test(description)
      ) {
        mainCategory = 'Baby Sippy Cups'
      }
      else if (
        /bottle/i.test(description)
        || itemNo.includes('610') || itemNo.includes('611')
      ) {
        mainCategory = 'Baby Feeding Bottles'
      }
      else if (
        /spoon|tableware|bowl/i.test(description)
      ) {
        mainCategory = 'Baby Tableware'
      }
      else if (
        /potty|bath|tub/i.test(description)
      ) {
        mainCategory = 'Baby Bath & Potty'
      }
      else {
        mainCategory = 'Other Accessories'
      }
    }

    const categorySlug = CATEGORY_SLUGS[mainCategory] || 'other-accessory'

    // Subcategory folder: slugify the subcategory name, fallback to material or 'general'
    let subFolder = slugify(currentSubcategory)
    if (!subFolder || subFolder === 'general') {
      // Try to extract material from description
      const matMatch = description.match(/\b(PP|PPSU|Tritan|Glass|Silicone)\b/i)
      subFolder = matMatch ? matMatch[1].toLowerCase() : 'general'
    }

    const destDir = path.join(IMG_DEST_BASE, categorySlug, subFolder)
    fs.mkdirSync(destDir, { recursive: true })

    // Get images for this row from cols A, B, C (indices 0, 1, 2)
    const imageColumns = [0, 1, 2]
    const images = []
    if (rowImages[i]) {
      const filtered = rowImages[i].filter(img => imageColumns.includes(img.col))
      for (const img of filtered) {
        const normalName = extMap[img.imageFile] || img.imageFile
        const ext = path.extname(normalName).toLowerCase()
        const newName = `${generateImageName(itemNo, images.length)}${ext}`
        const destPath = path.join(destDir, newName)

        // Extract from zip and copy
        const zipEntry = zip.file(`xl/media/${img.imageFile}`)
          || zip.file(`xl/media/${normalName}`)
        if (zipEntry) {
          const buf = await zipEntry.async('nodebuffer')
          fs.writeFileSync(destPath, buf)
          copyStats[categorySlug].files++
        }
        else {
          // Try to find the file with different casing
          const found = mediaFiles.find(f =>
            f.name.toLowerCase().endsWith(normalName.toLowerCase())
          )
          if (found) {
            const buf = await found.async('nodebuffer')
            fs.writeFileSync(destPath, buf)
            copyStats[categorySlug].files++
          }
        }

        // Path relative to public root → /images/products/...
        const imagePath = `/images/products/${categorySlug}/${subFolder}/${newName}`
        images.push(imagePath)
      }
    }

    // Parse name from description
    let name = description
    const nameParts = description.split(/[\n&]/)
    if (nameParts[0]) {
      name = nameParts[0].replace(/\*.*/g, '').trim()
    }
    if (name.length > 100) name = name.substring(0, 97) + '...'

    // Parse material
    let material = ''
    const materialMatch = description.match(
      /\b(PP|Tritan|PPSU|Glass|Silicone|TPE|Stainless Steel|PP\+TPE|Silicone\+PP)\b/i
    )
    if (materialMatch) material = materialMatch[1]

    // Parse capacity
    let capacity = ''
    const capMatch = description.match(/(\d+)\s*ml/i)
    if (capMatch) capacity = capMatch[1] + 'ml'

    const mainImage = images.length > 0 ? images[0] : ''
    const gallery = images.slice(0, 3)

    copyStats[categorySlug].rows++

    products.push({
      id: id++,
      itemNo,
      name,
      description,
      material,
      capacity,
      subcategory: currentSubcategory,
      subFolder,
      category: mainCategory,
      categorySlug,
      mainImage,
      gallery,
      images,
      specs: {
        pcsPerCtn: pcsPerCtn ? Number(pcsPerCtn) : null,
        nw: nw ? Number(nw) : null,
        gw: gw ? Number(gw) : null,
        ctnSize: ctnSize || null,
        length: length ? Number(length) : null,
        width: width ? Number(width) : null,
        height: height ? Number(height) : null,
        pcs20gp: pcs20gp ? Math.round(Number(pcs20gp)) : null,
        pcs40hq: pcs40hq ? Math.round(Number(pcs40hq)) : null,
        moq: moq ? Number(moq) : null,
        hsCode: hsCode ? String(hsCode) : null,
        remark: remark ? String(remark) : null,
      },
    })
  }

  // 5. Write products.json
  console.log('\n💾 Step 5: Writing products.json...')
  const output = {
    generatedAt: new Date().toISOString(),
    totalProducts: products.length,
    categories: Object.entries(CATEGORY_SLUGS).map(([name, slug]) => ({
      name,
      slug,
      count: products.filter(p => p.category === name).length,
    })),
    products,
  }

  fs.writeFileSync(JSON_OUTPUT, JSON.stringify(output, null, 2))
  console.log(`   Written to: ${JSON_OUTPUT}`)

  // 6. Summary
  console.log('\n' + '=' .repeat(60))
  console.log('✅ MIGRATION COMPLETE\n')
  console.log(`   Total products: ${products.length}`)
  console.log(`   Products with images: ${products.filter(p => p.gallery.length > 0).length}`)

  console.log('\n   Images copied by category:')
  for (const [slug, stat] of Object.entries(copyStats)) {
    const productCount = products.filter(p => p.categorySlug === slug).length
    console.log(`   ${slug}: ${stat.files} images, ${productCount} products`)
  }

  console.log('\n   Categories summary:')
  for (const cat of output.categories) {
    console.log(`   ${cat.slug} (${cat.name}): ${cat.count} products`)
  }

  console.log('\n   Image output: public/images/products/')
  for (const slug of Object.values(CATEGORY_SLUGS)) {
    const dir = path.join(IMG_DEST_BASE, slug)
    const subdirs = fs.readdirSync(dir).filter(f => fs.statSync(path.join(dir, f)).isDirectory())
    const files = fs.readdirSync(dir).filter(f => fs.statSync(path.join(dir, f)).isFile()).length
    console.log(`   ${slug}/ (${subdirs.length} subdirs, ${files} files at root)`)
  }

  console.log('\n' + '=' .repeat(60))
}

main().catch(console.error)
