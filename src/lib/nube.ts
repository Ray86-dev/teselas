// Sincronización entre portátil y móvil (Supabase).
// Sin cuentas: una clave larga y aleatoria identifica sus datos. Se guarda solo en sus dispositivos;
// el móvil la recibe escaneando un QR. Ray tiene otra clave, la del buzón, que solo deja notas.
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useTeselas, type Reg } from '../store/estado'

const URL_SUPABASE = 'https://auzxaiuuolcjxntzwgyi.supabase.co'
// Clave pública por diseño: sin una clave de hogar no da acceso a nada.
const CLAVE_PUBLICA = 'sb_publishable_Zc8Pi1_U9G3YQPutKbJzEg_hVZK4HHr'

/** Dirección pública de la app (la del móvil). */
export const WEB_PUBLICA = 'https://ray86-dev.github.io/teselas/'

export interface Nota {
  id: string
  texto: string
  creada: string
}

type Estado = 'apagada' | 'ok' | 'sincronizando' | 'sin-conexion'

interface EstadoNube {
  clave: string | null
  buzon: string | null
  seq: number
  pendientes: string[]
  notas: Nota[]
  ultima: number | null
  estado: Estado
  cambiar: (p: Partial<Omit<EstadoNube, 'cambiar'>>) => void
}

export const useNube = create<EstadoNube>()(
  persist(
    (set) => ({
      clave: null,
      buzon: null,
      seq: 0,
      pendientes: [],
      notas: [],
      ultima: null,
      estado: 'apagada',
      cambiar: (p) => set(p),
    }),
    {
      name: 'teselas-nube',
      version: 1,
      partialize: ({ clave, buzon, seq, pendientes, notas, ultima }) => ({ clave, buzon, seq, pendientes, notas, ultima }),
    },
  ),
)

async function rpc<T>(funcion: string, cuerpo: Record<string, unknown>): Promise<T> {
  const r = await fetch(`${URL_SUPABASE}/rest/v1/rpc/${funcion}`, {
    method: 'POST',
    headers: { apikey: CLAVE_PUBLICA, 'Content-Type': 'application/json' },
    body: JSON.stringify(cuerpo),
  })
  if (!r.ok) {
    let mensaje = `${r.status}`
    try {
      mensaje = ((await r.json()) as { message?: string }).message ?? mensaje
    } catch {
      /* sin cuerpo */
    }
    throw new Error(mensaje)
  }
  const texto = await r.text()
  return (texto ? JSON.parse(texto) : null) as T
}

export function claveAleatoria(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(24))
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

export const enlaceUnir = (clave: string) => `${WEB_PUBLICA}#/unir/${clave}`
export const enlaceBuzon = (buzon: string) => `${WEB_PUBLICA}#/buzon/${buzon}`

// ── Registros pendientes de subir ────────────────────────────

/** Apunta como pendiente todo lo que cambie en este dispositivo. */
function vigilarCambios() {
  return useTeselas.subscribe((s, previo) => {
    if (s.regs === previo.regs) return
    const nuevas: string[] = []
    for (const [k, r] of Object.entries(s.regs)) {
      if (r !== previo.regs[k] && r.d === s.dispositivo && !k.startsWith('local:')) nuevas.push(k)
    }
    if (!nuevas.length) return
    const n = useNube.getState()
    n.cambiar({ pendientes: [...new Set([...n.pendientes, ...nuevas])] })
    programar(1500)
  })
}

// ── Sincronizar ──────────────────────────────────────────────

let enCurso: Promise<void> | null = null
let temporizador: number | undefined

function programar(ms: number) {
  window.clearTimeout(temporizador)
  temporizador = window.setTimeout(() => void sincronizar(), ms)
}

export function sincronizar(): Promise<void> {
  enCurso ??= hacerSincronizacion().finally(() => (enCurso = null))
  return enCurso
}

async function hacerSincronizacion() {
  const nube = useNube.getState()
  if (!nube.clave) return
  const { regs } = useTeselas.getState()
  const enviadas = nube.pendientes.filter((k) => regs[k])
  const cambios = enviadas.map((k) => ({ k, v: regs[k].v ?? null, t: regs[k].t, d: regs[k].d }))
  nube.cambiar({ estado: 'sincronizando' })
  try {
    // un pequeño solape en «desde» no hace daño (fusionar es idempotente) y evita perder cambios simultáneos
    const r = await rpc<{ regs: { k: string; v: unknown; t: number; d: string }[]; seq: number }>('sincronizar', {
      p_clave: nube.clave,
      p_cambios: cambios,
      p_desde: Math.max(0, nube.seq - 20),
    })
    const remotos: Record<string, Reg> = {}
    for (const x of r.regs) remotos[x.k] = { v: x.v, t: x.t, d: x.d }
    useTeselas.getState().fusionar(remotos)

    const notas = await rpc<Nota[]>('leer_notas', { p_clave: nube.clave })
    const ahora = useNube.getState()
    ahora.cambiar({
      seq: Math.max(ahora.seq, r.seq),
      pendientes: ahora.pendientes.filter((k) => !enviadas.includes(k) || useTeselas.getState().regs[k] !== regs[k]),
      notas: notas ?? [],
      ultima: Date.now(),
      estado: 'ok',
    })
  } catch {
    useNube.getState().cambiar({ estado: 'sin-conexion' })
  }
}

/** Crea el hogar en la nube con todo lo que ya hay en este dispositivo. */
export async function activarNube() {
  const clave = claveAleatoria()
  const buzon = claveAleatoria()
  await rpc('crear_hogar', { p_clave: clave, p_buzon: buzon })
  const todas = Object.keys(useTeselas.getState().regs).filter((k) => !k.startsWith('local:'))
  useNube.getState().cambiar({ clave, buzon, seq: 0, pendientes: todas })
  await sincronizar()
}

/** Une este dispositivo a un hogar existente (al abrir el enlace del QR). */
export async function unirse(clave: string) {
  const todas = Object.keys(useTeselas.getState().regs).filter((k) => !k.startsWith('local:'))
  useNube.getState().cambiar({ clave, seq: 0, pendientes: todas })
  await sincronizar()
}

export function desconectar() {
  useNube.getState().cambiar({ clave: null, buzon: null, seq: 0, pendientes: [], estado: 'apagada' })
}

/** Arranca la sincronización: al abrir, al volver a la app, cada pocos minutos y tras cada cambio. */
export function iniciarNube() {
  const dejarDeVigilar = vigilarCambios()
  if (useNube.getState().clave) programar(300)
  const alVolver = () => document.visibilityState === 'visible' && programar(200)
  document.addEventListener('visibilitychange', alVolver)
  window.addEventListener('online', alVolver)
  const intervalo = window.setInterval(() => document.visibilityState === 'visible' && void sincronizar(), 120_000)
  return () => {
    dejarDeVigilar()
    document.removeEventListener('visibilitychange', alVolver)
    window.removeEventListener('online', alVolver)
    window.clearInterval(intervalo)
  }
}

// ── Buzón (la página de Ray) ─────────────────────────────────

export const buzon = {
  listar: (b: string) => rpc<Nota[]>('notas_del_buzon', { p_buzon: b }),
  dejar: (b: string, texto: string) => rpc<string>('dejar_nota', { p_buzon: b, p_texto: texto }),
  borrar: (b: string, id: string) => rpc<void>('borrar_nota', { p_buzon: b, p_id: id }),
}
