import { Check, Play, Timer, Wind, ExternalLink } from 'lucide-react'
import { motion } from 'motion/react'
import type { Cosita } from '../data/cositas'
import { alAzar } from '../lib/azar'
import { abrirEnlace, urlMusica, type ServicioMusica } from '../lib/enlaces'
import { alternar } from '../store/acciones'
import { useValor } from '../store/estado'
import { useUI } from '../store/ui'

interface Props {
  cosita: Cosita
  hecha: boolean
  compacta?: boolean
}

export function TarjetaCosita({ cosita, hecha, compacta }: Props) {
  const abrir = useUI((s) => s.abrir)
  const servicio = useValor<ServicioMusica>('cfg:musica', 'youtube')
  const a = cosita.accion

  const lanzar = () => {
    if (!a) return
    if (a.tipo === 'enlace') void abrirEnlace(a.url)
    if (a.tipo === 'musica') void abrirEnlace(urlMusica(alAzar(a.canciones), servicio))
    if (a.tipo === 'respirar') abrir({ tipo: 'respirar', cositaId: cosita.id })
    if (a.tipo === 'temporizador') abrir({ tipo: 'temporizador', cositaId: cosita.id })
  }

  const etiquetaAccion =
    a?.tipo === 'respirar' ? 'Empezar' : a?.tipo === 'temporizador' ? `${a.minutos} min` : a?.tipo === 'enlace' || a?.tipo === 'musica' ? a.etiqueta : null
  const IconoAccion = a?.tipo === 'respirar' ? Wind : a?.tipo === 'temporizador' ? Timer : a?.tipo === 'musica' ? Play : ExternalLink

  return (
    <motion.div
      layout
      className={`group relative flex items-center gap-3 rounded-2xl border px-3 transition-colors ${
        compacta ? 'py-2.5' : 'py-3'
      } ${hecha ? 'border-borde-fuerte bg-tarjeta-hecha' : 'border-borde bg-tarjeta'}`}
    >
      <button
        type="button"
        onClick={() => alternar(cosita.id)}
        className="absolute inset-0 rounded-2xl"
        aria-pressed={hecha}
        aria-label={hecha ? `${cosita.titulo}: hecho. Pulsa para desmarcar.` : `Marcar como hecho: ${cosita.titulo}`}
      />
      <span
        className={`pointer-events-none grid size-11 shrink-0 place-items-center rounded-full text-[22px] ring-1 transition-all ${
          hecha ? 'hoja-oro ring-oro-claro' : 'bg-fondo-2 ring-borde-fuerte'
        }`}
        aria-hidden
      >
        {cosita.emoji}
      </span>
      <span className="pointer-events-none min-w-0 flex-1">
        <span className="block leading-snug font-semibold">{cosita.titulo}</span>
        {!compacta && (hecha || cosita.pista) && <span className="block text-[14px] leading-snug text-tinta-3">{hecha ? 'Hecho ✦' : cosita.pista}</span>}
        {etiquetaAccion && !hecha && (
          <button
            type="button"
            onClick={lanzar}
            className="pointer-events-auto relative z-10 mt-2 inline-flex items-center gap-1.5 rounded-full border border-borde-fuerte bg-fondo-2 px-3 py-1 text-[13px] font-semibold text-oro hover:bg-tarjeta-hecha"
          >
            <IconoAccion size={14} strokeWidth={2.4} />
            {etiquetaAccion}
          </button>
        )}
      </span>
      <span
        className={`pointer-events-none grid size-8 shrink-0 place-items-center rounded-full border-2 transition-all ${
          hecha ? 'border-oro bg-oro text-sobre-oro' : 'border-borde-fuerte text-transparent'
        }`}
        aria-hidden
      >
        <motion.span initial={false} animate={{ scale: hecha ? 1 : 0.4, opacity: hecha ? 1 : 0 }} transition={{ type: 'spring', stiffness: 500, damping: 22 }}>
          <Check size={18} strokeWidth={3} />
        </motion.span>
      </span>
    </motion.div>
  )
}
