import { create } from 'zustand'
import type { Peldano } from '../data/cositas'

export type Pestana = 'hoy' | 'cuadro' | 'escalera' | 'ajustes'

export type Capa =
  | { tipo: 'refugio' }
  | { tipo: 'respirar'; cositaId: string }
  | { tipo: 'temporizador'; cositaId: string }
  | { tipo: 'ventanita' }
  | { tipo: 'ideas' }
  | { tipo: 'nueva' }
  | { tipo: 'hito'; peldano: Peldano }
  | { tipo: 'cuadro-completo'; cuadroId: string; vuelta: number; celebrar?: boolean }

export interface Aviso {
  id: number
  texto: string
  deshacer?: () => void
}

export interface Temporizador {
  cositaId: string
  minutos: number
  inicio: number
  fin: number
  pausadoEn?: number
}

interface EstadoUI {
  pestana: Pestana
  capa: Capa | null
  aviso: Aviso | null
  /** tesela recién puesta, para animarla */
  recien: { indice: number; cuadroId: string; ts: number } | null
  temporizador: Temporizador | null
  irA: (p: Pestana) => void
  abrir: (c: Capa) => void
  cerrar: () => void
  avisar: (texto: string, deshacer?: () => void) => void
  quitarAviso: () => void
}

let idAviso = 0

export const useUI = create<EstadoUI>()((set) => ({
  pestana: 'hoy',
  capa: null,
  aviso: null,
  recien: null,
  temporizador: null,
  irA: (pestana) => set({ pestana }),
  abrir: (capa) => set({ capa }),
  cerrar: () => set({ capa: null }),
  avisar: (texto, deshacer) => set({ aviso: { id: ++idAviso, texto, deshacer } }),
  quitarAviso: () => set({ aviso: null }),
}))
