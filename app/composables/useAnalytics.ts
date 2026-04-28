// Analytics API composable
// Handles API calls with dynamic URL generation and proper CORS handling

export const useAnalytics = () => {
  const config = useRuntimeConfig()
  const siteId = config.public.analyticsSiteId as string

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

    const payload = {
      ...data,
      website: siteId,
    }

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      }

      if (token) {
        headers.Authorization = `Bearer ${token}`
      }

      const response = await fetch(getApiEndpoint(), {
        method: 'POST',
        headers,
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
