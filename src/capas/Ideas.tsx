import { Plus } from 'lucide-react'
import { Capa } from '../components/Capa'
import { PELDANOS } from '../data/cositas'
import { activar, posponerSugerencia } from '../store/acciones'
import { ideasParaAnadir } from '../store/derivados'
import { useResumen } from '../store/hooks'
import { useUI } from '../store/ui'

export function Ideas({ alCerrar }: { alCerrar: () => void }) {
  const r = useResumen()
  const avisar = useUI((s) => s.avisar)
  const irA = useUI((s) => s.irA)
  const ideas = ideasParaAnadir(r.regs, r.hoy)

  const anadir = (id: string) => {
    activar(id)
    posponerSugerencia()
    avisar('Plantada 🌱')
    alCerrar()
  }

  return (
    <Capa etiqueta="Ideas para añadir" alCerrar={alCerrar}>
      <div className="px-5 pt-7 pb-7">
        <h2 className="titulo text-[26px] leading-tight">¿Plantamos otra?</h2>
        <p className="mt-1 text-[16px] text-tinta-2">Tres ideas, por si alguna te llama. Si no, ninguna.</p>
        <div className="mt-5 space-y-2.5">
          {ideas.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => anadir(c.id)}
              className="flex w-full items-center gap-3 rounded-2xl border border-borde bg-tarjeta px-3 py-3 text-left hover:border-oro"
            >
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-fondo-2 text-[22px] ring-1 ring-borde-fuerte" aria-hidden>
                {c.emoji}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block leading-snug font-semibold">{c.titulo}</span>
                <span className="block text-[13px] text-tinta-3">
                  {PELDANOS[c.peldano].emoji} {PELDANOS[c.peldano].lema}
                </span>
              </span>
              <Plus className="shrink-0 text-oro" size={20} />
            </button>
          ))}
        </div>
        <div className="mt-5 flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              alCerrar()
              irA('escalera')
            }}
            className="rounded-full px-3 py-2 text-[14px] font-semibold text-oro"
          >
            Ver toda la escalera
          </button>
          <button
            type="button"
            onClick={() => {
              posponerSugerencia()
              alCerrar()
            }}
            className="rounded-full px-3 py-2 text-[14px] font-semibold text-tinta-3"
          >
            Ahora no
          </button>
        </div>
      </div>
    </Capa>
  )
}
