import { Check } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { Mosaico } from '../components/Mosaico'
import { COSITAS_POR_ID, SEMILLAS_INICIO } from '../data/cositas'
import { CUADROS } from '../data/cuadros'
import { enEscritorio } from '../lib/escritorio'
import { DEDICATORIA, NOMBRE } from '../personal'
import { empezar } from '../store/acciones'
import { ordenTeselas } from '../store/derivados'

const arrastre = enEscritorio ? { 'data-tauri-drag-region': true } : {}
const BESO = CUADROS[0]
const DEMO = ordenTeselas(BESO, 1).slice(0, 4)

export function Bienvenida() {
  const [paso, setPaso] = useState(0)
  const [elegidas, setElegidas] = useState<string[]>([])

  const alternar = (id: string) =>
    setElegidas((e) => (e.includes(id) ? e.filter((x) => x !== id) : e.length >= 3 ? e : [...e, id]))

  return (
    <div className="ornamento-fondo relative flex h-full flex-col">
      <div {...arrastre} className="h-8 shrink-0" />
      <AnimatePresence mode="wait">
        <motion.div
          key={paso}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="desplazable relative flex flex-1 flex-col px-6 pb-6"
        >
          {paso === 0 && (
            <div className="flex flex-1 flex-col justify-center">
              <p className="titulo text-[44px] leading-none">Hola, {NOMBRE}.</p>
              <p className="titulo mt-5 text-[22px] leading-snug text-oro">{DEDICATORIA}</p>
              <p className="mt-5 text-[18px] leading-relaxed text-tinta-2">Aquí no hay prisas, ni rachas que se rompen, ni deberes.</p>
              <p className="mt-2 text-[18px] leading-relaxed text-tinta-2">Solo cositas pequeñas, a tu ritmo.</p>
              <BotonPaso onClick={() => setPaso(1)}>Vale</BotonPaso>
              {!enEscritorio && (
                <p className="mt-10 text-[13px] leading-snug text-tinta-3">
                  ¿Ya usas Teselas en el portátil? Abre allí Ajustes → «Llevar Teselas al móvil» y escanea el código con la cámara.
                </p>
              )}
            </div>
          )}

          {paso === 1 && (
            <div className="flex flex-1 flex-col justify-center">
              <div className="mx-auto w-[min(78%,300px)] rounded-[18px] border border-borde-fuerte bg-fondo-2 p-2 shadow-[var(--sombra)]">
                <Mosaico cuadro={BESO} descubiertas={DEMO} redondeo="rounded-xl" />
              </div>
              <p className="mt-7 text-[19px] leading-relaxed text-tinta-2">
                Cada cosita que hagas <span className="text-oro">descubre una tesela</span>.
              </p>
              <p className="mt-2 text-[19px] leading-relaxed text-tinta-2">
                Poco a poco irá apareciendo <span className="titulo text-tinta">«El beso»</span>.
              </p>
              <BotonPaso onClick={() => setPaso(2)}>Me encanta</BotonPaso>
            </div>
          )}

          {paso === 2 && (
            <div className="flex flex-1 flex-col">
              <p className="titulo text-[26px] leading-tight">Elige una cosita para empezar.</p>
              <p className="mt-1 text-[16px] text-tinta-2">Pequeñita. Si quieres, hasta tres.</p>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {SEMILLAS_INICIO.map((id) => {
                  const c = COSITAS_POR_ID[id]
                  const sel = elegidas.includes(id)
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => alternar(id)}
                      aria-pressed={sel}
                      className={`relative flex flex-col items-start gap-1 rounded-2xl border px-3 py-2.5 text-left transition-colors ${
                        sel ? 'border-oro bg-tarjeta-hecha' : 'border-borde bg-tarjeta hover:border-borde-fuerte'
                      }`}
                    >
                      <span className="text-[24px]" aria-hidden>
                        {c.emoji}
                      </span>
                      <span className="text-[15px] leading-snug font-semibold">{c.titulo}</span>
                      {sel && (
                        <span className="absolute top-2.5 right-2.5 grid size-6 place-items-center rounded-full bg-oro text-sobre-oro">
                          <Check size={14} strokeWidth={3} />
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
              <div className="mt-auto pt-4">
                <button
                  type="button"
                  disabled={elegidas.length === 0}
                  onClick={() => empezar(elegidas)}
                  className="boton-oro w-full rounded-full px-6 py-3.5 text-[17px] font-bold disabled:opacity-40 disabled:shadow-none"
                >
                  Empezar
                </button>
                <p className="mt-3 text-center text-[13px] text-tinta-3">Puedes cambiarlas cuando quieras.</p>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
      <div className="flex shrink-0 justify-center gap-2 pb-[max(16px,env(safe-area-inset-bottom))]" aria-hidden>
        {[0, 1, 2].map((i) => (
          <span key={i} className={`h-1.5 rounded-full transition-all ${i === paso ? 'w-6 bg-oro' : 'w-1.5 bg-borde-fuerte'}`} />
        ))}
      </div>
    </div>
  )
}

function BotonPaso({ onClick, children }: { onClick: () => void; children: string }) {
  return (
    <button type="button" onClick={onClick} className="boton-oro mt-10 self-start rounded-full px-8 py-3.5 text-[17px] font-bold">
      {children}
    </button>
  )
}
