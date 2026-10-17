import sharp from 'sharp'
import fs from 'fs'
import path from 'path'

const mediaPpt = path.join(process.env.TEMP, 'oya-ref-extract/pptx/ppt/media')
const mediaDoc = path.join(process.env.TEMP, 'oya-ref-extract/docx/word/media')
const outRoot = path.resolve('app/assets/images/home')

const FACTORY = new Set([
  'image1.jpeg', 'image8.jpeg', 'image10.jpeg', 'image11.jpeg',
  'image12.png', 'image13.jpeg', 'image14.jpeg', 'image20.png', 'image72.png',
])
const QUALITY = new Set(['image49.png', 'image51.png'])
const GLOBAL = new Set(['image63.jpeg'])
const SKIP_EXT = new Set(['.svg'])

for (const dir of ['factory', 'quality', 'global', 'process', 'materials', 'ref-misc']) {
  fs.mkdirSync(path.join(outRoot, dir), { recursive: true })
}

function folderFor(name, size) {
  if (FACTORY.has(name)) return 'factory'
  if (QUALITY.has(name)) return 'quality'
  if (GLOBAL.has(name)) return 'global'
  if (size < 2048) return null
  if (size < 20000) return 'ref-misc'
  if (/\.(jpe?g|png)$/i.test(name)) {
    if (size > 80000) return 'process'
    return 'materials'
  }
  return 'ref-misc'
}

async function processFile(srcDir, file, prefix) {
  const ext = path.extname(file).toLowerCase()
  if (SKIP_EXT.has(ext)) return null
  if (!/\.(jpe?g|png|webp|gif)$/i.test(ext)) return null

  const src = path.join(srcDir, file)
  const size = fs.statSync(src).size
  const folder = folderFor(file, size)
  if (!folder) return null

  const base = path.basename(file, ext).replace(/[^a-z0-9_-]/gi, '-').toLowerCase()
  const isCert = folder === 'quality'
  const maxEdge = isCert ? 1200 : 1920
  const quality = isCert ? 78 : 80
  const outName = `oya-${prefix}${base}.webp`
  const outPath = path.join(outRoot, folder, outName)

  const meta = await sharp(src, { failOn: 'none' }).rotate().metadata()
  const w = meta.width || 0
  const h = meta.height || 0

  let pipeline = sharp(src, { failOn: 'none' }).rotate()
  if (Math.max(w, h) > maxEdge) {
    pipeline = pipeline.resize({
      width: w >= h ? maxEdge : undefined,
      height: h > w ? maxEdge : undefined,
      fit: 'inside',
      withoutEnlargement: true,
    })
  }

  await pipeline.webp({ quality, effort: 4 }).toFile(outPath)

  let finalSize = fs.statSync(outPath).size
  if (finalSize > 500 * 1024 && !isCert) {
    const tmp = `${outPath}.tmp`
    await sharp(outPath).webp({ quality: 68, effort: 5 }).toFile(tmp)
    fs.renameSync(tmp, outPath)
    finalSize = fs.statSync(outPath).size
  }

  return {
    source: file,
    folder,
    output: `~/assets/images/home/${folder}/${outName}`,
    relative: `home/${folder}/${outName}`,
    bytes: finalSize,
    module: folder,
  }
}

const manifest = []

for (const file of fs.readdirSync(mediaPpt)) {
  const row = await processFile(mediaPpt, file, 'ppt-')
  if (row) manifest.push(row)
}

if (fs.existsSync(mediaDoc)) {
  for (const file of fs.readdirSync(mediaDoc)) {
    const row = await processFile(mediaDoc, file, 'doc-')
    if (row) manifest.push(row)
  }
}

const manifestPath = path.join(outRoot, 'image-manifest.json')
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2))

const byFolder = {}
for (const m of manifest)
  byFolder[m.folder] = (byFolder[m.folder] || 0) + 1

console.log('processed', manifest.length, byFolder)
console.log('manifest', manifestPath)
