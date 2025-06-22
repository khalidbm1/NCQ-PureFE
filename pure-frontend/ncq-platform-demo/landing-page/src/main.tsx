import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import DemoLauncher from './DemoLauncher'
import './index.css'

const root = createRoot(document.getElementById('root')!)

const isDemoLauncher = window.location.pathname.includes('demo-launcher')

root.render(
  <StrictMode>
    {isDemoLauncher ? <DemoLauncher /> : <App />}
  </StrictMode>,
)