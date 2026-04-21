/**
 * Parse products.xlsx and generate:
 * 1. Extracted product images to public/images/product-data/
 * 2. data/products.json with product info + image paths (split by 6 categories)
 *
 * Categories:
 * - baby-feeding-bottles: Feeding Bottle variants
 * - baby-sippy-cups: Sippy Cup variants
 * - baby-tableware: Tableware, Spoons, Feeding Bowl Sets
 * - baby-bath-potty: Potty & Bath Tub
 * - baby-milk-powder-container: Milk Powder Box
 * - other-accessory: Teethers, Pacifiers, Brush, Breast Pump, etc.
 */
import XLSX from 'xlsx'
import JSZip from 'jszip'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const XLSX_PATH = path.join(ROOT, 'products.xlsx')
const IMG_OUTPUT = path.join(ROOT, 'public', 'images', 'product-data')
const JSON_OUTPUT = path.join(ROOT, 'app', 'data', 'products.json')
// No limit - process ALL products

async function main() {
  // Ensure output dirs
  fs.mkdirSync(IMG_OUTPUT, { recursive: true })
  fs.mkdirSync(path.dirname(JSON_OUTPUT), { recursive: true })

  // 1. Parse Excel data
  const wb = XLSX.readFile(XLSX_PATH)
  const ws = wb.Sheets[wb.SheetNames[0]]
  const rows = XLSX.utils.sheet_to_json(ws, { header: 1 })

  // Debug: Show first 15 rows to understand structure
  console.log('\n--- Excel Structure (First 15 rows) ---')
  for (let i = 0; i < 15; i++) {
    const row = rows[i] || []
    const preview = row.slice(0, 5).map(v => v == null ? '[null]' : String(v).substring(0, 30)).join(' | ')
    console.log(`Row ${i}: ${preview}`)
  }

  // 2. Parse drawing XML for image-to-cell mapping
  const zipData = fs.readFileSync(XLSX_PATH)
  const zip = await JSZip.loadAsync(zipData)

  const drawingXml = await zip.file('xl/drawings/drawing1.xml').async('string')
  const drawingRelsXml = await zip.file('xl/drawings/_rels/drawing1.xml.rels').async('string')

  // Debug: Show actual row indices from drawing XML (first 5 anchors)
  const sampleAnchors = [...drawingXml.matchAll(/<xdr:twoCellAnchor>([\s\S]*?)<\/xdr:twoCellAnchor>/g)].slice(0, 5)
  console.log('\n--- Drawing XML Sample (first 5 anchors) ---')
  for (const anchor of sampleAnchors) {
    const content = anchor[1]
    const colMatch = content.match(/<xdr:from>[\s\S]*?<xdr:col>(\d+)<\/xdr:col>/)
    const rowMatch = content.match(/<xdr:from>[\s\S]*?<xdr:row>(\d+)<\/xdr:row>/)
    console.log(`  row=${rowMatch ? rowMatch[1] : 'N/A'}, col=${colMatch ? colMatch[1] : 'N/A'}`)
  }

  // Build rId -> image file map (from cellimages.xml.rels)
  const cellimagesRelsXml = await zip.file('xl/_rels/cellimages.xml.rels').async('string')
  const cellRelsMap = {}
  const cellRelsMatches = cellimagesRelsXml.matchAll(/Id="(rId\d+)"[^>]*Target="[^"]*\/([^"]+)"/g)
  for (const m of cellRelsMatches) {
    cellRelsMap[m[1]] = m[2]
  }

  // Build ID -> image file map from cellimages.xml
  // Each etc:cellImage contains:
  // - xdr:cNvPr name="ID_XXXXX" (the DISPIMG ID)
  // - r:embed="rIdY" (reference to actual file)
  const cellimagesXml = await zip.file('xl/cellimages.xml').async('string')
  const idToFileMap = {}
  const cellImageMatches = cellimagesXml.matchAll(/xdr:cNvPr[^>]*name="(ID_[^"]+)"[^>]*>[\s\S]*?r:embed="(rId\d+)"/g)
  for (const m of cellImageMatches) {
    const imgId = m[1]
    const rId = m[2]
    const imgFile = cellRelsMap[rId]
    if (imgFile) {
      idToFileMap[imgId] = imgFile
    }
  }

  console.log(`\nParsed ${Object.keys(idToFileMap).length} DISPIMG images from cellimages.xml`)

  // Build row -> images map by parsing DISPIMG formulas in the Excel rows
  // DISPIMG formula format: =DISPIMG("ID_XXXXX", scale)
  const rowImages = {} // { rowIndex: [{ col, imageFile, descr }] }
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i] || []
    for (let j = 0; j < row.length; j++) {
      const cell = row[j]
      if (typeof cell === 'string' && cell.includes('DISPIMG')) {
        const match = cell.match(/DISPIMG\("([^"]+)"/)
        if (match) {
          const imgId = match[1]
          const imgFile = idToFileMap[imgId]
          if (imgFile) {
            if (!rowImages[i]) rowImages[i] = []
            // Avoid duplicates
            if (!rowImages[i].some(existing => existing.imageFile === imgFile && existing.col === j)) {
              rowImages[i].push({
                col: j,
                imageFile: imgFile,
                descr: '',
              })
            }
          }
        }
      }
    }
  }

  // Sort each row's images by column
  for (const r of Object.keys(rowImages)) {
    rowImages[r].sort((a, b) => a.col - b.col)
  }

  // Debug: Log which columns have images
  console.log('\n--- Image Column Distribution ---')
  const colCounts = {}
  const rowIndicesWithImages = Object.keys(rowImages).map(Number).sort((a, b) => a - b)
  console.log('Row indices with images (first 20):', rowIndicesWithImages.slice(0, 20).join(', '))
  console.log('Total rows with images:', rowIndicesWithImages.length)

  for (const r of Object.keys(rowImages)) {
    for (const img of rowImages[r]) {
      const col = img.col
      colCounts[col] = (colCounts[col] || 0) + 1
    }
  }
  const sortedCols = Object.entries(colCounts).sort((a, b) => Number(a[0]) - Number(b[0]))
  console.log('Images found in columns:', sortedCols.map(([col, count]) => `Col ${col} (${count} imgs)`).join(', '))

  // Debug: Check which rows in rowImages (first 100 product rows start at row index 9)
  let matchedCount = 0
  for (let i = 9; i < 109; i++) {
    if (rowImages[i]) {
      const filteredImages = rowImages[i].filter(img => [0, 1, 2].includes(img.col))
      if (filteredImages.length > 0) {
        matchedCount++
        console.log(`  Row ${i}: ${filteredImages.length} images in cols ${filteredImages.map(img => img.col).join(',')}`)
      }
    }
  }
  console.log(`\nTotal matched rows (index 9-108) with images: ${matchedCount}`)

  // 3. Extract images from zip
  console.log('Extracting images...')
  const mediaFiles = Object.keys(zip.files).filter(f => f.startsWith('xl/media/'))
  const extMap = {} // image1.jpeg -> image1.jpg (normalized)
  for (const f of mediaFiles) {
    const basename = path.basename(f)
    const ext = path.extname(f).toLowerCase()
    // Normalize extension
    const normalName = ext === '.jpeg' ? basename.replace('.jpeg', '.jpg') : basename
    extMap[basename] = normalName

    const outPath = path.join(IMG_OUTPUT, normalName)
    const zipEntry = zip.file(f)
    if (!zipEntry) continue
    if (!fs.existsSync(outPath)) {
      const buf = await zipEntry.async('nodebuffer')
      fs.writeFileSync(outPath, buf)
    }
  }
  console.log(`Extracted ${mediaFiles.length} images to ${IMG_OUTPUT}`)

  // 4. Build product data
  // New 6-category mapping
  const categoryMapping = {
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
    // '2025 new items' - these are Milk Powder Boxes and Tumbler Cups (will be handled separately)
  }

  // Slug mapping for 6 categories
  const categorySlugs = {
    'Baby Feeding Bottles': 'baby-feeding-bottles',
    'Baby Sippy Cups': 'baby-sippy-cups',
    'Baby Tableware': 'baby-tableware',
    'Baby Bath & Potty': 'baby-bath-potty',
    'Milk Powder Container': 'baby-milk-powder-container',
    'Other Accessories': 'other-accessory',
  }

  let currentSubcategory = ''
  const products = []
  let id = 0

  for (let i = 9; i < rows.length; i++) {
    const row = rows[i]
    const nonNull = row.filter(v => v != null && v !== '').length

    // Detect category header rows
    if (nonNull === 1 && row[0] && typeof row[0] === 'string' && !row[3]) {
      currentSubcategory = row[0].trim()
      continue
    }

    // Product rows have an Item No. (col 3)
    if (!row[3]) continue

    const itemNo = String(row[3]).trim()
    const description = String(row[4] || '').trim()
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

    // Find images for this row - only from columns A, B, C (col 0, 1, 2)
    const images = []
    const imageColumns = [0, 1, 2] // A, B, C
    if (rowImages[i]) {
      // Filter images to only those in columns A, B, C
      const filteredImages = rowImages[i].filter(img => imageColumns.includes(img.col))
      // Sort by column to ensure A -> B -> C order
      filteredImages.sort((a, b) => a.col - b.col)
      for (const img of filteredImages) {
        const normalName = extMap[img.imageFile] || img.imageFile
        images.push(`/images/product-data/${normalName}`)
      }
    }

    // mainImage is the first image (Column A), gallery contains all 3 images (A, B, C)
    const mainImage = images.length > 0 ? images[0] : ''
    const gallery = images.slice(0, 3) // Max 3 images for gallery

    // Determine main category with special handling for "2025 new items"
    let mainCategory = categoryMapping[currentSubcategory] || ''

    // Handle "2025 new items" subcategory - classify based on item number prefix or description
    if (!mainCategory || currentSubcategory === '2025 new items') {
      // Check item number prefix patterns
      if (itemNo.startsWith('XTQ6') && itemNo.includes('635') || description.toLowerCase().includes('milk powder') || description.toLowerCase().includes('powder box')) {
        mainCategory = 'Milk Powder Container'
      } else if (itemNo.includes('620') || description.toLowerCase().includes('tumbler') || description.toLowerCase().includes('cup') || description.toLowerCase().includes('sippy')) {
        mainCategory = 'Baby Sippy Cups'
      } else if (description.toLowerCase().includes('bottle') || itemNo.includes('610') || itemNo.includes('611')) {
        mainCategory = 'Baby Feeding Bottles'
      } else if (description.toLowerCase().includes('spoon') || description.toLowerCase().includes('tableware') || description.toLowerCase().includes('bowl')) {
        mainCategory = 'Baby Tableware'
      } else if (description.toLowerCase().includes('potty') || description.toLowerCase().includes('bath') || description.toLowerCase().includes('tub')) {
        mainCategory = 'Baby Bath & Potty'
      } else {
        mainCategory = 'Other Accessories'
      }
    }

    const categorySlug = categorySlugs[mainCategory] || 'other-accessory'

    // Parse description for a short name
    let name = description
    // Take first line or before first &/* if multi-line
    const nameParts = description.split(/[\n&]/)
    if (nameParts[0]) {
      name = nameParts[0].replace(/\*.*/g, '').trim()
    }
    // Truncate if too long
    if (name.length > 100) name = name.substring(0, 97) + '...'

    // Parse material from description
    let material = ''
    const materialMatch = description.match(/(?:material:?|&\s*)(PP|Tritan|PPSU|Glass|Silicone|TPE|Stainless Steel|PP\+TPE|Silicone\+PP)/i)
    if (materialMatch) material = materialMatch[1]

    // Parse capacity from description
    let capacity = ''
    const capMatch = description.match(/(\d+)\s*ml/i)
    if (capMatch) capacity = capMatch[1] + 'ml'

    products.push({
      id: id++,
      itemNo,
      name,
      description,
      material,
      capacity,
      subcategory: currentSubcategory,
      category: mainCategory,
      categorySlug,
      mainImage, // Primary image from Column A
      gallery, // All images from Columns A, B, C (up to 3)
      images, // Keep for backward compatibility
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

  // 5. Verify image assets and log warnings for missing files
  console.log('\n--- Image Asset Verification ---')
  let missingImages = []
  for (const product of products) {
    for (const imgPath of product.gallery) {
      const fullPath = path.join(ROOT, 'public', imgPath)
      if (!fs.existsSync(fullPath)) {
        missingImages.push({ itemNo: product.itemNo, image: imgPath })
      }
    }
  }
  if (missingImages.length > 0) {
    console.log(`WARNING: ${missingImages.length} images not found:`)
    for (const missing of missingImages.slice(0, 10)) {
      console.log(`  - ${missing.itemNo}: ${missing.image}`)
    }
    if (missingImages.length > 10) {
      console.log(`  ... and ${missingImages.length - 10} more`)
    }
  } else {
    console.log('All referenced images exist ✓')
  }

  // 6. Write JSON
  const output = {
    generatedAt: new Date().toISOString(),
    totalProducts: products.length,
    categories: Object.entries(categorySlugs).map(([name, slug]) => ({
      name,
      slug,
      count: products.filter(p => p.category === name).length,
    })),
    products,
  }

  fs.writeFileSync(JSON_OUTPUT, JSON.stringify(output, null, 2))
  console.log(`Generated ${JSON_OUTPUT}`)
  console.log(`Total products processed: ${products.length}`)
  console.log(`Products with images: ${products.filter(p => p.gallery.length > 0).length}`)
  console.log(`Products with mainImage: ${products.filter(p => p.mainImage).length}`)
  console.log('Categories:', output.categories)
}

main().catch(console.error)
