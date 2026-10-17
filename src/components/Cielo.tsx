import { CloudLightning, CloudRain, CloudSun, Sun, type LucideIcon } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { CIELOS, type Cielo as TipoCielo } from '../data/frases'
import { ponerCielo } from '../store/acciones'

export const ICONOS_CIELO: Record<TipoCielo, LucideIcon> = {
  sol: Sun,
  nubes: CloudSun,
  lluvia: CloudRain,
  tormenta: CloudLightning,
}

const ORDEN: TipoCielo[] = ['sol', 'nubes', 'lluvia', 'tormenta']

export function Cielo({ actual }: { actual: TipoCielo | null }) {
  const [abierto, setAbierto] = useState(false)
  const mostrarSelector = !actual || abierto

  return (
    <div className="rounded-2xl border border-borde bg-tarjeta/60 px-3 py-2.5">
      <AnimatePresence mode="wait" initial={false}>
        {mostrarSelector ? (
          <motion.div key="selector" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
            <span className="flex-1 text-[15px] text-tinta-2">¿Cómo está tu cielo hoy?</span>
            <div className="flex gap-1" role="radiogroup" aria-label="Cómo está tu cielo hoy">
              {ORDEN.map((c) => {
                const Icono = ICONOS_CIELO[c]
                const sel = actual === c
                return (
                  <button
                    key={c}
                    type="button"
                    role="radio"
                    aria-checked={sel}
                    aria-label={CIELOS[c].nombre}
                    title={CIELOS[c].nombre}
                    onClick={() => {
                      ponerCielo(c)
                      setAbierto(false)
                    }}
                    className={`grid size-10 place-items-center rounded-full transition-colors ${
                      sel ? 'bg-oro text-sobre-oro' : 'text-tinta-2 hover:bg-fondo-2 hover:text-oro'
                    }`}
                  >
                    <Icono size={21} strokeWidth={1.9} />
                  </button>
                )
              })}
            </div>
          </motion.div>
        ) : (
          <motion.button
            key="elegido"
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setAbierto(true)}
            className="flex w-full items-center gap-2.5 text-left"
            aria-label={`Cielo de hoy: ${CIELOS[actual].nombre}. Pulsa para cambiarlo.`}
          >
            {(() => {
              const Icono = ICONOS_CIELO[actual]
              return <Icono size={20} className="text-oro" strokeWidth={1.9} />
            })()}
            <span className="flex-1 text-[15px] text-tinta-2">{CIELOS[actual].respuesta}</span>
            <span className="text-[13px] text-tinta-3">cambiar</span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}
