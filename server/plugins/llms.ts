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
})
