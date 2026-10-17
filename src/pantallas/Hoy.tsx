import { CloudLightning, HeartHandshake, Sparkles } from 'lucide-react'
import { motion } from 'motion/react'
import { useMemo } from 'react'
import { Cabecera } from '../components/Cabecera'
import { Cielo } from '../components/Cielo'
import { Mosaico } from '../components/Mosaico'
import { TarjetaCosita } from '../components/TarjetaCosita'
import { Ventanita } from '../components/Ventanita'
import { MOMENTOS, type Momento } from '../data/cositas'
import { SUBTITULOS, TODO_HECHO } from '../data/frases'
import { elegir } from '../lib/azar'
import { fechaBonita, saludo } from '../lib/fecha'
import { NOMBRE } from '../personal'
import { posponerSugerencia } from '../store/acciones'
import { cieloDe, debeSugerir, ORDEN_MOMENTOS, type CositaActiva } from '../store/derivados'
import { useResumen } from '../store/hooks'
import { useUI } from '../store/ui'

export function Hoy() {
  const r = useResumen()
  const abrir = useUI((s) => s.abrir)
  const irA = useUI((s) => s.irA)
  const recien = useUI((s) => s.recien)

  const cielo = cieloDe(r.regs, r.hoy)
  const sugerir = debeSugerir(r.regs, r.hoy)
  const algoHecho = r.hechas.size > 0
  const todoHecho = r.activas.length > 0 && r.hechasDeLista === r.activas.length

  const grupos = useMemo(() => {
    if (r.activas.length < 4) return [{ momento: null as Momento | null, lista: r.activas }]
    const porMomento = new Map<Momento, CositaActiva[]>()
    for (const a of r.activas) porMomento.set(a.momento, [...(porMomento.get(a.momento) ?? []), a])
    return ORDEN_MOMENTOS.filter((m) => porMomento.has(m)).map((m) => ({ momento: m as Momento | null, lista: porMomento.get(m)! }))
  }, [r.activas])

  const { progreso: p } = r
  const recienAqui = recien && recien.cuadroId === p.cuadro.id && Date.now() - recien.ts < 4000 ? recien.indice : null

  return (
    <>
      <Cabecera titulo={`${saludo()}, ${NOMBRE}`} subtitulo={`${fechaBonita()} · ${elegir(SUBTITULOS, r.hoy)}`} />
      <div className="desplazable flex-1 space-y-3 px-4 pb-6">
        <Cielo actual={cielo} />

        {cielo === 'tormenta' && (
          <button
            type="button"
            onClick={() => abrir({ tipo: 'refugio' })}
            className="flex w-full items-center gap-3 rounded-2xl border border-azul/40 bg-azul/10 px-4 py-3 text-left"
          >
            <CloudLightning className="shrink-0 text-azul" size={24} />
            <span className="flex-1">
              <span className="titulo block text-[18px]">Hoy es día de refugio</span>
              <span className="block text-[14px] text-tinta-2">Basta con algo muy pequeño. O con nada.</span>
            </span>
          </button>
        )}

        {sugerir && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-prado/40 bg-prado/10 px-4 py-3">
            <p className="titulo text-[18px]">Llevas días cuidando tus cositas 🌱</p>
            <p className="mt-0.5 text-[15px] text-tinta-2">¿Te apetece añadir otra? Solo si te apetece.</p>
            <div className="mt-2.5 flex gap-2">
              <button type="button" onClick={() => abrir({ tipo: 'ideas' })} className="boton-oro rounded-full px-4 py-2 text-[14px] font-bold">
                Ver ideas
              </button>
              <button type="button" onClick={posponerSugerencia} className="rounded-full px-4 py-2 text-[14px] font-semibold text-tinta-2 hover:text-tinta">
                Ahora no
              </button>
            </div>
          </motion.div>
        )}

        <section aria-labelledby="mis-cositas" className="space-y-2 pt-1">
          <div className="flex items-baseline justify-between px-1">
            <h2 id="mis-cositas" className="titulo text-[19px]">
              Tus cositas
            </h2>
            {r.activas.length > 0 && (
              <span className="text-[14px] font-semibold text-tinta-3">
                {r.hechasDeLista} de {r.activas.length} {r.hechasDeLista > 0 && <span className="text-oro">✦</span>}
              </span>
            )}
          </div>
          {cielo === 'lluvia' && !algoHecho && <p className="px-1 text-[14px] text-tinta-3">Hoy, con una basta.</p>}

          {r.activas.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-borde-fuerte px-4 py-5 text-center">
              <p className="text-tinta-2">Ahora mismo no tienes cositas elegidas. Y no pasa nada.</p>
              <button type="button" onClick={() => irA('escalera')} className="boton-oro mt-3 rounded-full px-4 py-2 text-[14px] font-bold">
                Elegir una
              </button>
            </div>
          ) : (
            grupos.map((g) => (
              <div key={g.momento ?? 'todas'} className="space-y-2">
                {g.momento && <h3 className="px-1 pt-1 text-[12px] font-bold tracking-wider text-tinta-3 uppercase">{MOMENTOS[g.momento]}</h3>}
                {g.lista.map((a) => (
                  <TarjetaCosita key={a.cosita.id} cosita={a.cosita} hecha={r.hechas.has(a.cosita.id)} />
                ))}
              </div>
            ))
          )}

          {todoHecho && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center gap-2 py-1 text-[15px] text-oro">
              <Sparkles size={16} /> {elegir(TODO_HECHO, r.hoy)}
            </motion.p>
          )}
        </section>

        <Ventanita regs={r.regs} hoy={r.hoy} puede={algoHecho} />

        <button
          type="button"
          onClick={() => irA('cuadro')}
          className="flex w-full items-center gap-3.5 rounded-2xl border border-borde bg-tarjeta px-3 py-3 text-left"
          aria-label={`Mi cuadro: ${p.cuadro.titulo}, ${p.puestas} de ${p.total} teselas`}
        >
          <Mosaico cuadro={p.cuadro} descubiertas={p.descubiertas} recien={recienAqui} mini className="w-14 shrink-0" redondeo="rounded-lg" />
          <span className="min-w-0 flex-1">
            <span className="block text-[12px] font-bold tracking-wider text-tinta-3 uppercase">Tu cuadro</span>
            <span className="titulo block truncate text-[18px]">{p.cuadro.titulo}</span>
            <span className="mt-1.5 block h-1.5 overflow-hidden rounded-full bg-fondo-2">
              <motion.span
                className="hoja-oro block h-full rounded-full"
                initial={false}
                animate={{ width: `${Math.max(3, (p.puestas / p.total) * 100)}%` }}
                transition={{ type: 'spring', stiffness: 120, damping: 20 }}
              />
            </span>
          </span>
          <span className="shrink-0 text-right text-[13px] text-tinta-3">
            <span className="titulo block text-[20px] text-oro">{p.puestas}</span>
            de {p.total}
          </span>
        </button>

        <div className="flex justify-center pt-2">
          <button
            type="button"
            onClick={() => abrir({ tipo: 'refugio' })}
            className="flex items-center gap-2 rounded-full px-4 py-2 text-[15px] text-tinta-3 hover:bg-tarjeta hover:text-tinta-2"
          >
            <HeartHandshake size={18} /> Hoy me cuesta mucho
          </button>
        </div>
      </div>
    </>
  )
}
