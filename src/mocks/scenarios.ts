export type MockScenario =
  | 'default'
  | 'empty_catalog'
  | 'slow_network'
  | 'variable_latency'
  | 'network_error'
  | 'server_error_500'
  | 'service_unavailable_503'
  | 'unauthorized_401'
  | 'forbidden_403'
  | 'register_conflict_409'
  | 'invalid_coupon'
  | 'edition_sold_out'
  | 'order_timeout'
  | 'payment_refused'

const SCENARIO_STORAGE_KEY = 'kurio_mock_scenario'

export const getActiveScenario = (): MockScenario => {
  if (typeof window !== 'undefined') {
    // Check URL query param first: ?scenario=...
    try {
      const urlParams = new URLSearchParams(window.location.search)
      const queryScenario = urlParams.get('scenario') as MockScenario | null
      if (queryScenario) {
        return queryScenario
      }
    } catch {}

    // Check localStorage
    try {
      const stored = localStorage.getItem(SCENARIO_STORAGE_KEY) as MockScenario | null
      if (stored) {
        return stored
      }
    } catch {}
  }
  return 'default'
}

export const setActiveScenario = (scenario: MockScenario) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(SCENARIO_STORAGE_KEY, scenario)
    try {
      const url = new URL(window.location.href)
      if (url.searchParams.has('scenario')) {
        url.searchParams.delete('scenario')
        window.history.replaceState({}, '', url.toString())
      }
    } catch {}
  }
}

export const resetActiveScenario = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(SCENARIO_STORAGE_KEY)
  }
}

// Global window helpers for automated testing (Playwright)
if (typeof window !== 'undefined') {
  ;(window as any).__setKurioScenario = setActiveScenario
  ;(window as any).__getKurioScenario = getActiveScenario
}
