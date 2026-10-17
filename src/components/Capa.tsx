import { X } from 'lucide-react'
import { motion } from 'motion/react'
import { useEffect, type ReactNode } from 'react'

interface Props {
  etiqueta: string
  alCerrar: () => void
  children: ReactNode
  /** «hoja» sube desde abajo; «pantalla» ocupa todo */
  variante?: 'hoja' | 'pantalla'
  cerrable?: boolean
}

export function Capa({ etiqueta, alCerrar, children, variante = 'hoja', cerrable = true }: Props) {
  useEffect(() => {
    const tecla = (e: KeyboardEvent) => e.key === 'Escape' && cerrable && alCerrar()
    window.addEventListener('keydown', tecla)
    return () => window.removeEventListener('keydown', tecla)
  }, [alCerrar, cerrable])

  return (
    <div className="absolute inset-0 z-30 flex flex-col justify-end" role="dialog" aria-modal="true" aria-label={etiqueta}>
      <motion.div
        className="absolute inset-0 bg-[var(--velo)] backdrop-blur-[2px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={cerrable ? alCerrar : undefined}
      />
      <motion.div
        className={`desplazable relative flex flex-col bg-fondo ${
          variante === 'pantalla' ? 'h-full' : 'max-h-[92%] rounded-t-[26px] border-t border-borde-fuerte shadow-[var(--sombra)]'
        }`}
        initial={variante === 'pantalla' ? { opacity: 0 } : { y: '100%' }}
        animate={variante === 'pantalla' ? { opacity: 1 } : { y: 0 }}
        exit={variante === 'pantalla' ? { opacity: 0 } : { y: '100%' }}
        transition={{ type: 'spring', stiffness: 380, damping: 36 }}
      >
        {cerrable && (
          <button
            type="button"
            onClick={alCerrar}
            className="absolute top-3 right-3 z-10 grid size-10 place-items-center rounded-full text-tinta-3 hover:bg-tarjeta hover:text-tinta"
            aria-label="Cerrar"
          >
            <X size={20} />
          </button>
        )}
        {children}
      </motion.div>
    </div>
  )
}
