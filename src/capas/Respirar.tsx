import { motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { Capa } from '../components/Capa'
import { Motivo } from '../components/Motivo'
import { campanitas } from '../lib/sonido'
import { marcar } from '../store/acciones'
import { leer, useTeselas } from '../store/estado'

const DENTRO = 4
const FUERA = 6
const CICLO = DENTRO + FUERA
const TOTAL = 60

export function Respirar({ cositaId, alCerrar }: { cositaId: string; alCerrar: () => void }) {
  const [inicio] = useState(() => Date.now())
  const [seg, setSeg] = useState(0)

  useEffect(() => {
    const id = window.setInterval(() => setSeg((Date.now() - inicio) / 1000), 200)
    return () => window.clearInterval(id)
  }, [inicio])

  const terminado = seg >= TOTAL
  useEffect(() => {
    if (!terminado) return
    if (leer(useTeselas.getState().regs, 'cfg:sonido', true)) campanitas()
    const id = window.setTimeout(() => {
      alCerrar()
      marcar(cositaId)
    }, 1600)
    return () => window.clearTimeout(id)
  }, [terminado, alCerrar, cositaId])

  const enCiclo = seg % CICLO
  const dentro = enCiclo < DENTRO
  const ciclo = Math.floor(seg / CICLO)

  const terminar = () => {
    alCerrar()
    marcar(cositaId)
  }

  return (
    <Capa etiqueta="Respirar un minuto" alCerrar={alCerrar} variante="pantalla">
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-10 text-center">
        <div className="relative grid size-64 place-items-center">
          <motion.div
            key={ciclo * 2 + (dentro ? 0 : 1)}
            className="hoja-oro absolute inset-0 rounded-full opacity-90 shadow-[0_0_60px_-10px_rgb(240_213_140/0.6)]"
            initial={{ scale: dentro ? 0.55 : 1 }}
            animate={{ scale: terminado ? 0.8 : dentro ? 1 : 0.55 }}
            transition={{ duration: dentro ? DENTRO : FUERA, ease: 'easeInOut' }}
          />
          <Motivo n={1} className="girar-lento relative size-24 text-oro-oscuro/50" />
        </div>
        <p className="titulo mt-10 text-[30px]" aria-live="polite">
          {terminado ? 'Hecho ✦' : dentro ? 'Toma aire…' : 'Suéltalo despacio…'}
        </p>
        <p className="mt-2 text-[15px] text-tinta-3">{terminado ? 'Un minuto solo para ti.' : `${Math.max(0, Math.ceil(TOTAL - seg))} segundos`}</p>
        {!terminado && (
          <button type="button" onClick={terminar} className="mt-10 rounded-full border border-borde-fuerte px-5 py-2.5 text-[15px] font-semibold text-tinta-2">
            Ya está, cuenta igual
          </button>
        )}
      </div>
    </Capa>
  )
}
