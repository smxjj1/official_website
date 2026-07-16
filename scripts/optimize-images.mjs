/**
 * 将 public/images 与 app/assets/images 下的 PNG/JPEG 转为 WebP（保留原图作 fallback）。
 * 运行：npm run optimize:images
 */
import { readdir, stat } from 'node:fs/promises'
import { join, extname } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const projectRoot = join(fileURLToPath(new URL('.', import.meta.url)), '..')
const roots = [
  join(projectRoot, 'public', 'images'),
  join(projectRoot, 'app', 'assets', 'images'),
]
const IMAGE_EXT = new Set(['.png', '.jpg', '.jpeg'])

function maxWidthFor(filePath) {
  const normalized = filePath.replace(/\\/g, '/')
  // 首页 Hero / 轮播全屏展示，需接近原图宽度，避免大屏拉伸发糊
  if (normalized.includes('/hero/') || normalized.includes('BenefitsCarousel'))
    return 1920
  if (normalized.includes('/logo') || normalized.includes('default-logo'))
    return 512
  if (normalized.includes('/company/'))
    return 1600
  if (normalized.includes('/categories/'))
    return 640
  if (normalized.includes('/products/'))
    return 1200
  return 1200
}

async function walk(dir) {
  let entries
  try {
    entries = await readdir(dir, { withFileTypes: true })
  }
  catch {
    return
  }

  for (const entry of entries) {
    const fullPath = join(dir, entry.name)
    if (entry.isDirectory()) {
      await walk(fullPath)
      continue
    }
    const ext = extname(entry.name).toLowerCase()
    if (!IMAGE_EXT.has(ext))
      continue

    const outPath = fullPath.replace(/\.(png|jpe?g)$/i, '.webp')
    const meta = await sharp(fullPath).metadata()
    const width = maxWidthFor(fullPath)

    const width = maxWidthFor(fullPath)
    const isHero = fullPath.replace(/\\/g, '/').includes('/hero/')
      || fullPath.replace(/\\/g, '/').includes('BenefitsCarousel')

    await sharp(fullPath)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: isHero ? 82 : 75, effort: 4 })
      .toFile(outPath)

    const originalSize = (await stat(fullPath)).size
    const webpSize = (await stat(outPath)).size

    console.log(
      `${entry.name} (${Math.round(originalSize / 1024)}KB, ${meta.width}x${meta.height}) → ${Math.round(webpSize / 1024)}KB webp`,
    )
  }
}

for (const root of roots)
  await walk(root)

console.log('Done.')
