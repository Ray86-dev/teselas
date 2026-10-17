// Todo lo que solo existe en la app de escritorio (Tauri): ventana flotante,
// modo píldora, siempre encima, arranque con Windows y avisos nativos.
// En el navegador del móvil, todas estas funciones no hacen nada.
import { isTauri } from '@tauri-apps/api/core'

export const enEscritorio = isTauri()

export type Modo = 'panel' | 'pildora'

export const TAMANOS: Record<Modo, { w: number; h: number }> = {
  panel: { w: 404, h: 680 },
  pildora: { w: 292, h: 88 },
}

const CLAVE_POS = 'teselas:pos'
const MARGEN = 12

async function ventana() {
  const { getCurrentWindow } = await import('@tauri-apps/api/window')
  return getCurrentWindow()
}

/** Coloca la ventana donde la dejó ella, o abajo a la derecha la primera vez. */
export async function prepararVentana(modo: Modo, encima: boolean) {
  if (!enEscritorio) return
  const { PhysicalPosition, PhysicalSize, primaryMonitor, availableMonitors } = await import('@tauri-apps/api/window')
  const win = await ventana()
  const monitor = await primaryMonitor()
  const escala = monitor?.scaleFactor ?? (await win.scaleFactor())
  const t = TAMANOS[modo]
  const w = Math.round(t.w * escala)
  const h = Math.round(t.h * escala)
  await win.setSize(new PhysicalSize(w, h))

  let pos: { x: number; y: number } | null = null
  try {
    pos = JSON.parse(localStorage.getItem(CLAVE_POS) ?? 'null')
  } catch {
    /* sin posición guardada */
  }
  // si la posición guardada ya no cae en ninguna pantalla (otro monitor), se descarta
  if (pos) {
    const monitores = await availableMonitors()
    const dentro = monitores.some((m) => {
      const a = m.workArea
      return pos!.x >= a.position.x - w / 2 && pos!.x < a.position.x + a.size.width && pos!.y >= a.position.y - h / 2 && pos!.y < a.position.y + a.size.height
    })
    if (!dentro) pos = null
  }
  if (!pos && monitor) {
    const a = monitor.workArea
    pos = { x: a.position.x + a.size.width - w - MARGEN * escala, y: a.position.y + a.size.height - h - MARGEN * escala }
  }
  if (pos) await win.setPosition(new PhysicalPosition(Math.round(pos.x), Math.round(pos.y)))
  await win.setAlwaysOnTop(encima)
  await marcarEncimaEnBandeja(encima)
  await win.show()

  let guardando: number | undefined
  await win.onMoved(({ payload }) => {
    window.clearTimeout(guardando)
    guardando = window.setTimeout(() => localStorage.setItem(CLAVE_POS, JSON.stringify({ x: payload.x, y: payload.y })), 300)
  })
}

/**
 * Cambia entre panel y píldora sin que la ventana «salte»: mantiene fija
 * la esquina más cercana al borde de la pantalla.
 */
export async function cambiarModo(modo: Modo) {
  if (!enEscritorio) return
  const { PhysicalPosition, PhysicalSize, currentMonitor } = await import('@tauri-apps/api/window')
  const win = await ventana()
  const escala = await win.scaleFactor()
  const pos = await win.outerPosition()
  const tam = await win.outerSize()
  const monitor = await currentMonitor()
  const t = TAMANOS[modo]
  const w = Math.round(t.w * escala)
  const h = Math.round(t.h * escala)

  let x = pos.x
  let y = pos.y
  if (monitor) {
    const a = monitor.workArea
    const centroX = pos.x + tam.width / 2
    const centroY = pos.y + tam.height / 2
    // anclar a la derecha si está en la mitad derecha; abajo si está en la mitad de abajo
    if (centroX > a.position.x + a.size.width / 2) x = pos.x + tam.width - w
    if (centroY > a.position.y + a.size.height / 2) y = pos.y + tam.height - h
    x = Math.min(Math.max(x, a.position.x), a.position.x + a.size.width - w)
    y = Math.min(Math.max(y, a.position.y), a.position.y + a.size.height - h)
  }
  if (modo === 'pildora') {
    await win.setSize(new PhysicalSize(w, h))
    await win.setPosition(new PhysicalPosition(x, y))
  } else {
    await win.setPosition(new PhysicalPosition(x, y))
    await win.setSize(new PhysicalSize(w, h))
  }
}

export async function arrastrar() {
  if (!enEscritorio) return
  await (await ventana()).startDragging()
}

export async function esconder() {
  if (!enEscritorio) return
  await (await ventana()).hide()
}

export async function siempreEncima(si: boolean) {
  if (!enEscritorio) return
  await (await ventana()).setAlwaysOnTop(si)
  await marcarEncimaEnBandeja(si)
}

/** Mantiene la marca de «Siempre encima» del menú de la bandeja igual que el ajuste. */
async function marcarEncimaEnBandeja(si: boolean) {
  const { invoke } = await import('@tauri-apps/api/core')
  await invoke('marcar_encima', { si }).catch(() => {})
}

export async function arranqueActivado(): Promise<boolean> {
  if (!enEscritorio) return false
  const { isEnabled } = await import('@tauri-apps/plugin-autostart')
  return isEnabled()
}

export async function activarArranque(si: boolean) {
  if (!enEscritorio) return
  const { enable, disable } = await import('@tauri-apps/plugin-autostart')
  await (si ? enable() : disable())
}

/** Escucha los cambios hechos desde el icono de la bandeja. */
export async function alCambiarEncimaDesdeBandeja(fn: (si: boolean) => void) {
  if (!enEscritorio) return
  const { listen } = await import('@tauri-apps/api/event')
  await listen<boolean>('siempre-encima', (e) => fn(e.payload))
}

export async function avisoNativo(titulo: string, cuerpo: string) {
  if (enEscritorio) {
    const { sendNotification, isPermissionGranted, requestPermission } = await import('@tauri-apps/plugin-notification')
    let ok = await isPermissionGranted()
    if (!ok) ok = (await requestPermission()) === 'granted'
    if (ok) sendNotification({ title: titulo, body: cuerpo })
    return
  }
  if ('Notification' in window && Notification.permission === 'granted') {
    const icon = `${import.meta.env.BASE_URL}icono-192.png`
    const reg = await navigator.serviceWorker?.getRegistration()
    if (reg) await reg.showNotification(titulo, { body: cuerpo, icon })
    else new Notification(titulo, { body: cuerpo, icon })
  }
}
