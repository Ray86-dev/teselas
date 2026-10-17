import { COSITAS, COSITAS_POR_ID, PELDANOS, type Cosita, type Momento, type Peldano } from '../data/cositas'
import { CUADROS, teselasDe, type Cuadro } from '../data/cuadros'
import { SORPRESAS, type Sorpresa } from '../data/sorpresas'
import type { Cielo } from '../data/frases'
import { NOTAS, PAREJA } from '../personal'
import { barajar } from '../lib/azar'
import { leer, type Reg } from './estado'

type Regs = Record<string, Reg>

export interface Activa {
  on: boolean
  momento: Momento
  orden: number
}

// ── Cositas ──────────────────────────────────────────────────

export function cositaPorId(regs: Regs, id: string): Cosita | undefined {
  if (id.startsWith('p-')) {
    const propia = leer<Cosita | null>(regs, `x:${id}`, null)
    return propia ?? undefined
  }
  return COSITAS_POR_ID[id]
}

export function cositasPropias(regs: Regs): Cosita[] {
  const out: Cosita[] = []
  for (const [k, r] of Object.entries(regs)) {
    if (k.startsWith('x:') && r.v) out.push(r.v as Cosita)
  }
  return out
}

export function todasLasCositas(regs: Regs): Cosita[] {
  return [...COSITAS, ...cositasPropias(regs)]
}

export interface CositaActiva {
  cosita: Cosita
  momento: Momento
  orden: number
}

export function activas(regs: Regs): CositaActiva[] {
  const out: CositaActiva[] = []
  for (const [k, r] of Object.entries(regs)) {
    if (!k.startsWith('a:')) continue
    const a = r.v as Activa | null
    if (!a?.on) continue
    const cosita = cositaPorId(regs, k.slice(2))
    if (cosita) out.push({ cosita, momento: a.momento, orden: a.orden })
  }
  return out.sort((x, y) => x.orden - y.orden)
}

export const ORDEN_MOMENTOS: Momento[] = ['manana', 'tarde', 'noche', 'cuando']

// ── Hechas y teselas ─────────────────────────────────────────

export function hechasDe(regs: Regs, fecha: string): Set<string> {
  const prefijo = `h:${fecha}:`
  const out = new Set<string>()
  for (const [k, r] of Object.entries(regs)) if (k.startsWith(prefijo) && r.v === true) out.add(k.slice(prefijo.length))
  return out
}

export function totalTeselas(regs: Regs): number {
  let n = 0
  for (const [k, r] of Object.entries(regs)) if (k.startsWith('h:') && r.v === true) n++
  return n
}

/** Días (ordenados) en los que hizo al menos una cosita. Nunca disminuye por no hacer nada. */
export function diasActivos(regs: Regs): string[] {
  const dias = new Set<string>()
  for (const [k, r] of Object.entries(regs)) if (k.startsWith('h:') && r.v === true) dias.add(k.slice(2, 12))
  return [...dias].sort()
}

export function teselasEntre(regs: Regs, desde: string, hasta: string): number {
  let n = 0
  for (const [k, r] of Object.entries(regs)) {
    if (!k.startsWith('h:') || r.v !== true) continue
    const f = k.slice(2, 12)
    if (f >= desde && f <= hasta) n++
  }
  return n
}

export const cieloDe = (regs: Regs, fecha: string) => leer<Cielo | null>(regs, `c:${fecha}`, null)

// ── Peldaños ─────────────────────────────────────────────────

export function peldanoAlcanzado(dias: number): Peldano {
  let p: Peldano = 1
  for (const k of [2, 3, 4] as Peldano[]) if (dias >= PELDANOS[k].dias) p = k
  return p
}

// ── Cuadros ──────────────────────────────────────────────────

export interface Progreso {
  cuadro: Cuadro
  vuelta: number
  puestas: number
  total: number
  /** índices de teselas descubiertas, en el orden en que se descubrieron */
  descubiertas: number[]
  completados: { cuadro: Cuadro; vuelta: number }[]
}

export function ordenTeselas(cuadro: Cuadro, vuelta: number): number[] {
  const n = teselasDe(cuadro)
  return barajar(
    Array.from({ length: n }, (_, i) => i),
    `${cuadro.id}:${vuelta}`,
  )
}

export function progreso(total: number): Progreso {
  let resto = total
  let i = 0
  const completados: Progreso['completados'] = []
  for (;;) {
    const cuadro = CUADROS[i % CUADROS.length]
    const n = teselasDe(cuadro)
    const vuelta = Math.floor(i / CUADROS.length) + 1
    if (resto < n) {
      return { cuadro, vuelta, puestas: resto, total: n, descubiertas: ordenTeselas(cuadro, vuelta).slice(0, resto), completados }
    }
    completados.push({ cuadro, vuelta })
    resto -= n
    i++
  }
}

// ── Ventanitas ───────────────────────────────────────────────

export interface Ventanita {
  id: string
  sorpresa: Sorpresa
}

