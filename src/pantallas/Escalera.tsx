import { Check, Plus, Trash2 } from 'lucide-react'
import { motion } from 'motion/react'
import { useState } from 'react'
import { Cabecera } from '../components/Cabecera'
import { COSITAS, MOMENTOS, PELDANOS, type Cosita, type Momento, type Peldano } from '../data/cositas'
import { activar, borrarCosita, cambiarMomento, desactivar } from '../store/acciones'
import { cositasPropias } from '../store/derivados'
import { useResumen } from '../store/hooks'
import { useUI } from '../store/ui'

const PELDANOS_ORDEN: Peldano[] = [1, 2, 3, 4]

export function Escalera() {
  const r = useResumen()
  const abrir = useUI((s) => s.abrir)
  const [abierto, setAbierto] = useState<Peldano | 0>(r.peldano)
  const activasIds = new Map(r.activas.map((a) => [a.cosita.id, a.momento]))
  const propias = cositasPropias(r.regs)
  const siguiente = r.peldano < 4 ? PELDANOS[(r.peldano + 1) as Peldano] : null
  const faltan = siguiente ? siguiente.dias - r.dias.length : 0

  return (
    <>
      <Cabecera titulo="Tu escalera" subtitulo="Se sube cuando apetece. Y también se puede bajar." />
      <div className="desplazable flex-1 px-4 pb-8">
        <div className="rounded-2xl border border-borde bg-tarjeta px-4 py-3">
          <p className="text-[14px] text-tinta-3">Ahora estás en</p>
          <p className="titulo text-[24px]">
            {PELDANOS[r.peldano].emoji} {PELDANOS[r.peldano].nombre}
          </p>
          {siguiente ? (
            <p className="mt-1 text-[14px] text-tinta-2">
              {faltan === 1 ? 'Un día más' : `${faltan} días más`} con alguna cosita y llegarás a {siguiente.nombre} {siguiente.emoji}. No hace falta que sean seguidos.
            </p>
          ) : (
            <p className="mt-1 text-[14px] text-tinta-2">Has llegado arriba del todo. Aquí ya se cultiva sin prisa.</p>
          )}
        </div>

        <p className="mt-5 px-1 text-[14px] text-tinta-3">
          Toca una cosita para añadirla a tu día o quitarla. Mejor pocas y amables: dos o tres están muy bien.
        </p>

        <div className="mt-3 space-y-2.5">
          {PELDANOS_ORDEN.map((pel) => {
            const lista = [...COSITAS.filter((c) => c.peldano === pel), ...propias.filter((c) => c.peldano === pel)]
            const elegidas = lista.filter((c) => activasIds.has(c.id)).length
            const esActual = pel === r.peldano
            const desplegado = abierto === pel
            return (
              <section key={pel} className={`overflow-hidden rounded-2xl border ${esActual ? 'border-oro/60' : 'border-borde'} bg-tarjeta/70`}>
                <button
                  type="button"
                  onClick={() => setAbierto(desplegado ? 0 : pel)}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left"
                  aria-expanded={desplegado}
                >
                  <span className="text-[24px]" aria-hidden>
                    {PELDANOS[pel].emoji}
                  </span>
                  <span className="flex-1">
                    <span className="titulo block text-[19px]">
                      {PELDANOS[pel].nombre}
                      {esActual && <span className="ml-2 align-middle text-[11px] font-bold tracking-wider text-oro uppercase">Tu peldaño</span>}
                    </span>
                    <span className="block text-[14px] text-tinta-3">{PELDANOS[pel].lema}</span>
                  </span>
                  {elegidas > 0 && <span className="rounded-full bg-oro px-2 py-0.5 text-[12px] font-bold text-sobre-oro">{elegidas}</span>}
                </button>
                {desplegado && (
                  <motion.ul initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-1.5 px-2.5 pb-3">
                    {lista.map((c) => (
                      <FilaCosita key={c.id} cosita={c} momento={activasIds.get(c.id) ?? null} />
                    ))}
                  </motion.ul>
                )}
              </section>
            )
          })}
        </div>

        <button
          type="button"
          onClick={() => abrir({ tipo: 'nueva' })}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-borde-fuerte px-4 py-3 text-[15px] font-semibold text-tinta-2 hover:border-oro hover:text-oro"
        >
          <Plus size={18} /> Crear una cosita mía
        </button>
      </div>
    </>
  )
}

function FilaCosita({ cosita, momento }: { cosita: Cosita; momento: Momento | null }) {
  const elegida = momento !== null
  return (
    <li className={`rounded-xl ${elegida ? 'bg-tarjeta-hecha' : ''}`}>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => (elegida ? desactivar(cosita.id) : activar(cosita.id))}
          className="flex min-w-0 flex-1 items-center gap-3 rounded-xl px-2 py-2 text-left"
          aria-pressed={elegida}
        >
          <span className="text-[21px]" aria-hidden>
            {cosita.emoji}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block leading-snug">{cosita.titulo}</span>
            {cosita.pista && <span className="block text-[13px] leading-snug text-tinta-3">{cosita.pista}</span>}
          </span>
          <span
            className={`grid size-7 shrink-0 place-items-center rounded-full border-2 ${elegida ? 'border-oro bg-oro text-sobre-oro' : 'border-borde-fuerte text-transparent'}`}
            aria-hidden
          >
            <Check size={15} strokeWidth={3} />
          </span>
        </button>
        {cosita.propia && (
          <button type="button" onClick={() => borrarCosita(cosita.id)} className="grid size-9 place-items-center rounded-full text-tinta-3 hover:text-amapola" aria-label={`Borrar ${cosita.titulo}`}>
            <Trash2 size={16} />
          </button>
        )}
      </div>
      {elegida && (
        <div className="flex flex-wrap gap-1.5 px-2 pb-2.5 pl-11" role="radiogroup" aria-label="¿Cuándo?">
          {(Object.keys(MOMENTOS) as Momento[]).map((m) => (
            <button
              key={m}
              type="button"
              role="radio"
              aria-checked={momento === m}
              onClick={() => cambiarMomento(cosita.id, m)}
              className={`rounded-full px-2.5 py-1 text-[12px] font-semibold ${momento === m ? 'bg-oro/90 text-sobre-oro' : 'bg-fondo-2 text-tinta-3 hover:text-tinta-2'}`}
            >
              {MOMENTOS[m]}
            </button>
          ))}
        </div>
      )}
    </li>
  )
}
