import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useMemo } from 'react'
import { progreso, totalTeselas } from '../store/derivados'
import { useTeselas } from '../store/estado'
import { useUI } from '../store/ui'
import { Mosaico } from './Mosaico'

export function Aviso() {
  const aviso = useUI((s) => s.aviso)
  const quitar = useUI((s) => s.quitarAviso)
  const recien = useUI((s) => s.recien)
  const hayCapa = useUI((s) => s.capa !== null)
  const regs = useTeselas((s) => s.regs)
  const p = useMemo(() => progreso(totalTeselas(regs)), [regs])
  const conTesela = Boolean(aviso?.deshacer && recien && recien.cuadroId === p.cuadro.id && Date.now() - recien.ts < 4000)

  useEffect(() => {
    if (!aviso) return
    const id = window.setTimeout(quitar, 4200)
    return () => window.clearTimeout(id)
  }, [aviso, quitar])

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-[84px] z-[25] flex justify-center px-4" aria-live="polite">
      <AnimatePresence>
        {aviso && !hayCapa && (
          <motion.div
            key={aviso.id}
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8 }}
            className={`pointer-events-auto flex items-center gap-3 rounded-full border border-borde-fuerte bg-fondo-2 py-2 pr-2 shadow-[var(--sombra)] ${conTesela ? 'pl-2' : 'pl-4'}`}
          >
            {conTesela && recien && (
              <Mosaico cuadro={p.cuadro} descubiertas={p.descubiertas} recien={recien.indice} mini className="w-9 shrink-0" redondeo="rounded-full" />
            )}
            <span className="titulo text-[16px]">{aviso.texto}</span>
            {aviso.deshacer && (
              <button
                type="button"
                onClick={() => {
                  aviso.deshacer?.()
                  quitar()
                }}
                className="rounded-full px-3 py-1 text-[13px] font-semibold text-tinta-3 hover:text-tinta"
              >
                Deshacer
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