/** Una nota de Ray: de personal.ts (sin fecha) o del buzón en la nube. */
export interface NotaPareja {
  id: string
  texto: string
  creada?: string
}

const TRES_DIAS = 3 * 86_400_000

function notaComoSorpresa(n: NotaPareja): Sorpresa {
  return { id: `nota:${n.id}`, tipo: 'nota', emoji: '💌', titulo: `De ${PAREJA}`, texto: n.texto }
}

/** Orden fijo de sorpresas, alternando tipos para que no se repitan seguidas. */
const ORDEN_SORPRESAS: Sorpresa[] = (() => {
  const grupos = new Map<string, Sorpresa[]>()
  for (const s of SORPRESAS) grupos.set(s.tipo, [...(grupos.get(s.tipo) ?? []), s])
  const tipos = barajar([...grupos.keys()], 'tipos')
  const colas = tipos.map((t) => barajar(grupos.get(t)!, `grupo:${t}`))
  const out: Sorpresa[] = []
  while (colas.some((c) => c.length)) for (const c of colas) if (c.length) out.push(c.shift()!)
  return out
})()

export function sorpresaPorId(id: string, notas: NotaPareja[] = []): Sorpresa | undefined {
  if (id.startsWith('nota:')) {
    const n = [...NOTAS, ...notas].find((x) => `nota:${x.id}` === id)
    return n ? notaComoSorpresa(n) : undefined
  }
  return SORPRESAS.find((s) => s.id === id)
}

export function ventanitasAbiertas(regs: Regs): string[] {
  return Object.entries(regs)
    .filter(([k, r]) => k.startsWith('v:') && typeof r.v === 'string')
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, r]) => r.v as string)
}

/**
 * La sorpresa que toca hoy: la ya abierta, o la siguiente en la cola.
 * Las notas de Ray recién escritas (menos de tres días) pasan delante;
 * las demás salen una de cada tres ventanitas.
 */
export function ventanitaDeHoy(regs: Regs, fecha: string, notas: NotaPareja[] = []): Ventanita {
  const yaAbierta = leer<string | null>(regs, `v:${fecha}`, null)
  if (yaAbierta) {
    const s = sorpresaPorId(yaAbierta, notas)
    if (s) return { id: yaAbierta, sorpresa: s }
  }
  const abiertas = ventanitasAbiertas(regs)
  const vistas = new Set(abiertas)
  const n = abiertas.length
  const sinVer: NotaPareja[] = [...NOTAS, ...notas].filter((x) => !vistas.has(`nota:${x.id}`))
  const reciente = sinVer.find((x) => x.creada && Date.now() - Date.parse(x.creada) < TRES_DIAS)
  const nota = reciente ?? (n % 3 === 0 ? sinVer[0] : undefined)
  if (nota) {
    const s = notaComoSorpresa(nota)
    return { id: s.id, sorpresa: s }
  }
  const siguiente = ORDEN_SORPRESAS.find((s) => !vistas.has(s.id)) ?? ORDEN_SORPRESAS[n % ORDEN_SORPRESAS.length]
  return { id: siguiente.id, sorpresa: siguiente }
}

// ── Sugerencias para subir ───────────────────────────────────

export const DIAS_PARA_SUGERIR = 5
export const MAX_ACTIVAS_SUGERIR = 7

export function debeSugerir(regs: Regs, hoy: string): boolean {
  const inicio = leer<string | null>(regs, 'onb', null)
  if (!inicio) return false
  const ultima = leer<string>(regs, 'sug', inicio)
  if (ultima >= hoy) return false
  const desde = diasActivos(regs).filter((d) => d > ultima && d <= hoy).length
  return desde >= DIAS_PARA_SUGERIR && activas(regs).length < MAX_ACTIVAS_SUGERIR
}

export function ideasParaAnadir(regs: Regs, hoy: string, cuantas = 3): Cosita[] {
  const ya = new Set(activas(regs).map((a) => a.cosita.id))
  const alcanzado = peldanoAlcanzado(diasActivos(regs).length)
  const candidatas = COSITAS.filter((c) => !ya.has(c.id) && c.peldano <= Math.min(4, alcanzado + 1))
  const categoriasActivas = new Set(activas(regs).map((a) => a.cosita.categoria))
  const puntuadas = barajar(candidatas, `ideas:${hoy}`).sort((a, b) => {
    const pa = Math.abs(a.peldano - alcanzado) + (categoriasActivas.has(a.categoria) ? 0.5 : 0)
    const pb = Math.abs(b.peldano - alcanzado) + (categoriasActivas.has(b.categoria) ? 0.5 : 0)
    return pa - pb
  })
  const out: Cosita[] = []
  const cats = new Set<string>()
  for (const c of puntuadas) {
    if (out.length >= cuantas) break
    if (cats.has(c.categoria)) continue
    cats.add(c.categoria)
    out.push(c)
  }
  return out
}
