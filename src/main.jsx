import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/globals.css'
import App from './App.jsx'

// When a new service worker takes control, reload so users always get the latest version
navigator.serviceWorker?.addEventListener('controllerchange', () => {
  window.location.reload()
})

// iOS won't auto-check for SW updates unless the page navigates.
// Trigger a check every time the user foregrounds the app so updates land immediately.
if ('serviceWorker' in navigator) {
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      navigator.serviceWorker.getRegistration().then(reg => reg?.update())
    }
  })
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
