import { Send, Trash2 } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useCallback, useEffect, useState } from 'react'
import { buzon, type Nota } from '../lib/nube'
import { NOMBRE } from '../personal'

const fmt = new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })

/** La página de Ray: escribirle notas que le aparecerán en las ventanitas. */
export function Buzon({ clave }: { clave: string }) {
  const [notas, setNotas] = useState<Nota[] | null>(null)
  const [texto, setTexto] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [enviada, setEnviada] = useState(false)

  const cargar = useCallback(async () => {
    try {
      setNotas(await buzon.listar(clave))
    } catch {
      setError('No encuentro este buzón. ¿Está bien copiado el enlace?')
    }
  }, [clave])

  useEffect(() => {
    void cargar()
  }, [cargar])

  const enviar = async () => {
    if (!texto.trim()) return
    setEnviando(true)
    setError(null)
    try {
      await buzon.dejar(clave, texto.trim())
      await cargar()
      setTexto('')
      setEnviada(true)
      window.setTimeout(() => setEnviada(false), 2500)
    } catch {
      setError('No se ha podido enviar. ¿Hay internet?')
    }
    setEnviando(false)
  }

  const borrar = async (id: string) => {
    if (!window.confirm('¿Borrar esta nota? Si aún no la ha visto, ya no le aparecerá.')) return
    await buzon.borrar(clave, id)
    await cargar()
  }

  return (
    <div className="marco ornamento-fondo">
      <div className="desplazable relative flex-1 px-5 pt-[max(24px,env(safe-area-inset-top))] pb-10">
        <p className="text-[13px] font-bold tracking-wider text-amapola uppercase">💌 Buzón</p>
        <h1 className="titulo mt-1 text-[30px] leading-tight">Notas para {NOMBRE}</h1>
        <p className="mt-2 text-[15px] leading-relaxed text-tinta-2">
          Lo que escribas le aparecerá en una ventanita. Las notas nuevas salen en los próximos días; las demás, de vez en cuando. Cortitas y de corazón.
        </p>

        <div className="mt-5 rounded-2xl border border-borde-fuerte bg-tarjeta p-3">
          <textarea
            value={texto}
            onChange={(e) => setTexto(e.target.value.slice(0, 600))}
            rows={4}
            placeholder="Escribe aquí tu nota…"
            className="w-full resize-none bg-transparent text-[17px] leading-relaxed text-tinta outline-none placeholder:text-tinta-3"
          />
          <div className="flex items-center justify-between">
            <span className="text-[12px] text-tinta-3">{texto.length}/600</span>
            <button
              type="button"
              disabled={!texto.trim() || enviando}
              onClick={() => void enviar()}
              className="boton-oro flex items-center gap-2 rounded-full px-5 py-2 text-[15px] font-bold disabled:opacity-40 disabled:shadow-none"
            >
              <Send size={16} /> {enviando ? 'Enviando…' : 'Dejar la nota'}
            </button>
          </div>
        </div>
        <AnimatePresence>
          {enviada && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-2 text-center text-[15px] text-oro">
              Nota en el buzón ✦
            </motion.p>
          )}
        </AnimatePresence>
        {error && <p className="mt-3 text-[14px] text-amapola">{error}</p>}

        <h2 className="titulo mt-8 text-[20px]">Tus notas</h2>
        {notas === null && !error && <p className="mt-2 text-[14px] text-tinta-3">Cargando…</p>}
        {notas?.length === 0 && <p className="mt-2 text-[14px] text-tinta-3">Todavía no has dejado ninguna.</p>}
        <ul className="mt-3 space-y-2">
          {notas?.map((n) => (
            <li key={n.id} className="flex items-start gap-2 rounded-xl border border-borde bg-tarjeta/70 px-3 py-2.5">
              <div className="min-w-0 flex-1">
                <p className="text-[15px] leading-snug whitespace-pre-wrap">{n.texto}</p>
                <p className="mt-1 text-[12px] text-tinta-3">{fmt.format(new Date(n.creada))}</p>
              </div>
              <button type="button" onClick={() => void borrar(n.id)} className="grid size-8 shrink-0 place-items-center rounded-full text-tinta-3 hover:text-amapola" aria-label="Borrar nota">
                <Trash2 size={15} />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
