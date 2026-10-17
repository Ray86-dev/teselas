import { NOMBRE } from '../personal'

/** Lo que aparece al marcar una cosita. Corto, cálido, nunca exigente. */
export const AL_HACER = [
  'Una tesela más ✦',
  'Hecho. Qué bien.',
  'Eso cuenta. Y mucho.',
  'Poquito a poco.',
  'Klimt aprueba.',
  'Otra tesela descubierta.',
  'Así, sin prisa.',
  `Bien hecho, ${NOMBRE}.`,
  'Mira tú qué bien.',
  'Un brillito más.',
]

export const SUBTITULOS = [
  'Cuando quieras. Sin prisa.',
  'Hoy, poquito a poco.',
  'Aquí no hay deberes, solo cositas.',
  'Lo pequeño también cuenta.',
  'A tu ritmo, siempre.',
]

export const TODO_HECHO = [
  'Hoy, todo hecho. Lo demás es regalo.',
  'Todas tus cositas de hoy, hechas.',
  'Día completo. A descansar con gusto.',
]

export type Cielo = 'sol' | 'nubes' | 'lluvia' | 'tormenta'

export const CIELOS: Record<Cielo, { nombre: string; respuesta: string }> = {
  sol: { nombre: 'Despejado', respuesta: 'Qué bien. Aprovechemos la luz.' },
  nubes: { nombre: 'Nubes y claros', respuesta: 'Nubes y claros. Vamos poquito a poco.' },
  lluvia: { nombre: 'Lluvia', respuesta: 'Día de lluvia. Hoy, solo lo más pequeño.' },
  tormenta: { nombre: 'Tormenta', respuesta: 'Día de tormenta. Vamos a refugiarnos.' },
}
