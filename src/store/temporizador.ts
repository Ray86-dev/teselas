import { useEffect } from 'react'
import { avisoNativo } from '../lib/escritorio'
import { campanitas } from '../lib/sonido'
import { marcar } from './acciones'
import { cositaPorId } from './derivados'
import { leer, useTeselas } from './estado'
import { useLocal } from './local'
import { useUI } from './ui'

export function iniciarTemporizador(cositaId: string, minutos: number) {
  const ahora = Date.now()
  useUI.setState({ temporizador: { cositaId, minutos, inicio: ahora, fin: ahora + minutos * 60_000 } })
}

export function cancelarTemporizador() {
  useUI.setState({ temporizador: null })
}

/** Termina el temporizador (antes de tiempo o al sonar) y pone la tesela. */
export function completarTemporizador(sonar = false) {
  const ui = useUI.getState()
  const t = ui.temporizador
  if (!t) return
  useUI.setState({ temporizador: null })
  if (ui.capa?.tipo === 'temporizador') ui.cerrar()
  if (sonar && leer(useTeselas.getState().regs, 'cfg:sonido', true)) campanitas()
  marcar(t.cositaId)
  if (sonar && (document.hidden || useLocal.getState().modo === 'pildora')) {
    const c = cositaPorId(useTeselas.getState().regs, t.cositaId)
    void avisoNativo('¡Tiempo! ✦', c ? `${c.titulo}: hecho. Una tesela más.` : 'Una tesela más.')
  }
}

/** Vigila el temporizador aunque la capa esté cerrada o la ventana hecha píldora. */
export function useVigilarTemporizador() {
  useEffect(() => {
    const id = window.setInterval(() => {
      const t = useUI.getState().temporizador
      if (t && Date.now() >= t.fin) completarTemporizador(true)
    }, 500)
    return () => window.clearInterval(id)
  }, [])
}

export function formatoReloj(ms: number) {
  const s = Math.max(0, Math.ceil(ms / 1000))
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}
