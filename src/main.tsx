import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { enEscritorio } from './lib/escritorio'
import { unirse } from './lib/nube'
import { Buzon } from './pantallas/Buzon'
import './index.css'

if (enEscritorio) {
  document.documentElement.classList.add('escritorio')
} else if ('serviceWorker' in navigator && import.meta.env.PROD) {
  void import('virtual:pwa-register').then(({ registerSW }) => registerSW({ immediate: true }))
}

// Enlaces especiales:
//   #/buzon/<clave>  → la página de Ray para dejar notas
//   #/unir/<clave>   → el enlace del QR: une este dispositivo y se borra de la barra de direcciones
const hash = location.hash
let buzon: string | null = null
if (hash.startsWith('#/buzon/')) {
  buzon = decodeURIComponent(hash.slice('#/buzon/'.length))
} else if (hash.startsWith('#/unir/')) {
  const clave = decodeURIComponent(hash.slice('#/unir/'.length))
  history.replaceState(null, '', location.pathname + location.search)
  void unirse(clave)
}

createRoot(document.getElementById('root')!).render(<StrictMode>{buzon ? <Buzon clave={buzon} /> : <App />}</StrictMode>)
