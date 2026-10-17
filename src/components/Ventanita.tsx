import { Gift, Lock } from 'lucide-react'
import { motion } from 'motion/react'
import { ETIQUETA_TIPO } from '../data/sorpresas'
import { desdeIso } from '../lib/fecha'
import { abrirVentanita } from '../store/acciones'
import { ventanitaDeHoy } from '../store/derivados'
import type { Reg } from '../store/estado'
import { useUI } from '../store/ui'
import { Motivo } from './Motivo'
import { useNube } from '../lib/nube'
import { PAREJA } from '../personal'

interface Props {
  regs: Record<string, Reg>
  hoy: string
  puede: boolean
}

export function Ventanita({ regs, hoy, puede }: Props) {
  const abrir = useUI((s) => s.abrir)
  const notas = useNube((n) => n.notas)
  const abierta = Boolean(regs[`v:${hoy}`]?.v)
  const dia = desdeIso(hoy).getDate()
  const { sorpresa } = ventanitaDeHoy(regs, hoy, notas)
  const traeNota = sorpresa.tipo === 'nota'

  if (abierta) {
    return (
      <button
        type="button"
        onClick={() => abrir({ tipo: 'ventanita' })}
        className="flex w-full items-center gap-3 rounded-2xl border border-borde-fuerte bg-tarjeta px-3 py-3 text-left"
      >
        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-fondo-2 text-[22px] ring-1 ring-borde-fuerte" aria-hidden>
          {sorpresa.emoji}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[12px] font-bold tracking-wider text-oro uppercase">Ventanita · {ETIQUETA_TIPO[sorpresa.tipo]}</span>
          <span className="titulo block truncate text-[17px]">{sorpresa.titulo}</span>
        </span>
      </button>
    )
  }

  return (
    <motion.button
      type="button"
      disabled={!puede}
      onClick={abrirVentanita}
      whileTap={puede ? { scale: 0.98 } : undefined}
      className={`relative flex w-full items-center gap-3.5 overflow-hidden rounded-2xl border px-3 py-3 text-left transition-colors ${
        puede ? 'border-oro bg-tarjeta-hecha' : 'border-dashed border-borde-fuerte bg-transparent'
      }`}
      aria-label={puede ? 'Abrir la ventanita de hoy' : 'La ventanita de hoy se abre con tu primera cosita'}
    >
      <span className={`relative grid h-14 w-12 shrink-0 place-items-center rounded-lg ${puede ? 'hoja-oro' : 'bg-fondo-2 text-tinta-3'}`}>
        <Motivo n={dia} className={`absolute inset-1.5 ${puede ? 'text-oro-oscuro/40' : 'text-tinta-3/25'}`} />
        <span className="titulo relative text-[22px] font-semibold">{dia}</span>
        {puede && <span className="brillo absolute -inset-1 rounded-xl ring-2 ring-oro-claro/70" aria-hidden />}
      </span>
      <span className="min-w-0 flex-1">
        {puede ? (
          <>
            <span className="titulo block text-[18px]">Tienes una ventanita</span>
            <span className="block text-[14px] text-tinta-2">{traeNota ? `Hoy trae algo de ${PAREJA} 💌` : 'Una sorpresa pequeña, solo para hoy.'}</span>
          </>
        ) : (
          <>
            <span className="block text-[15px] text-tinta-2">{traeNota ? `Hoy tu ventanita trae algo de ${PAREJA} 💌` : 'Tu ventanita de hoy'}</span>
            <span className="block text-[14px] text-tinta-3">Se abre con tu primera cosita.</span>
          </>
        )}
      </span>
      {puede ? <Gift className="shrink-0 text-oro" size={22} /> : <Lock className="shrink-0 text-tinta-3" size={18} />}
    </motion.button>
  )
}
