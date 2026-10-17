import { useState } from 'react'
import { Capa } from '../components/Capa'
import { MOMENTOS, PELDANOS, type Momento, type Peldano } from '../data/cositas'
import { crearCosita } from '../store/acciones'
import { useUI } from '../store/ui'

const EMOJIS = ['✨', '💧', '🌿', '🌸', '☕', '📖', '🎧', '💄', '💅', '🧴', '🛁', '🚶‍♀️', '🧘‍♀️', '🍎', '🕯️', '🪴', '🖼️', '🧺', '✍️', '📞', '💌', '🎨', '🐈', '🌙', '💊', '🗂️']

export function NuevaCosita({ alCerrar }: { alCerrar: () => void }) {
  const avisar = useUI((s) => s.avisar)
  const [titulo, setTitulo] = useState('')
  const [emoji, setEmoji] = useState('✨')
  const [peldano, setPeldano] = useState<Peldano>(1)
  const [momento, setMomento] = useState<Momento>('cuando')

  const guardar = () => {
    if (!titulo.trim()) return
    crearCosita({ titulo: titulo.trim(), emoji, peldano, momento })
    avisar('Cosita creada ✦')
    alCerrar()
  }

  return (
    <Capa etiqueta="Crear una cosita" alCerrar={alCerrar}>
      <form
        className="px-5 pt-7 pb-7"
        onSubmit={(e) => {
          e.preventDefault()
          guardar()
        }}
      >
        <h2 className="titulo text-[26px]">Una cosita tuya</h2>

        <label className="mt-5 block text-[13px] font-bold tracking-wider text-tinta-3 uppercase" htmlFor="titulo-cosita">
          ¿Qué cosita?
        </label>
        <input
          id="titulo-cosita"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          maxLength={60}
          placeholder="Ej.: Ponerme mi perfume"
          className="mt-1.5 w-full rounded-xl border border-borde-fuerte bg-fondo-2 px-3 py-2.5 text-[17px] text-tinta placeholder:text-tinta-3"
          autoFocus
        />

        <p className="mt-5 text-[13px] font-bold tracking-wider text-tinta-3 uppercase">Su dibujito</p>
        <div className="mt-1.5 grid grid-cols-9 gap-1">
          {EMOJIS.map((e) => (
            <button
              key={e}
              type="button"
              onClick={() => setEmoji(e)}
              aria-pressed={emoji === e}
              className={`grid aspect-square place-items-center rounded-lg text-[20px] ${emoji === e ? 'bg-oro/30 ring-2 ring-oro' : 'hover:bg-tarjeta'}`}
            >
              {e}
            </button>
          ))}
        </div>

        <p className="mt-5 text-[13px] font-bold tracking-wider text-tinta-3 uppercase">¿Cuánto cuesta?</p>
        <div className="mt-1.5 grid grid-cols-2 gap-1.5">
          {([1, 2, 3, 4] as Peldano[]).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPeldano(p)}
              aria-pressed={peldano === p}
              className={`rounded-xl px-3 py-2 text-left text-[14px] ${peldano === p ? 'bg-oro text-sobre-oro' : 'bg-tarjeta text-tinta-2'}`}
            >
              <span className="font-bold">
                {PELDANOS[p].emoji} {PELDANOS[p].nombre}
              </span>
              <span className="block text-[12px] opacity-80">{PELDANOS[p].lema}</span>
            </button>
          ))}
        </div>

        <p className="mt-5 text-[13px] font-bold tracking-wider text-tinta-3 uppercase">¿Cuándo?</p>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {(Object.keys(MOMENTOS) as Momento[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMomento(m)}
              aria-pressed={momento === m}
              className={`rounded-full px-3 py-1.5 text-[13px] font-semibold ${momento === m ? 'bg-oro text-sobre-oro' : 'bg-tarjeta text-tinta-3'}`}
            >
              {MOMENTOS[m]}
            </button>
          ))}
        </div>

        <button type="submit" disabled={!titulo.trim()} className="boton-oro mt-7 w-full rounded-full px-6 py-3 text-[16px] font-bold disabled:opacity-40 disabled:shadow-none">
          Añadir a mis cositas
        </button>
      </form>
    </Capa>
  )
}
