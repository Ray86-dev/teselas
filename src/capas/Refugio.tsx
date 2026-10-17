import { CloudLightning, MessageCircleHeart, Phone } from 'lucide-react'
import { Capa } from '../components/Capa'
import { TarjetaCosita } from '../components/TarjetaCosita'
import { REFUGIO } from '../data/cositas'
import { abrirEnlace } from '../lib/enlaces'
import { PAREJA } from '../personal'
import { useValor } from '../store/estado'
import { useResumen } from '../store/hooks'

function enlaceWhatsApp(numero: string) {
  let digitos = numero.replace(/\D/g, '')
  if (digitos.length === 9) digitos = `34${digitos}`
  return `https://wa.me/${digitos}?text=${encodeURIComponent('¿Me das un abrazo?')}`
}

export function Refugio({ alCerrar }: { alCerrar: () => void }) {
  const r = useResumen()
  const whatsapp = useValor('cfg:whatsapp', '')

  return (
    <Capa etiqueta="Refugio" alCerrar={alCerrar}>
      <div className="px-5 pt-7 pb-7">
        <CloudLightning className="text-azul" size={30} strokeWidth={1.8} />
        <h2 className="titulo mt-3 text-[28px] leading-tight">Hoy es día de refugio.</h2>
        <p className="mt-2 text-[17px] leading-relaxed text-tinta-2">No hace falta hacer nada más. Si te apetece algo diminuto, cuenta como tesela igual.</p>

        <div className="mt-5 space-y-2">
          {REFUGIO.map((c) => (
            <TarjetaCosita key={c.id} cosita={c} hecha={r.hechas.has(c.id)} compacta />
          ))}
        </div>

        {whatsapp ? (
          <button
            type="button"
            onClick={() => void abrirEnlace(enlaceWhatsApp(whatsapp))}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-borde-fuerte bg-tarjeta px-4 py-3 font-semibold"
          >
            <MessageCircleHeart size={20} className="text-amapola" /> Pedirle un abrazo a {PAREJA}
          </button>
        ) : (
          <p className="mt-5 text-center text-[16px] text-tinta-2">Y si puedes, pídele un abrazo a {PAREJA}. 💛</p>
        )}

        <div className="mt-7 border-t border-borde pt-5">
          <p className="text-[14px] leading-relaxed text-tinta-3">
            Si sientes que es más que un mal día, puedes llamar al <strong className="text-tinta-2">024</strong>: es gratis, a cualquier hora, y al otro lado hay
            gente que sabe escuchar. Tu equipo médico también está para esto.
          </p>
          <a href="tel:024" className="mt-3 inline-flex items-center gap-2 rounded-full border border-borde-fuerte px-4 py-2 text-[14px] font-semibold text-tinta-2">
            <Phone size={16} /> Llamar al 024
          </a>
        </div>
      </div>
    </Capa>
  )
}
