import { alAzar } from './azar'
import { avisoNativo } from './escritorio'
import { fechaLogica } from './fecha'
import { cieloDe, hechasDe } from '../store/derivados'
import { leer, useTeselas } from '../store/estado'
import { useLocal } from '../store/local'

// Un solo aviso al día, y solo si todavía no ha hecho nada.
// Nunca en días de tormenta. Nunca más de 4 horas tarde.

const TEXTOS = [
  '¿Una cosita pequeñita? Un vaso de agua ya vale. 💧',
  'Tu ventanita de hoy sigue cerrada… 🎁',
  'Una tesela de oro te espera. Sin prisa. ✦',
  'Tienes un Klimt a medio descubrir. 🖼️',
]

export const HORA_RECORDATORIO_POR_DEFECTO = '12:00'

function revisar() {
  const regs = useTeselas.getState().regs
  const hora = leer<string | null>(regs, 'cfg:recordatorio', HORA_RECORDATORIO_POR_DEFECTO)
  if (!hora || !leer(regs, 'onb', null)) return
  const hoy = fechaLogica()
  const local = useLocal.getState()
  if (local.ultimoRecordatorio === hoy) return

  const [h, m] = hora.split(':').map(Number)
  const ahora = new Date()
  const minutos = ahora.getHours() * 60 + ahora.getMinutes()
  const objetivo = h * 60 + m
  if (minutos < objetivo) return
  if (minutos > objetivo + 240 || hechasDe(regs, hoy).size > 0 || cieloDe(regs, hoy) === 'tormenta') {
    local.cambiar({ ultimoRecordatorio: hoy })
    return
  }
  local.cambiar({ ultimoRecordatorio: hoy })
  void avisoNativo('Teselas', alAzar(TEXTOS))
}

export function iniciarRecordatorios() {
  revisar()
  const id = window.setInterval(revisar, 60_000)
  return () => window.clearInterval(id)
}
