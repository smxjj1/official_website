import { buildLlmsFullContents } from '../../shared/seo/llms-full'
import {
  buildLocalizedStaticSections,
  buildLlmsNotes,
  buildProductCategorySection,
} from '../../shared/seo/llms'

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('llms:generate', async (_event, options) => {
    options.sections ??= []

    const categorySection = await buildProductCategorySection()
    if (categorySection) {
      options.sections.push(categorySection)
    }

    options.sections.push(...buildLocalizedStaticSections())

    const domain = String(options.domain || '')
    if (domain) {
      options.notes = buildLlmsNotes(domain)
    }
  })

  nitroApp.hooks.hook('llms:generate:full', async (_event, options, contents) => {
    const domain = String(options.domain || '')
    const title = String(options.full?.title || options.title || 'Documentation')
    const description = String(options.full?.description || options.description || '')

    contents.push(...await buildLlmsFullContents(domain, title, description))
  })
})
