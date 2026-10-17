import { Check, Cloud, CloudOff, Copy, Mail, QrCode, RefreshCw } from 'lucide-react'
import { useMemo, useState } from 'react'
import { renderSVG } from 'uqr'
import { activarNube, desconectar, enlaceBuzon, enlaceUnir, sincronizar, useNube } from '../lib/nube'
import { PAREJA } from '../personal'

function haceCuanto(ms: number | null) {
  if (!ms) return 'todavía no'
  const min = Math.round((Date.now() - ms) / 60_000)
  if (min < 1) return 'hace un momento'
  if (min < 60) return `hace ${min} min`
  const h = Math.round(min / 60)
  return h < 24 ? `hace ${h} h` : `hace ${Math.round(h / 24)} días`
}

export function SeccionNube() {
  const { clave, buzon, estado, ultima } = useNube()
  const [activando, setActivando] = useState(false)
  const [error, setError] = useState(false)
  const [verQr, setVerQr] = useState(false)
  const [copiado, setCopiado] = useState<string | null>(null)

  const qr = useMemo(() => (clave && verQr ? renderSVG(enlaceUnir(clave), { pixelSize: 6, whiteColor: '#fffaf0', blackColor: '#2a1f0e' }) : ''), [clave, verQr])

  const copiar = async (texto: string, que: string) => {
    try {
      await navigator.clipboard.writeText(texto)
      setCopiado(que)
      window.setTimeout(() => setCopiado(null), 2000)
    } catch {
      /* sin portapapeles */
    }
  }

  if (!clave) {
    return (
      <div className="space-y-3">
        <p className="text-[15px] leading-snug text-tinta-2">
          Para seguir en el móvil lo que hagas aquí (y recibir notas de {PAREJA}), activa la nube. Tus cositas quedan protegidas con una clave secreta que solo tienen tus dispositivos.
        </p>
        <button
          type="button"
          disabled={activando}
          onClick={async () => {
            setActivando(true)
            setError(false)
            try {
              await activarNube()
            } catch {
              setError(true)
            }
            setActivando(false)
          }}
          className="boton-oro flex w-full items-center justify-center gap-2 rounded-full px-4 py-2.5 text-[15px] font-bold disabled:opacity-60"
        >
          <Cloud size={18} /> {activando ? 'Activando…' : 'Activar la nube'}
        </button>
        {error && <p className="text-[13px] text-amapola">No he podido conectar. ¿Hay internet?</p>}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-[14px] text-tinta-2">
        {estado === 'sin-conexion' ? <CloudOff size={17} className="text-tinta-3" /> : <Cloud size={17} className="text-oro" />}
        <span className="flex-1">{estado === 'sin-conexion' ? 'Sin conexión. Se sincroniza sola cuando vuelva.' : `Sincronizado ${haceCuanto(ultima)}`}</span>
        <button type="button" onClick={() => void sincronizar()} className="grid size-8 place-items-center rounded-full text-tinta-3 hover:text-oro" aria-label="Sincronizar ahora">
          <RefreshCw size={16} className={estado === 'sincronizando' ? 'animate-spin' : ''} />
        </button>
      </div>

      <button
        type="button"
        onClick={() => setVerQr((v) => !v)}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-borde-fuerte bg-tarjeta px-3 py-2.5 text-[14px] font-semibold"
      >
        <QrCode size={17} /> {verQr ? 'Ocultar el código' : 'Llevar Teselas al móvil'}
      </button>

      {verQr && (
        <div className="rounded-2xl border border-borde-fuerte bg-[#fffaf0] p-4 text-center text-[#2a1f0e]">
          <div className="mx-auto w-[200px] [&>svg]:h-auto [&>svg]:w-full" dangerouslySetInnerHTML={{ __html: qr }} />
          <p className="mt-3 text-[14px] leading-snug">
            Escanéalo con la cámara del móvil. Se abrirá Teselas con tus cositas. Luego, en el menú del navegador: <strong>«Añadir a pantalla de inicio»</strong>.
          </p>
          <button
            type="button"
            onClick={() => void copiar(enlaceUnir(clave), 'unir')}
            className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-[#2a1f0e]/25 px-3 py-1.5 text-[13px] font-semibold"
          >
            {copiado === 'unir' ? <Check size={14} /> : <Copy size={14} />} {copiado === 'unir' ? 'Copiado' : 'Copiar el enlace'}
          </button>
          <p className="mt-2 text-[12px] opacity-70">Este enlace es como una llave: mejor no compartirlo.</p>
        </div>
      )}

      {buzon && (
        <div className="rounded-xl border border-borde px-3 py-3">
          <p className="flex items-center gap-2 text-[14px] font-semibold">
            <Mail size={16} className="text-amapola" /> Buzón de {PAREJA}
          </p>
          <p className="mt-1 text-[13px] leading-snug text-tinta-3">
            Con este enlace, {PAREJA} puede dejarte notas que te aparecerán en las ventanitas. No puede ver tus cositas ni tu cielo.
          </p>
          <button
            type="button"
            onClick={() => void copiar(enlaceBuzon(buzon), 'buzon')}
            className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-borde-fuerte px-3 py-1.5 text-[13px] font-semibold text-tinta-2"
          >
            {copiado === 'buzon' ? <Check size={14} /> : <Copy size={14} />} {copiado === 'buzon' ? 'Copiado' : `Copiar el enlace para ${PAREJA}`}
          </button>
        </div>
      )}

      <button type="button" onClick={desconectar} className="text-[13px] text-tinta-3 underline underline-offset-4 hover:text-tinta-2">
        Desconectar este dispositivo
      </button>
    </div>
  )
}
