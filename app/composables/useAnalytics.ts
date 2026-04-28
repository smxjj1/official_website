// Analytics API composable
// Handles API calls with dynamic URL generation and proper CORS handling

export const useAnalytics = () => {
  const config = useRuntimeConfig()
  const siteKey = config.public.analyticsSiteId as string

  // Stats track endpoint
  const getTrackEndpoint = () => {
    const baseUrl = config.public.analyticsBaseUrl as string
    return `${baseUrl}/api/stats/track`
  }

  const getOrCreateStorageId = (storage: Storage, key: string, prefix: string) => {
    let value = storage.getItem(key)
    if (!value) {
      value = `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
      storage.setItem(key, value)
    }
    return value
  }

  const getAnonymousUserId = () => {
    if (!import.meta.client) return `u_server_${Date.now()}`
    return getOrCreateStorageId(localStorage, 'analytics_user_id', 'u')
  }

  const getSessionId = () => {
    if (!import.meta.client) return `s_server_${Date.now()}`
    return getOrCreateStorageId(sessionStorage, 'analytics_session_id', 's')
  }

  // Send analytics event (fire-and-forget)
  const sendTrackEvent = async (payload: {
    eventType: 'click' | 'pageview' | 'banner_view'
    elementInfo?: Record<string, unknown>
  }) => {
    const token = config.public.analyticsToken as string

    const body = {
      userId: getAnonymousUserId(),
      sessionId: getSessionId(),
      siteKey,
      eventType: payload.eventType,
      url: import.meta.client ? window.location.href : '',
      elementInfo: payload.elementInfo || {},
      timestamp: new Date().toISOString(),
    }

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      }

      if (token) {
        headers.Authorization = `Bearer ${token}`
      }

      const response = await fetch(getTrackEndpoint(), {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        console.error('[Analytics] Request failed:', response.status)
      }
    } catch (err) {
      // Silent fail for analytics - do not interrupt user experience
      console.error('[Analytics] Error:', err)
    }
  }

  // Contact page semantic analytics wrapper
  const sendContactAnalytics = async (data: {
    action: string
    form: string
    subject?: string
    reason?: string
  }) => {
    await sendTrackEvent({
      eventType: 'click',
      elementInfo: data,
    })
  }

  const trackPageview = async (path = '') => {
    await sendTrackEvent({
      eventType: 'pageview',
      elementInfo: {
        path,
      },
    })
  }

  return {
    sendContactAnalytics,
    trackPageview,
  }
}
