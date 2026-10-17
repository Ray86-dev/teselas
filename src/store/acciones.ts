import { AL_HACER, type Cielo } from '../data/frases'
import type { Cosita, Momento } from '../data/cositas'
import { alAzar } from '../lib/azar'
import { fechaLogica } from '../lib/fecha'
import { campanitas, tin } from '../lib/sonido'
import { cositaPorId, diasActivos, peldanoAlcanzado, progreso, totalTeselas, ventanitaDeHoy, type Activa } from './derivados'
import { leer, poner, useTeselas } from './estado'
import { useUI } from './ui'
import { useNube } from '../lib/nube'
import { activarArranque, enEscritorio } from '../lib/escritorio'

const regs = () => useTeselas.getState().regs
const conSonido = () => leer(regs(), 'cfg:sonido', true)

export function estaHecha(cositaId: string, fecha = fechaLogica()) {
  return leer(regs(), `h:${fecha}:${cositaId}`, false)
}

export function marcar(cositaId: string) {
  const hoy = fechaLogica()
  const clave = `h:${hoy}:${cositaId}`
  if (leer(regs(), clave, false)) return

  const antes = totalTeselas(regs())
  const pAntes = progreso(antes)
  const diasAntes = diasActivos(regs()).length

  poner({ [clave]: true })

  const ui = useUI.getState()
  const pDespues = progreso(antes + 1)
  if (pDespues.completados.length > pAntes.completados.length) {
    const ultimo = pDespues.completados[pDespues.completados.length - 1]
    ui.abrir({ tipo: 'cuadro-completo', cuadroId: ultimo.cuadro.id, vuelta: ultimo.vuelta, celebrar: true })
    if (conSonido()) campanitas()
  } else {
    useUI.setState({ recien: { indice: pDespues.descubiertas[pDespues.descubiertas.length - 1], cuadroId: pDespues.cuadro.id, ts: Date.now() } })
    if (conSonido()) tin()
  }

  const diasDespues = diasActivos(regs()).length
  const nuevo = peldanoAlcanzado(diasDespues)
  if (nuevo > peldanoAlcanzado(diasAntes) && !leer(regs(), `hito:${nuevo}`, null) && !useUI.getState().capa) {
    ui.abrir({ tipo: 'hito', peldano: nuevo })
  }

  ui.avisar(alAzar(AL_HACER), () => desmarcar(cositaId))
  navigator.vibrate?.(18)
}

export function desmarcar(cositaId: string) {
  poner({ [`h:${fechaLogica()}:${cositaId}`]: false })
  useUI.setState({ recien: null })
}

export function alternar(cositaId: string) {
  if (estaHecha(cositaId)) desmarcar(cositaId)
  else marcar(cositaId)
}

export function abrirVentanita() {
  const hoy = fechaLogica()
  const v = ventanitaDeHoy(regs(), hoy, useNube.getState().notas)
  if (!leer(regs(), `v:${hoy}`, null)) poner({ [`v:${hoy}`]: v.id })
  useUI.getState().abrir({ tipo: 'ventanita' })
}

export function ponerCielo(cielo: Cielo) {
  poner({ [`c:${fechaLogica()}`]: cielo })
  if (cielo === 'tormenta') useUI.getState().abrir({ tipo: 'refugio' })
}

export function activar(cositaId: string, momento?: Momento) {
  const c = cositaPorId(regs(), cositaId)
  if (!c) return
  const previa = leer<Activa | null>(regs(), `a:${cositaId}`, null)
  poner({ [`a:${cositaId}`]: { on: true, momento: momento ?? previa?.momento ?? c.momento, orden: Date.now() } satisfies Activa })
}

export function desactivar(cositaId: string) {
  const previa = leer<Activa | null>(regs(), `a:${cositaId}`, null)
  if (previa) poner({ [`a:${cositaId}`]: { ...previa, on: false } })
}

export function cambiarMomento(cositaId: string, momento: Momento) {
  const previa = leer<Activa | null>(regs(), `a:${cositaId}`, null)
  if (previa) poner({ [`a:${cositaId}`]: { ...previa, momento } })
}

export function crearCosita(datos: Pick<Cosita, 'titulo' | 'emoji' | 'peldano' | 'momento'> & { pista?: string }) {
  const id = `p-${Date.now().toString(36)}`
  const cosita: Cosita = { id, categoria: 'cuidarme', propia: true, ...datos }
  poner({ [`x:${id}`]: cosita })
  activar(id, datos.momento)
  return id
}

export function borrarCosita(id: string) {
  poner({ [`x:${id}`]: null, [`a:${id}`]: null })
}

export function empezar(semillas: string[]) {
  const hoy = fechaLogica()
  const cambios: Record<string, unknown> = { onb: hoy, sug: hoy }
  semillas.forEach((id, i) => {
    const c = cositaPorId(regs(), id)
    if (c) cambios[`a:${id}`] = { on: true, momento: c.momento, orden: Date.now() + i } satisfies Activa
  })
  poner(cambios)
  // en el portátil, que se abra sola al encenderlo (se puede quitar en Ajustes)
  if (enEscritorio) void activarArranque(true)
}

export function posponerSugerencia() {
  poner({ sug: fechaLogica() })
}
