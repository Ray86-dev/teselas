import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Modo } from '../lib/escritorio'

/** Preferencias que solo tienen sentido en este dispositivo (no se sincronizan). */
interface EstadoLocal {
  modo: Modo
  encima: boolean
  avisoBandeja: boolean
  ultimoRecordatorio: string | null
  cambiar: (p: Partial<Omit<EstadoLocal, 'cambiar'>>) => void
}

export const useLocal = create<EstadoLocal>()(
  persist(
    (set) => ({
      modo: 'panel',
      encima: true,
      avisoBandeja: false,
      ultimoRecordatorio: null,
      cambiar: (p) => set(p),
    }),
    { name: 'teselas-local', version: 1 },
  ),
)
