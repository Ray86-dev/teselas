// Azar con semilla: el mismo resultado en el portátil y en el móvil.

export function hash(texto: string): number {
  let h = 2166136261
  for (let i = 0; i < texto.length; i++) {
    h ^= texto.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

export function generador(semilla: number) {
  let a = semilla >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function barajar<T>(lista: readonly T[], semilla: string): T[] {
  const r = generador(hash(semilla))
  const out = [...lista]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

export function elegir<T>(lista: readonly T[], semilla: string): T {
  return lista[hash(semilla) % lista.length]
}

/** Aleatorio de verdad, para cosas sin importancia (frases al marcar). */
export const alAzar = <T,>(lista: readonly T[]): T => lista[Math.floor(Math.random() * lista.length)]
