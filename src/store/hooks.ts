import { useEffect, useMemo, useState } from 'react'
import { fechaLogica } from '../lib/fecha'
import { activas, diasActivos, hechasDe, peldanoAlcanzado, progreso, totalTeselas } from './derivados'
import { useTeselas } from './estado'

/** La fecha lógica de hoy; se actualiza sola si la app sigue abierta al cambiar el día. */
export function useHoy(): string {
  const [hoy, setHoy] = useState(fechaLogica)
  useEffect(() => {
    const id = window.setInterval(() => setHoy(fechaLogica()), 30_000)
    const alVolver = () => setHoy(fechaLogica())
    document.addEventListener('visibilitychange', alVolver)
    return () => {
      window.clearInterval(id)
      document.removeEventListener('visibilitychange', alVolver)
    }
  }, [])
  return hoy
}

export function useRegs() {
  return useTeselas((s) => s.regs)
}

export function useResumen() {
  const regs = useRegs()
  const hoy = useHoy()
  return useMemo(() => {
    const total = totalTeselas(regs)
    const dias = diasActivos(regs)
    const lista = activas(regs)
    const hechas = hechasDe(regs, hoy)
    return {
      hoy,
      regs,
      total,
      dias,
      peldano: peldanoAlcanzado(dias.length),
      activas: lista,
      hechas,
      hechasDeLista: lista.filter((a) => hechas.has(a.cosita.id)).length,
      progreso: progreso(total),
    }
  }, [regs, hoy])
}
