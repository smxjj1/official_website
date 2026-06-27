export interface ContactLinkItem {
  id?: number
  linkType: 'contact' | 'social'
  iconSource?: 'builtin' | 'upload'
  iconKey?: string | null
  iconUrl?: string | null
  label?: string | null
  url: string
  openInNewTab?: boolean
  sortOrder?: number
}

export interface ContactLinksPayload {
  contact: ContactLinkItem[]
  social: ContactLinkItem[]
  links: ContactLinkItem[]
}

function splitLinks(links: ContactLinkItem[]): ContactLinksPayload {
  return {
    contact: links.filter(item => item.linkType === 'contact'),
    social: links.filter(item => item.linkType === 'social'),
    links,
  }
}

export function getLinkDisplayText(link: ContactLinkItem): string {
  const url = link.url || ''
  if (link.iconKey === 'email') {
    return url.replace(/^mailto:/i, '')
  }
  if (link.iconKey === 'phone' || link.iconKey === 'whatsapp') {
    return url.replace(/^tel:/i, '')
  }
  return link.label || url
}

export function getLinkAriaLabel(link: ContactLinkItem): string {
  const labels: Record<string, string> = {
    email: 'Email',
    phone: 'Phone',
    whatsapp: 'WhatsApp',
    instagram: 'Instagram',
    facebook: 'Facebook',
    xiaohongshu: 'Xiaohongshu',
    threads: 'Threads',
    linkedin: 'LinkedIn',
    twitter: 'Twitter',
    youtube: 'YouTube',
    tiktok: 'TikTok',
  }
  return link.label || labels[link.iconKey || ''] || link.iconKey || 'Link'
}

function buildFallbackLinks(email: string, phone: string): ContactLinkItem[] {
  const phoneDigits = phone.replace(/[^\d+]/g, '')
  return [
    {
      linkType: 'contact',
      iconKey: 'email',
      url: `mailto:${email}`,
      openInNewTab: false,
      sortOrder: 0,
    },
    {
      linkType: 'contact',
      iconKey: 'phone',
      url: phoneDigits ? `tel:${phoneDigits}` : '#',
      openInNewTab: false,
      sortOrder: 1,
    },
  ]
}

export function useContactLinks() {
  const config = useRuntimeConfig()
  const { $t } = useI18n()
  const siteKey = (config.public.cmsSiteKey as string) || 'oyababies.com'
  const cmsApi = ((config.public.cmsApi as string) || 'https://analytics.oyababies.com/api/public').replace(/\/$/, '')

  const { data, error, pending, refresh } = useFetch<{ success?: boolean; data?: ContactLinksPayload }>(
    () => `${cmsApi}/contact-links`,
    {
      query: { site_key: siteKey },
      key: `contact-links-${siteKey}`,
    },
  )

  const fromCms = computed(() => !error.value && (data.value?.data?.links?.length ?? 0) > 0)

  const fallbackLinks = computed(() => {
    const email = String($t('contact.emailValue') || 'admin@oyababies.com')
    const phone = String($t('contact.whatsappValue') || '+86 576-84856888')
    return buildFallbackLinks(email, phone)
  })

  const payload = computed<ContactLinksPayload>(() => {
    if (fromCms.value && data.value?.data) {
      return data.value.data
    }
    return splitLinks(fallbackLinks.value)
  })

  const contactLinks = computed(() => payload.value.contact)
  const socialLinks = computed(() => payload.value.social)

  return {
    contactLinks,
    socialLinks,
    fromCms,
    pending,
    refresh,
    getLinkDisplayText,
    getLinkAriaLabel,
  }
}
