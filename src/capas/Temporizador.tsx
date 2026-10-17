import { ExternalLink } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Capa } from '../components/Capa'
import { abrirEnlace } from '../lib/enlaces'
import { cositaPorId } from '../store/derivados'
import { useTeselas } from '../store/estado'
import { cancelarTemporizador, completarTemporizador, formatoReloj, iniciarTemporizador } from '../store/temporizador'
import { useUI } from '../store/ui'

export function Temporizador({ cositaId, alCerrar }: { cositaId: string; alCerrar: () => void }) {
  const cosita = useTeselas((s) => cositaPorId(s.regs, cositaId))
  const t = useUI((s) => s.temporizador)
  const [ahora, setAhora] = useState(Date.now())
  const accion = cosita?.accion?.tipo === 'temporizador' ? cosita.accion : null

  useEffect(() => {
    const actual = useUI.getState().temporizador
    if (accion && (!actual || actual.cositaId !== cositaId)) iniciarTemporizador(cositaId, accion.minutos)
  }, [accion, cositaId])

  useEffect(() => {
    const id = window.setInterval(() => setAhora(Date.now()), 250)
    return () => window.clearInterval(id)
  }, [])

  if (!cosita || !accion) return null
  const total = (t?.fin ?? 0) - (t?.inicio ?? 0) || accion.minutos * 60_000
  const restante = t ? t.fin - ahora : total
  const fraccion = Math.min(1, Math.max(0, 1 - restante / total))
  const R = 108
  const C = 2 * Math.PI * R

  return (
    <Capa etiqueta={cosita.titulo} alCerrar={alCerrar} variante="pantalla">
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-10 text-center">
        <span className="text-[34px]" aria-hidden>
          {cosita.emoji}
        </span>
        <h2 className="titulo mt-2 text-[24px] leading-tight">{cosita.titulo}</h2>

        <div className="relative mt-8 grid size-60 place-items-center">
          <svg viewBox="0 0 240 240" className="absolute inset-0 -rotate-90" aria-hidden>
            <circle cx="120" cy="120" r={R} fill="none" stroke="var(--borde-fuerte)" strokeWidth="6" />
            <circle
              cx="120"
              cy="120"
              r={R}
              fill="none"
              stroke="var(--oro)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={C}
              strokeDashoffset={C * (1 - fraccion)}
              style={{ transition: 'stroke-dashoffset 0.3s linear' }}
            />
          </svg>
          <span className="titulo text-[54px] tabular-nums" aria-live="off">
            {formatoReloj(restante)}
          </span>
        </div>

        <p className="mt-6 max-w-[280px] text-[15px] leading-relaxed text-tinta-3">Puedes parar cuando quieras: lo que hagas ya cuenta.</p>

        {accion.enlace && (
          <button
            type="button"
            onClick={() => void abrirEnlace(accion.enlace!.url)}
            className="mt-5 flex items-center gap-2 rounded-full border border-borde-fuerte bg-tarjeta px-4 py-2 text-[14px] font-semibold text-oro"
          >
            <ExternalLink size={15} /> {accion.enlace.etiqueta}
          </button>
        )}

        <div className="mt-8 flex flex-col items-center gap-2">
          <button type="button" onClick={() => completarTemporizador()} className="boton-oro rounded-full px-7 py-3 text-[16px] font-bold">
            Ya está
          </button>
          <button
            type="button"
            onClick={() => {
              cancelarTemporizador()
              alCerrar()
            }}
            className="rounded-full px-4 py-2 text-[14px] font-semibold text-tinta-3 hover:text-tinta-2"
          >
            Mejor en otro momento
          </button>
        </div>
      </div>
    </Capa>
  )
}
