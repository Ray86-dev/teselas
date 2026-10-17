import { Timer } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { Aviso } from './components/Aviso'
import { Navegacion } from './components/Navegacion'
import { Pildora } from './components/Pildora'
import { CuadroCompleto, Hito } from './capas/Celebraciones'
import { Ideas } from './capas/Ideas'
import { NuevaCosita } from './capas/NuevaCosita'
import { Refugio } from './capas/Refugio'
import { Respirar } from './capas/Respirar'
import { Temporizador } from './capas/Temporizador'
import { VentanitaAbierta } from './capas/VentanitaAbierta'
import { Motivo } from './components/Motivo'
import { alCambiarEncimaDesdeBandeja, enEscritorio, prepararVentana } from './lib/escritorio'
import { desconectar, iniciarNube, sincronizar, useNube } from './lib/nube'
import { iniciarRecordatorios } from './lib/recordatorios'
import { Ajustes, type Tema } from './pantallas/Ajustes'
import { Bienvenida } from './pantallas/Bienvenida'
import { Cuadro } from './pantallas/Cuadro'
import { Escalera } from './pantallas/Escalera'
import { Hoy } from './pantallas/Hoy'
import { cositaPorId } from './store/derivados'
import { useTeselas, useValor } from './store/estado'
import { useLocal } from './store/local'
import { formatoReloj, useVigilarTemporizador } from './store/temporizador'
import { useUI, type Capa } from './store/ui'

export default function App() {
  const empezado = useValor<string | null>('onb', null)
  const pestana = useUI((s) => s.pestana)
  const capa = useUI((s) => s.capa)
  const cerrar = useUI((s) => s.cerrar)
  const modo = useLocal((s) => s.modo)

  const conectando = useNube((n) => Boolean(n.clave) && n.ultima === null)

  useTema()
  useVigilarTemporizador()
  useEscritorio()
  useEffect(iniciarRecordatorios, [])
  useEffect(iniciarNube, [])

  if (enEscritorio && modo === 'pildora' && empezado) return <Pildora />

  return (
    <div className="marco ornamento-fondo">
      {!empezado && conectando ? (
        <Conectando />
      ) : !empezado ? (
        <Bienvenida />
      ) : (
        <>
          <ChipTemporizador />
          <AnimatePresence mode="wait" initial={false}>
            <motion.main
              key={pestana}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="relative flex min-h-0 flex-1 flex-col"
            >
              {pestana === 'hoy' && <Hoy />}
              {pestana === 'cuadro' && <Cuadro />}
              {pestana === 'escalera' && <Escalera />}
              {pestana === 'ajustes' && <Ajustes />}
            </motion.main>
          </AnimatePresence>
          <Navegacion />
          <Aviso />
        </>
      )}
      <AnimatePresence>{capa && <CapaActual key={capa.tipo} capa={capa} alCerrar={cerrar} />}</AnimatePresence>
    </div>
  )
}

function CapaActual({ capa, alCerrar }: { capa: Capa; alCerrar: () => void }) {
  switch (capa.tipo) {
    case 'refugio':
      return <Refugio alCerrar={alCerrar} />
    case 'respirar':
      return <Respirar cositaId={capa.cositaId} alCerrar={alCerrar} />
    case 'temporizador':
      return <Temporizador cositaId={capa.cositaId} alCerrar={alCerrar} />
    case 'ventanita':
      return <VentanitaAbierta alCerrar={alCerrar} />
    case 'ideas':
      return <Ideas alCerrar={alCerrar} />
    case 'nueva':
      return <NuevaCosita alCerrar={alCerrar} />
    case 'hito':
      return <Hito peldano={capa.peldano} alCerrar={alCerrar} />
    case 'cuadro-completo':
      return <CuadroCompleto cuadroId={capa.cuadroId} celebrar={capa.celebrar} alCerrar={alCerrar} />
  }
}

/** Si hay un temporizador en marcha y su capa está cerrada, un recordatorio arriba para volver a él. */
function ChipTemporizador() {
  const t = useUI((s) => s.temporizador)
  const capa = useUI((s) => s.capa)
  const abrir = useUI((s) => s.abrir)
  const cosita = useTeselas((s) => (t ? cositaPorId(s.regs, t.cositaId) : undefined))
  const [, setTic] = useState(0)
  useEffect(() => {
    if (!t) return
    const id = window.setInterval(() => setTic((n) => n + 1), 1000)
    return () => window.clearInterval(id)
  }, [t])
  if (!t || !cosita || capa?.tipo === 'temporizador') return null
  return (
    <button
      type="button"
      onClick={() => abrir({ tipo: 'temporizador', cositaId: t.cositaId })}
      className="absolute top-3 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full border border-oro/60 bg-fondo-2 px-3 py-1.5 text-[13px] font-semibold shadow-[var(--sombra)]"
    >
      <Timer size={14} className="text-oro" />
      <span className="tabular-nums">{formatoReloj(t.fin - Date.now())}</span>
      <span className="max-w-[160px] truncate text-tinta-3">{cosita.titulo}</span>
    </button>
  )
}

/** Mientras un móvil recién unido trae las teselas de la nube. */
function Conectando() {
  const estado = useNube((n) => n.estado)
  const fallo = estado === 'sin-conexion'
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
      <Motivo n={1} className={`size-16 text-oro ${fallo ? '' : 'girar-lento'}`} />
      <p className="titulo mt-6 text-[24px]">{fallo ? 'No he podido conectar' : 'Trayendo tus teselas…'}</p>
      {fallo ? (
        <>
          <p className="mt-2 text-[15px] text-tinta-2">¿Hay internet? Lo intento otra vez cuando quieras.</p>
          <button type="button" onClick={() => void sincronizar()} className="boton-oro mt-6 rounded-full px-6 py-2.5 font-bold">
            Reintentar
          </button>
          <button type="button" onClick={desconectar} className="mt-3 text-[14px] text-tinta-3 underline underline-offset-4">
            Empezar sin conectar
          </button>
        </>
      ) : (
        <p className="mt-2 text-[15px] text-tinta-3">Un segundito.</p>
      )}
    </div>
  )
}

function useTema() {
  const tema = useValor<Tema>('cfg:tema', 'auto')
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: light)')
    const aplicar = () => {
      const claro = tema === 'claro' || (tema === 'auto' && mq.matches)
      document.documentElement.dataset.tema = claro ? 'claro' : 'oscuro'
      document.querySelector('meta[name="theme-color"]')?.setAttribute('content', claro ? '#F5EEDF' : '#16120E')
    }
    aplicar()
    mq.addEventListener('change', aplicar)
    return () => mq.removeEventListener('change', aplicar)
  }, [tema])
}

function useEscritorio() {
  useEffect(() => {
    if (!enEscritorio) return
    const { modo, encima, cambiar } = useLocal.getState()
    const empezado = useTeselas.getState().regs.onb?.v
    void prepararVentana(empezado ? modo : 'panel', encima)
    void alCambiarEncimaDesdeBandeja((si) => cambiar({ encima: si }))
  }, [])
}
