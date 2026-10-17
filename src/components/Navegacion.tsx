import { Frame, Sprout, Sun } from 'lucide-react'
import { useUI, type Pestana } from '../store/ui'

const PESTANAS: { id: Pestana; nombre: string; Icono: typeof Sun }[] = [
  { id: 'hoy', nombre: 'Hoy', Icono: Sun },
  { id: 'cuadro', nombre: 'Mi cuadro', Icono: Frame },
  { id: 'escalera', nombre: 'Escalera', Icono: Sprout },
]

export function Navegacion() {
  const pestana = useUI((s) => s.pestana)
  const irA = useUI((s) => s.irA)
  return (
    <nav className="relative z-20 flex shrink-0 border-t border-borde bg-fondo/90 px-2 pt-1.5 pb-[max(6px,env(safe-area-inset-bottom))] backdrop-blur" aria-label="Secciones">
      {PESTANAS.map(({ id, nombre, Icono }) => {
        const activa = pestana === id
        return (
          <button
            key={id}
            type="button"
            onClick={() => irA(id)}
            aria-current={activa ? 'page' : undefined}
            className={`flex flex-1 flex-col items-center gap-0.5 rounded-xl py-1.5 text-[12px] font-semibold transition-colors ${
              activa ? 'text-oro' : 'text-tinta-3 hover:text-tinta-2'
            }`}
          >
            <Icono size={22} strokeWidth={activa ? 2.2 : 1.8} />
            {nombre}
          </button>
        )
      })}
    </nav>
  )
}
