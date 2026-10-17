import { Minimize2, Settings2, X } from 'lucide-react'
import type { ReactNode } from 'react'
import { cambiarModo, enEscritorio, esconder } from '../lib/escritorio'
import { useLocal } from '../store/local'
import { useUI } from '../store/ui'

interface Props {
  titulo: ReactNode
  subtitulo?: ReactNode
  ajustes?: boolean
}

const arrastre = enEscritorio ? { 'data-tauri-drag-region': true } : {}

export function Cabecera({ titulo, subtitulo, ajustes = true }: Props) {
  const irA = useUI((s) => s.irA)
  const cambiar = useLocal((s) => s.cambiar)

  const aPildora = async () => {
    cambiar({ modo: 'pildora' })
    await cambiarModo('pildora')
  }

  return (
    <header {...arrastre} className="relative z-10 flex shrink-0 items-start gap-2 px-5 pt-[max(18px,env(safe-area-inset-top))] pb-3">
      <div {...arrastre} className="min-w-0 flex-1 select-none">
        <h1 {...arrastre} className="titulo text-[27px] leading-tight">
          {titulo}
        </h1>
        {subtitulo && (
          <p {...arrastre} className="mt-0.5 text-[15px] text-tinta-3 first-letter:uppercase">
            {subtitulo}
          </p>
        )}
      </div>
      <div className="-mr-2 flex items-center">
        {ajustes && (
          <button type="button" onClick={() => irA('ajustes')} className="grid size-10 place-items-center rounded-full text-tinta-3 hover:bg-tarjeta hover:text-tinta" aria-label="Ajustes">
            <Settings2 size={20} />
          </button>
        )}
        {enEscritorio && (
          <>
            <button type="button" onClick={aPildora} className="grid size-10 place-items-center rounded-full text-tinta-3 hover:bg-tarjeta hover:text-tinta" aria-label="Hacer pequeñita" title="Hacer pequeñita">
              <Minimize2 size={19} />
            </button>
            <button type="button" onClick={() => void esconder()} className="grid size-10 place-items-center rounded-full text-tinta-3 hover:bg-tarjeta hover:text-tinta" aria-label="Esconder" title="Esconder (sigue junto al reloj)">
              <X size={20} />
            </button>
          </>
        )}
      </div>
    </header>
  )
}
