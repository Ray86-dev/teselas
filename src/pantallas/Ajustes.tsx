import { ArrowLeft, Download, Upload } from 'lucide-react'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Cabecera } from '../components/Cabecera'
import { SeccionNube } from '../components/SeccionNube'
import { SERVICIOS, type ServicioMusica } from '../lib/enlaces'
import { activarArranque, arranqueActivado, enEscritorio, siempreEncima } from '../lib/escritorio'
import { HORA_RECORDATORIO_POR_DEFECTO } from '../lib/recordatorios'
import { DEDICATORIA, PAREJA } from '../personal'
import { poner, useTeselas, useValor, type Reg } from '../store/estado'
import { useLocal } from '../store/local'
import { useUI } from '../store/ui'

export type Tema = 'auto' | 'claro' | 'oscuro'

export function Ajustes() {
  const irA = useUI((s) => s.irA)
  const avisar = useUI((s) => s.avisar)
  const tema = useValor<Tema>('cfg:tema', 'auto')
  const sonido = useValor('cfg:sonido', true)
  const musica = useValor<ServicioMusica>('cfg:musica', 'youtube')
  const recordatorio = useValor<string | null>('cfg:recordatorio', HORA_RECORDATORIO_POR_DEFECTO)
  const whatsapp = useValor<string>('cfg:whatsapp', '')
  const encima = useLocal((s) => s.encima)
  const cambiarLocal = useLocal((s) => s.cambiar)
  const [arranque, setArranque] = useState(false)
  const archivo = useRef<HTMLInputElement>(null)

  useEffect(() => {
    void arranqueActivado().then(setArranque)
  }, [])

  const exportar = () => {
    const datos = JSON.stringify({ app: 'teselas', version: 1, fecha: new Date().toISOString(), regs: useTeselas.getState().regs }, null, 1)
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([datos], { type: 'application/json' }))
    a.download = `teselas-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(a.href)
  }

  const importar = async (f: File) => {
    try {
      const datos = JSON.parse(await f.text()) as { app?: string; regs?: Record<string, Reg> }
      if (datos.app !== 'teselas' || !datos.regs) throw new Error('formato')
      useTeselas.getState().fusionar(datos.regs)
      avisar('Copia recuperada ✦')
    } catch {
      avisar('Ese archivo no parece una copia de Teselas')
    }
  }

  return (
    <>
      <Cabecera
        titulo={
          <button type="button" onClick={() => irA('hoy')} className="-ml-1 flex items-center gap-2 rounded-lg pr-2" aria-label="Volver a Hoy">
            <ArrowLeft size={22} className="text-tinta-3" /> Ajustes
          </button>
        }
        ajustes={false}
      />
      <div className="desplazable flex-1 space-y-5 px-4 pb-10">
        <Grupo titulo="Portátil y móvil">
          <div className="py-1">
            <SeccionNube />
          </div>
        </Grupo>

        <Grupo titulo="Aspecto">
          <Fila etiqueta="Colores">
            <Segmentos valor={tema} opciones={{ auto: 'Auto', claro: 'Papel', oscuro: 'Noche' }} alCambiar={(v) => poner({ 'cfg:tema': v })} />
          </Fila>
          <Fila etiqueta="Campanita al poner una tesela">
            <Interruptor activo={sonido} alCambiar={(v) => poner({ 'cfg:sonido': v })} />
          </Fila>
        </Grupo>

        <Grupo titulo="Música" nota="Dónde se abren las canciones que te propongo.">
          <Segmentos valor={musica} opciones={SERVICIOS} alCambiar={(v) => poner({ 'cfg:musica': v })} ancho />
        </Grupo>

        <Grupo titulo="Recordatorio suave" nota="Un solo aviso al día, y solo si todavía no has hecho nada. Nunca en días de tormenta.">
          <Fila etiqueta="Avisarme">
            <Interruptor activo={recordatorio !== null} alCambiar={(v) => poner({ 'cfg:recordatorio': v ? HORA_RECORDATORIO_POR_DEFECTO : null })} />
          </Fila>
          {recordatorio !== null && (
            <Fila etiqueta="A partir de las">
              <input
                type="time"
                value={recordatorio}
                onChange={(e) => e.target.value && poner({ 'cfg:recordatorio': e.target.value })}
                className="rounded-lg border border-borde-fuerte bg-fondo-2 px-2 py-1 text-tinta"
              />
            </Fila>
          )}
        </Grupo>

        {enEscritorio && (
          <Grupo titulo="En el portátil">
            <Fila etiqueta="Siempre por encima de las demás ventanas">
              <Interruptor
                activo={encima}
                alCambiar={(v) => {
                  cambiarLocal({ encima: v })
                  void siempreEncima(v)
                }}
              />
            </Fila>
            <Fila etiqueta="Abrirse al encender el portátil">
              <Interruptor
                activo={arranque}
                alCambiar={(v) => {
                  setArranque(v)
                  void activarArranque(v)
                }}
              />
            </Fila>
          </Grupo>
        )}

        <Grupo titulo={`Escribir a ${PAREJA}`} nota={`Si pones su móvil, en el refugio aparecerá un botón para pedirle un abrazo por WhatsApp.`}>
          <input
            type="tel"
            inputMode="tel"
            placeholder="Ej.: 600 123 456"
            defaultValue={whatsapp}
            onBlur={(e) => poner({ 'cfg:whatsapp': e.target.value.trim() })}
            className="w-full rounded-xl border border-borde-fuerte bg-fondo-2 px-3 py-2 text-tinta placeholder:text-tinta-3"
          />
        </Grupo>

        <Grupo titulo="Copia de seguridad" nota="Tus teselas se guardan en este dispositivo (y en la nube, si está activada). Puedes llevarte una copia por si acaso.">
          <div className="flex gap-2">
            <button type="button" onClick={exportar} className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-borde-fuerte bg-tarjeta px-3 py-2.5 text-[14px] font-semibold">
              <Download size={16} /> Guardar copia
            </button>
            <button
              type="button"
              onClick={() => archivo.current?.click()}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-borde-fuerte bg-tarjeta px-3 py-2.5 text-[14px] font-semibold"
            >
              <Upload size={16} /> Recuperar
            </button>
            <input ref={archivo} type="file" accept="application/json" hidden onChange={(e) => e.target.files?.[0] && void importar(e.target.files[0])} />
          </div>
        </Grupo>

        <div className="rounded-2xl border border-borde px-4 py-4 text-center">
          <p className="titulo text-[18px]">{DEDICATORIA}</p>
          <p className="mt-2 text-[13px] leading-relaxed text-tinta-3">
            Cuadros de Gustav Klimt (1862–1918), de dominio público, vía Wikimedia Commons.
          </p>
        </div>
      </div>
    </>
  )
}

function Grupo({ titulo, nota, children }: { titulo: string; nota?: string; children: ReactNode }) {
  return (
    <section className="space-y-2">
      <h2 className="px-1 text-[12px] font-bold tracking-wider text-tinta-3 uppercase">{titulo}</h2>
      <div className="space-y-1 rounded-2xl border border-borde bg-tarjeta px-3 py-2.5">{children}</div>
      {nota && <p className="px-1 text-[13px] leading-snug text-tinta-3">{nota}</p>}
    </section>
  )
}

function Fila({ etiqueta, children }: { etiqueta: string; children: ReactNode }) {
  return (
    <div className="flex min-h-11 items-center justify-between gap-3">
      <span className="text-[15px]">{etiqueta}</span>
      {children}
    </div>
  )
}

function Interruptor({ activo, alCambiar }: { activo: boolean; alCambiar: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={activo}
      onClick={() => alCambiar(!activo)}
      className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${activo ? 'bg-oro' : 'bg-fondo-2 ring-1 ring-borde-fuerte'}`}
    >
      <span className={`absolute top-1 size-5 rounded-full bg-white shadow transition-all ${activo ? 'left-6' : 'left-1'}`} />
    </button>
  )
}

function Segmentos<T extends string>({ valor, opciones, alCambiar, ancho }: { valor: T; opciones: Record<T, string>; alCambiar: (v: T) => void; ancho?: boolean }) {
  return (
    <div className={`flex gap-1 rounded-full bg-fondo-2 p-1 ${ancho ? 'w-full' : ''}`} role="radiogroup">
      {(Object.keys(opciones) as T[]).map((k) => (
        <button
          key={k}
          type="button"
          role="radio"
          aria-checked={valor === k}
          onClick={() => alCambiar(k)}
          className={`flex-1 rounded-full px-3 py-1.5 text-[13px] font-semibold whitespace-nowrap transition-colors ${valor === k ? 'bg-oro text-sobre-oro' : 'text-tinta-3 hover:text-tinta'}`}
        >
          {opciones[k]}
        </button>
      ))}
    </div>
  )
}
