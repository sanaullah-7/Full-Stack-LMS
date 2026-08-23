import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { initAntiInspectSecurity } from './utils/security.js'

// Initialize strict anti-inspect protection
initAntiInspectSecurity();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
