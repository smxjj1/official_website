// Analytics API composable
// Handles API calls with dynamic URL generation and proper CORS handling

export const useAnalytics = () => {
  const config = useRuntimeConfig()

  // Generate dynamic website field: oya<timestamp>_Guangdong-Shenzhen
  const generateWebsiteField = () => {
    const timestamp = Date.now()
    return `oya${timestamp}_Guangdong-Shenzhen`
  }

  // Get the correct API endpoint based on environment
  const getApiEndpoint = () => {
    const baseUrl = config.public.analyticsBaseUrl as string
    if (import.meta.dev) {
      // In development, use the proxy path to avoid CORS
      return '/api/contact'
    }
    // In production, use the full URL with dynamic suffix
    return `${baseUrl}/api/contact`
  }

  // Send analytics data (fire-and-forget)
  const sendContactAnalytics = async (data: {
    name: string
    email: string
    message: string
  }) => {
    const token = config.public.analyticsToken as string

    if (!token) {
      console.warn('[Analytics] Token not configured, skipping analytics call')
      return
    }

    const payload = {
      ...data,
      website: generateWebsiteField(),
    }

    try {
      const response = await fetch(getApiEndpoint(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        console.error('[Analytics] Request failed:', response.status)
      }
    } catch (err) {
      // Silent fail for analytics - do not interrupt user experience
      console.error('[Analytics] Error:', err)
    }
  }

  return {
    sendContactAnalytics,
  }
}
