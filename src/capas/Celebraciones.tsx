import { motion } from 'motion/react'
import { Capa } from '../components/Capa'
import { Mosaico } from '../components/Mosaico'
import { PELDANOS, type Peldano } from '../data/cositas'
import { CUADROS } from '../data/cuadros'
import { abrirEnlace } from '../lib/enlaces'
import { fechaLogica } from '../lib/fecha'
import { NOMBRE } from '../personal'
import { diasActivos } from '../store/derivados'
import { poner, useTeselas } from '../store/estado'
import { useUI } from '../store/ui'

const MENSAJE_HITO: Record<Peldano, string> = {
  1: '',
  2: 'A partir de ahora te enseñaré ideas un poquito más grandes. Solo por si te apetecen.',
  3: 'Esto ya no es una semilla: es una planta que crece. Y la has regado tú.',
  4: 'Has llegado arriba del todo. Ahora toca disfrutar del jardín.',
}

export function Hito({ peldano, alCerrar }: { peldano: Peldano; alCerrar: () => void }) {
  const dias = useTeselas((s) => diasActivos(s.regs).length)
  const cerrar = () => {
    poner({ [`hito:${peldano}`]: fechaLogica() })
    alCerrar()
  }
  return (
    <Capa etiqueta={`Has llegado a ${PELDANOS[peldano].nombre}`} alCerrar={cerrar}>
      <div className="px-6 pt-10 pb-8 text-center">
        <motion.div initial={{ scale: 0.4, rotate: -12 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 260, damping: 14 }} className="text-[72px] leading-none">
          {PELDANOS[peldano].emoji}
        </motion.div>
        <h2 className="titulo mt-5 text-[30px] leading-tight">Has llegado a {PELDANOS[peldano].nombre}</h2>
        <p className="mt-3 text-[17px] leading-relaxed text-tinta-2">
          {dias} días cuidándote, {NOMBRE}. No seguidos, ni falta que hace.
        </p>
        <p className="mt-2 text-[16px] leading-relaxed text-tinta-3">{MENSAJE_HITO[peldano]}</p>
        <button type="button" onClick={cerrar} className="boton-oro mt-7 rounded-full px-8 py-3 text-[16px] font-bold">
          Gracias
        </button>
      </div>
    </Capa>
  )
}

export function CuadroCompleto({ cuadroId, celebrar, alCerrar }: { cuadroId: string; celebrar?: boolean; alCerrar: () => void }) {
  const irA = useUI((s) => s.irA)
  const cuadro = CUADROS.find((c) => c.id === cuadroId) ?? CUADROS[0]
  return (
    <Capa etiqueta={cuadro.titulo} alCerrar={alCerrar}>
      <div className="px-5 pt-8 pb-8">
        {celebrar && (
          <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-4 text-center text-[13px] font-bold tracking-[0.2em] text-oro uppercase">
            ✦ Cuadro completado ✦
          </motion.p>
        )}
        <motion.div
          initial={celebrar ? { scale: 0.92, opacity: 0 } : false}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          className="mx-auto rounded-[14px] bg-[linear-gradient(135deg,#f0d58c,#9e7a2e_60%,#e2c06a)] p-2 shadow-[0_20px_60px_-20px_rgb(217_180_90/0.7)]"
          style={{ width: `min(100%, calc(52vh * ${cuadro.ratio} + 16px))` }}
        >
          <Mosaico cuadro={cuadro} descubiertas={[]} completo redondeo="rounded-md" />
        </motion.div>
        <h2 className="titulo mt-5 text-center text-[26px] leading-tight">{cuadro.titulo}</h2>
        <p className="text-center text-[14px] text-tinta-3">
          Gustav Klimt · {cuadro.fecha}
          {cuadro.lugar ? ` · ${cuadro.lugar}` : ''}
        </p>
        <p className="mt-3 text-center text-[16px] leading-relaxed text-tinta-2">{cuadro.texto}</p>
        {celebrar ? (
          <>
            <p className="mt-4 text-center text-[16px] text-tinta-2">Ya cuelga en tu galería. El siguiente cuadro es una sorpresa.</p>
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={() => {
                  alCerrar()
                  irA('cuadro')
                }}
                className="boton-oro rounded-full px-7 py-3 text-[16px] font-bold"
              >
                Ver mi galería
              </button>
            </div>
          </>
        ) : (
          <div className="mt-5 flex justify-center">
            <button type="button" onClick={() => void abrirEnlace(cuadro.fuente)} className="text-[13px] text-tinta-3 underline underline-offset-4">
              Imagen en Wikimedia Commons
            </button>
          </div>
        )}
      </div>
    </Capa>
  )
}
