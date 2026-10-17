import { ExternalLink, Play } from 'lucide-react'
import { motion } from 'motion/react'
import { Capa } from '../components/Capa'
import { Motivo } from '../components/Motivo'
import { ETIQUETA_TIPO } from '../data/sorpresas'
import { abrirEnlace, urlMusica, type ServicioMusica } from '../lib/enlaces'
import { desdeIso } from '../lib/fecha'
import { ventanitaDeHoy } from '../store/derivados'
import { useValor } from '../store/estado'
import { useResumen } from '../store/hooks'
import { useNube } from '../lib/nube'

export function VentanitaAbierta({ alCerrar }: { alCerrar: () => void }) {
  const r = useResumen()
  const servicio = useValor<ServicioMusica>('cfg:musica', 'youtube')
  const notas = useNube((n) => n.notas)
  const { sorpresa: s } = ventanitaDeHoy(r.regs, r.hoy, notas)
  const dia = desdeIso(r.hoy).getDate()
  const esNota = s.tipo === 'nota'

  return (
    <Capa etiqueta="Ventanita de hoy" alCerrar={alCerrar}>
      <div className="px-5 pt-8 pb-8">
        <div className="relative mx-auto w-full max-w-[340px]" style={{ perspective: 900 }}>
          {/* Lo de dentro */}
          <div className={`rounded-2xl border px-5 pt-6 pb-6 ${esNota ? 'border-amapola/40 bg-[#fbf3e6] text-[#3a2a1c]' : 'border-borde-fuerte bg-tarjeta'}`}>
            <p className={`text-[12px] font-bold tracking-wider uppercase ${esNota ? 'text-amapola' : 'text-oro'}`}>{ETIQUETA_TIPO[s.tipo]}</p>
            <div className="mt-3 text-[44px] leading-none" aria-hidden>
              {s.emoji}
            </div>
            <h2 className="titulo mt-3 text-[26px] leading-tight">{s.titulo}</h2>
            <p className={`mt-2.5 text-[17px] leading-relaxed ${esNota ? 'titulo text-[20px] italic' : 'text-tinta-2'}`}>{s.texto}</p>
            {s.musica && (
              <button type="button" onClick={() => void abrirEnlace(urlMusica(s.musica!, servicio))} className="boton-oro mt-5 flex items-center gap-2 rounded-full px-5 py-2.5 text-[15px] font-bold">
                <Play size={16} fill="currentColor" /> Escucharla
              </button>
            )}
            {s.enlace && (
              <button
                type="button"
                onClick={() => void abrirEnlace(s.enlace!.url)}
                className="mt-5 flex items-center gap-2 rounded-full border border-borde-fuerte px-5 py-2.5 text-[15px] font-semibold text-oro"
              >
                <ExternalLink size={16} /> {s.enlace.etiqueta}
              </button>
            )}
          </div>

          {/* Las dos puertitas, que se abren */}
          <div className="pointer-events-none absolute inset-0 flex">
            {[0, 1].map((lado) => (
              <motion.div
                key={lado}
                className="hoja-oro relative h-full w-1/2 border border-oro-oscuro/50"
                style={{
                  transformOrigin: lado === 0 ? 'left center' : 'right center',
                  borderRadius: lado === 0 ? '16px 0 0 16px' : '0 16px 16px 0',
                  backgroundSize: '200% 200%',
                  backgroundPosition: lado === 0 ? '0% 0%' : '100% 100%',
                }}
                initial={{ rotateY: 0 }}
                animate={{ rotateY: lado === 0 ? -112 : 112, opacity: [1, 1, 0] }}
                transition={{ duration: 1.25, delay: 0.25, ease: [0.5, 0, 0.2, 1], opacity: { duration: 1.25, delay: 0.25, times: [0, 0.75, 1] } }}
              >
                <Motivo n={lado === 0 ? 0 : 3} className="absolute inset-[30%] h-[40%] w-[40%] text-[#6e4c0e]/45" />
                {lado === 0 && <span className="titulo absolute right-2 bottom-3 text-[28px] font-semibold text-sobre-oro/80">{dia}</span>}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </Capa>
  )
}
