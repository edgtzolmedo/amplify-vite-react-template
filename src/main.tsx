import { StrictMode } from 'react'
import '@bmw-ds/density-styles/dist/css/density-styles-full.css';
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
