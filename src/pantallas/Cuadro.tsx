import { motion } from 'motion/react'
import { Cabecera } from '../components/Cabecera'
import { Mosaico } from '../components/Mosaico'
import { Motivo } from '../components/Motivo'
import { CUADROS, miniDe } from '../data/cuadros'
import { sumarDias } from '../lib/fecha'
import { teselasEntre } from '../store/derivados'
import { useResumen } from '../store/hooks'
import { useUI } from '../store/ui'

export function Cuadro() {
  const r = useResumen()
  const recien = useUI((s) => s.recien)
  const abrir = useUI((s) => s.abrir)
  const p = r.progreso
  const semana = teselasEntre(r.regs, sumarDias(r.hoy, -6), r.hoy)
  const recienAqui = recien && recien.cuadroId === p.cuadro.id && Date.now() - recien.ts < 4000 ? recien.indice : null
  const proximos = Math.max(0, Math.min(2, CUADROS.length - p.completados.length - 1))

  return (
    <>
      <Cabecera titulo="Mi cuadro" subtitulo="Cada cosita descubre una tesela." />
      <div className="desplazable flex-1 px-4 pb-8">
        <div className="mx-auto rounded-[20px] border border-borde-fuerte bg-fondo-2 p-2 shadow-[var(--sombra)]" style={{ width: `min(100%, calc(50vh * ${p.cuadro.ratio} + 18px))` }}>
          <Mosaico cuadro={p.cuadro} descubiertas={p.descubiertas} recien={recienAqui} redondeo="rounded-xl" className="w-full" />
        </div>

        <div className="mt-4 px-1">
          <h2 className="titulo text-[25px] leading-tight">{p.cuadro.titulo}</h2>
          <p className="text-[14px] text-tinta-3">
            Gustav Klimt · {p.cuadro.fecha}
            {p.cuadro.lugar ? ` · ${p.cuadro.lugar}` : ''}
          </p>
          <div className="mt-3 flex items-center gap-3">
            <span className="h-2 flex-1 overflow-hidden rounded-full bg-fondo-2">
              <motion.span className="hoja-oro block h-full rounded-full" initial={false} animate={{ width: `${Math.max(2, (p.puestas / p.total) * 100)}%` }} />
            </span>
            <span className="shrink-0 text-[14px] font-semibold text-tinta-2">
              <span className="text-oro">{p.puestas}</span> de {p.total} teselas
            </span>
          </div>
          {p.puestas >= Math.ceil(p.total / 3) ? (
            <p className="mt-3 text-[15px] leading-relaxed text-tinta-2">{p.cuadro.texto}</p>
          ) : (
            <p className="mt-3 text-[15px] leading-relaxed text-tinta-3">Cuando lleves un tercio del cuadro, te cuento algo de él.</p>
          )}
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2">
          <div className="rounded-2xl border border-borde bg-tarjeta px-3 py-3">
            <span className="titulo block text-[26px] text-oro">{semana}</span>
            <span className="text-[13px] text-tinta-3">{semana === 1 ? 'tesela esta semana' : 'teselas esta semana'}</span>
          </div>
          <div className="rounded-2xl border border-borde bg-tarjeta px-3 py-3">
            <span className="titulo block text-[26px] text-oro">{r.total}</span>
            <span className="text-[13px] text-tinta-3">
              {r.total === 1 ? 'tesela' : 'teselas'} en {r.dias.length} {r.dias.length === 1 ? 'día' : 'días'}
            </span>
          </div>
        </div>

        <section className="mt-6" aria-labelledby="galeria">
          <h2 id="galeria" className="titulo px-1 text-[19px]">
            Tu galería
          </h2>
          <p className="px-1 text-[14px] text-tinta-3">
            {p.completados.length === 0 ? 'Aquí colgarán los cuadros que completes.' : 'Los cuadros que ya has completado.'}
          </p>
          <div className="mt-3 grid grid-cols-3 gap-3">
            {p.completados.map(({ cuadro, vuelta }, i) => (
              <button
                key={`${cuadro.id}-${vuelta}-${i}`}
                type="button"
                onClick={() => abrir({ tipo: 'cuadro-completo', cuadroId: cuadro.id, vuelta })}
                className="group rounded-lg bg-[linear-gradient(135deg,#e9c46a,#9e7a2e)] p-1 shadow-md"
                aria-label={`Ver ${cuadro.titulo}`}
              >
                <img src={miniDe(cuadro)} alt="" className="aspect-square w-full rounded-[5px] object-cover transition-transform group-hover:scale-[1.02]" />
              </button>
            ))}
            {Array.from({ length: proximos + 1 }, (_, i) => (
              <div
                key={`p${i}`}
                className={`relative grid aspect-square place-items-center overflow-hidden rounded-lg border ${
                  i === 0 ? 'border-oro/60 bg-tarjeta-hecha' : 'border-dashed border-borde-fuerte'
                }`}
              >
                <Motivo n={i + 2} className={`absolute inset-4 ${i === 0 ? 'text-oro/40' : 'text-tinta-3/20'}`} />
                <span className="relative px-1 text-center text-[12px] font-semibold text-tinta-3">{i === 0 ? 'En marcha' : 'Sorpresa'}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  )
}
