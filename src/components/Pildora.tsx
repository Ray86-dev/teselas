import { ChevronUp } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { arrastrar, cambiarModo } from '../lib/escritorio'
import { NOMBRE } from '../personal'
import { cositaPorId } from '../store/derivados'
import { useResumen } from '../store/hooks'
import { useLocal } from '../store/local'
import { formatoReloj } from '../store/temporizador'
import { useUI } from '../store/ui'
import { Mosaico } from './Mosaico'

/** La ventana en pequeñito: se arrastra a donde quiera y, con un toque, se abre. */
export function Pildora() {
  const r = useResumen()
  const t = useUI((s) => s.temporizador)
  const recien = useUI((s) => s.recien)
  const cambiar = useLocal((s) => s.cambiar)
  const inicio = useRef<{ x: number; y: number } | null>(null)
  const arrastrando = useRef(false)
  const [, setTic] = useState(0)

  useEffect(() => {
    if (!t) return
    const id = window.setInterval(() => setTic((n) => n + 1), 1000)
    return () => window.clearInterval(id)
  }, [t])

  const abrir = async () => {
    cambiar({ modo: 'panel' })
    await cambiarModo('panel')
  }

  const p = r.progreso
  const recienAqui = recien && recien.cuadroId === p.cuadro.id && Date.now() - recien.ts < 4000 ? recien.indice : null
  const cositaT = t ? cositaPorId(r.regs, t.cositaId) : null

  let linea1: string
  let linea2: string
  if (t && cositaT) {
    linea1 = `⏳ ${formatoReloj(t.fin - Date.now())}`
    linea2 = cositaT.titulo
  } else if (r.activas.length > 0 && r.hechasDeLista === r.activas.length) {
    linea1 = 'Hoy, todo hecho ✦'
    linea2 = `${p.cuadro.titulo} · ${p.puestas}/${p.total}`
  } else if (r.hechasDeLista > 0) {
    linea1 = `${r.hechasDeLista} de ${r.activas.length} cositas ✦`
    linea2 = 'Toca para abrir'
  } else {
    linea1 = `Hola, ${NOMBRE}`
    linea2 = r.activas.length ? 'Una cosita, cuando quieras' : 'Toca para abrir'
  }

  return (
    <div className="h-full p-1.5">
      <div
        role="button"
        tabIndex={0}
        aria-label="Abrir Teselas"
        onPointerDown={(e) => {
          if (e.button !== 0) return
          inicio.current = { x: e.clientX, y: e.clientY }
          arrastrando.current = false
        }}
        onPointerMove={(e) => {
          if (!inicio.current || arrastrando.current) return
          if (Math.hypot(e.clientX - inicio.current.x, e.clientY - inicio.current.y) > 4) {
            arrastrando.current = true
            inicio.current = null
            void arrastrar()
          }
        }}
        onPointerUp={() => {
          if (inicio.current && !arrastrando.current) void abrir()
          inicio.current = null
        }}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && void abrir()}
        className="flex h-full cursor-pointer items-center gap-3 rounded-full border border-borde-fuerte bg-fondo pr-4 pl-2 shadow-[0_4px_14px_rgb(0_0_0/0.35)] select-none"
      >
        <Mosaico cuadro={p.cuadro} descubiertas={p.descubiertas} recien={recienAqui} mini className="h-[60px] shrink-0" redondeo="rounded-full" />
        <span className="min-w-0 flex-1">
          <span className="titulo block truncate text-[17px] leading-tight">{linea1}</span>
          <span className="block truncate text-[13px] text-tinta-3">{linea2}</span>
        </span>
        <ChevronUp size={18} className="shrink-0 text-tinta-3" />
      </div>
    </div>
  )
}
