import { motion } from 'motion/react'
import { useMemo } from 'react'
import { imagenDe, miniDe, teselasDe, type Cuadro } from '../data/cuadros'
import { hash } from '../lib/azar'
import { Motivo } from './Motivo'

interface Props {
  cuadro: Cuadro
  descubiertas: number[]
  /** índice de la tesela que se acaba de descubrir (se anima) */
  recien?: number | null
  completo?: boolean
  mini?: boolean
  className?: string
  redondeo?: string
}

export function Mosaico({ cuadro, descubiertas, recien, completo, mini, className = '', redondeo = 'rounded-2xl' }: Props) {
  const vistas = useMemo(() => new Set(descubiertas), [descubiertas])
  const n = teselasDe(cuadro)
  // Cada tesela tiene su motivo (o ninguno), siempre el mismo para el mismo cuadro
  const motivos = useMemo(
    () =>
      Array.from({ length: n }, (_, i) => {
        const h = hash(`${cuadro.id}:${i}`)
        return h % 8 < 5 ? h % 5 : -1
      }),
    [cuadro.id, n],
  )

  return (
    <div
      className={`relative overflow-hidden bg-fondo-2 ${redondeo} ${className}`}
      style={{ aspectRatio: String(cuadro.ratio) }}
      role="img"
      aria-label={completo ? cuadro.titulo : `${cuadro.titulo}: ${descubiertas.length} de ${n} teselas descubiertas`}
    >
      <img src={mini ? miniDe(cuadro) : imagenDe(cuadro)} alt="" className="absolute inset-0 h-full w-full object-cover" draggable={false} />
      {!completo && (
        <div className="absolute inset-0 grid" style={{ gridTemplateColumns: `repeat(${cuadro.cols}, 1fr)`, gridTemplateRows: `repeat(${cuadro.filas}, 1fr)` }}>
          {Array.from({ length: n }, (_, i) => {
            const fondo = { backgroundSize: '260% 260%', backgroundPosition: `${(i * 37) % 100}% ${(i * 53) % 100}%` }
            const motivo = !mini && motivos[i] >= 0 ? <Motivo n={motivos[i]} /> : null
            if (i === recien) {
              return (
                <div key={i} className="relative">
                  <motion.div className="tesela absolute inset-0" style={fondo} initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ duration: 0.35, delay: 0.25 }}>
                    {motivo}
                  </motion.div>
                  <motion.div
                    className="hoja-oro absolute inset-0"
                    initial={{ opacity: 0, scale: 1 }}
                    animate={{ opacity: [0, 1, 1, 0], scale: [1, 1.08, 1.08, 1] }}
                    transition={{ duration: 1.7, delay: 0.2, times: [0, 0.18, 0.5, 1], ease: 'easeInOut' }}
                  />
                </div>
              )
            }
            if (vistas.has(i)) return <div key={i} className={mini ? '' : 'junta'} />
            return (
              <div key={i} className="tesela" style={fondo}>
                {motivo}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
