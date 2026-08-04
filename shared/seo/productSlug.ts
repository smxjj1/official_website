/**
 * 产品详情 URL：/{categorySlug}/{itemNo}-{name-slug}
 * 解析以 itemNo 为准，名称变更后仍可命中并 301 到规范 URL。
 */

export type ProductSlugSource = {
  itemNo?: string | null
  name?: string | null
  categorySlug?: string | null
}

export function slugifyProductName(name: string): string {
  return name
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-')
    .slice(0, 80)
}

export function normalizeItemNo(itemNo: string): string {
  return itemNo.trim().toLowerCase().replace(/\s+/g, '')
}

/** 生成路径段：xtq6351-ppsu-wide-neck-feeding-bottle */
export function buildProductSlug(itemNo: string, name: string): string {
  const no = normalizeItemNo(itemNo)
  if (!no)
    return ''
  const nameSlug = slugifyProductName(name || '')
  return nameSlug ? `${no}-${nameSlug}` : no
}

/** 生成站内路径（不含 locale 前缀） */
export function buildProductPath(categorySlug: string, itemNo: string, name: string): string {
  const cat = (categorySlug || '').trim().replace(/^\/+|\/+$/g, '')
  const slug = buildProductSlug(itemNo, name)
  if (!cat || !slug)
    return ''
  return `/${cat}/${slug}`
}

export function buildProductPathFromProduct(product: ProductSlugSource): string {
  return buildProductPath(
    product.categorySlug || '',
    product.itemNo || '',
    product.name || '',
  )
}

/** 从路由 slug 解析 itemNo（取首段，兼容仅型号） */
export function parseItemNoFromProductSlug(routeSlug: string): string {
  const raw = (routeSlug || '').trim().toLowerCase()
  if (!raw)
    return ''
  const dash = raw.indexOf('-')
  if (dash <= 0)
    return raw
  return raw.slice(0, dash)
}

/**
 * 在产品列表中按路由 slug 查找。
 * 1) 完整 slug 精确匹配 2) itemNo 前缀匹配（名称改过仍能打开）
 */
export function findProductByRouteSlug<T extends ProductSlugSource>(
  products: T[],
  routeSlug: string,
  categorySlug?: string,
): T | null {
  const slug = (routeSlug || '').trim().toLowerCase()
  if (!slug || !products?.length)
    return null

  const list = categorySlug
    ? products.filter(p => (p.categorySlug || '').trim() === categorySlug.trim())
    : products

  const exact = list.find(p => buildProductSlug(p.itemNo || '', p.name || '') === slug)
  if (exact)
    return exact

  return list.find((p) => {
    const no = normalizeItemNo(p.itemNo || '')
    if (!no)
      return false
    return slug === no || slug.startsWith(`${no}-`)
  }) ?? null
}
