// Un «tin» suave de campanita, sintetizado (sin archivos de audio).

let ctx: AudioContext | null = null

function contexto(): AudioContext | null {
  try {
    ctx ??= new AudioContext()
    if (ctx.state === 'suspended') void ctx.resume()
    return ctx
  } catch {
    return null
  }
}

function nota(c: AudioContext, frecuencia: number, empieza: number, dura: number, volumen: number) {
  const osc = c.createOscillator()
  const gan = c.createGain()
  osc.type = 'sine'
  osc.frequency.value = frecuencia
  gan.gain.setValueAtTime(0, empieza)
  gan.gain.linearRampToValueAtTime(volumen, empieza + 0.01)
  gan.gain.exponentialRampToValueAtTime(0.0001, empieza + dura)
  osc.connect(gan).connect(c.destination)
  osc.start(empieza)
  osc.stop(empieza + dura + 0.05)
}

/** Al poner una tesela. */
export function tin() {
  const c = contexto()
  if (!c) return
  const t = c.currentTime
  nota(c, 1318.5, t, 0.9, 0.07) // mi
  nota(c, 2637, t, 0.5, 0.02) // armónico
  nota(c, 1975.5, t + 0.09, 1.1, 0.05) // si
}

/** Al terminar un temporizador o completar un cuadro. */
export function campanitas() {
  const c = contexto()
  if (!c) return
  const t = c.currentTime
  ;[1046.5, 1318.5, 1568, 2093].forEach((f, i) => nota(c, f, t + i * 0.12, 1.4, 0.05))
}
