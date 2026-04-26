import enLocale from '~/locales/en.json'
import zhCNLocale from '~/locales/zh-CN.json'
import zhTWLocale from '~/locales/zh-TW.json'

type LocaleMessages = Record<string, any>

type LocaleValue = string | string[] | Record<string, any>

const locales: Record<string, LocaleMessages> = {
  'en': enLocale,
  'zh-CN': zhCNLocale,
  'zh-TW': zhTWLocale,
}

// Detect locale from route path
function detectLocaleFromPath(path: string): string {
  if (path.startsWith('/zh-CN')) {
    return 'zh-CN'
  } else if (path.startsWith('/zh-TW')) {
    return 'zh-TW'
  }
  return 'en'
}

export const useI18n = () => {
  const route = useRoute()
  const locale = useState<string>('locale', () => detectLocaleFromPath(route.path))

  // Update locale on route change
  watch(() => route.path, (newPath) => {
    locale.value = detectLocaleFromPath(newPath)
  }, { immediate: true })

  // Translation function - detects locale directly from route
  const $t = (key: string, params?: Record<string, string | number>): LocaleValue => {
    // Get current locale directly from route
    const currentLocale = detectLocaleFromPath(route.path)

    const keys = key.split('.')
    let value: any = locales[currentLocale] || locales['en']

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        // Fallback to English
        value = locales['en']
        for (const fk of keys) {
          if (value && typeof value === 'object' && fk in value) {
            value = value[fk]
          } else {
            return key // Return key if not found
          }
        }
        break
      }
    }

    // Support arrays (for features lists and FAQ items)
    if (Array.isArray(value)) {
      return value as LocaleValue
    }

    if (typeof value !== 'string') {
      return key
    }

    // Replace parameters
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        value = value.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v))
      })
    }

    return value
  }

  // Set locale and navigate
  const setLocale = (newLocale: string) => {
    const currentPath = route.path
    let newPath = currentPath

    // Remove existing locale prefix
    if (currentPath.startsWith('/zh-CN/')) {
      newPath = currentPath.replace('/zh-CN', '')
    } else if (currentPath.startsWith('/zh-TW/')) {
      newPath = currentPath.replace('/zh-TW', '')
    }

    // Add new locale prefix
    if (newLocale === 'en') {
      // Remove any leading slash from path for root
      newPath = newPath === '' ? '/' : newPath
    } else {
      newPath = `/${newLocale}${newPath}`
    }

    // Ensure path starts with /
    if (!newPath.startsWith('/')) {
      newPath = '/' + newPath
    }

    // Handle double slashes
    newPath = newPath.replace(/\/+/g, '/')

    navigateTo(newPath)
  }

  // Get locale path for a given path
  const getLocalePath = (path: string): string => {
    const currentLocale = detectLocaleFromPath(route.path)

    if (currentLocale === 'en') {
      return path
    }
    return `/${currentLocale}${path.startsWith('/') ? path : '/' + path}`
  }

  return {
    locale: readonly(locale),
    $t,
    setLocale,
    getLocalePath,
  }
}
