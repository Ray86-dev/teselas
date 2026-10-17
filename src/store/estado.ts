import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/**
 * Todo el estado de Teselas es un diccionario de «registros»: clave → { valor, momento }.
 * Así, al sincronizar portátil y móvil, cada clave se queda con su versión más reciente
 * y nunca se pierde nada de lo hecho en ninguno de los dos.
 *
 * Claves:
 *   h:2026-10-16:agua   → true/false   cosita hecha ese día
 *   c:2026-10-16        → Cielo        cómo estaba el cielo
 *   v:2026-10-16        → id           ventanita abierta ese día
 *   a:agua              → Activa       cosita elegida (o retirada)
 *   x:mi-cosita         → Cosita|null  cosita propia
 *   cfg:*               → ajustes que viajan entre dispositivos
 *   local:*             → ajustes solo de este dispositivo (no se sincronizan)
 */
export interface Reg {
  v: unknown
  t: number
  d: string
}

interface EstadoTeselas {
  regs: Record<string, Reg>
  dispositivo: string
  poner: (cambios: Record<string, unknown>) => void
  fusionar: (remotos: Record<string, Reg>) => void
  reemplazar: (regs: Record<string, Reg>) => void
}

const nuevoDispositivo = () => Math.random().toString(36).slice(2, 10)

export const useTeselas = create<EstadoTeselas>()(
  persist(
    (set, get) => ({
      regs: {},
      dispositivo: nuevoDispositivo(),
      poner: (cambios) => {
        const { regs, dispositivo } = get()
        let t = Date.now()
        // garantiza que un cambio nuevo siempre gana a uno anterior de este mismo dispositivo
        for (const k of Object.keys(cambios)) if (regs[k] && regs[k].t >= t) t = regs[k].t + 1
        const nuevos = { ...regs }
        for (const [k, v] of Object.entries(cambios)) nuevos[k] = { v, t, d: dispositivo }
        set({ regs: nuevos })
      },
      fusionar: (remotos) => {
        const regs = { ...get().regs }
        let cambia = false
        for (const [k, r] of Object.entries(remotos)) {
          if (k.startsWith('local:')) continue
          const l = regs[k]
          if (!l || r.t > l.t || (r.t === l.t && r.d > l.d)) {
            regs[k] = r
            cambia = true
          }
        }
        if (cambia) set({ regs })
      },
      reemplazar: (regs) => set({ regs }),
    }),
    { name: 'teselas', version: 1 },
  ),
)

export function leer<T>(regs: Record<string, Reg>, clave: string, porDefecto: T): T {
  const r = regs[clave]
  return r === undefined || r.v === undefined ? porDefecto : (r.v as T)
}

/** Atajo para leer un valor reactivo desde un componente. */
export function useValor<T>(clave: string, porDefecto: T): T {
  return useTeselas((s) => leer(s.regs, clave, porDefecto))
}

export const poner = (cambios: Record<string, unknown>) => useTeselas.getState().poner(cambios)
