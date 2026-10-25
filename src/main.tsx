import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

async function enableMocking() {
  // Activated by configuration (defaults to true for demo and development builds)
  const isMockEnabled = import.meta.env.VITE_ENABLE_MOCKS !== 'false'
  if (!isMockEnabled) return

  const { worker } = await import('./mocks/browser')
  return worker.start({
    quiet: true,
    serviceWorker: {
      url: '/mockServiceWorker.js',
    },
  })
}

enableMocking()
  .catch((err) => {
    console.warn('MSW worker failed to start, proceeding without mock interceptor:', err)
  })
  .finally(() => {
    createRoot(document.getElementById('root')!).render(
      <StrictMode>
        <App />
      </StrictMode>,
    )
  })
