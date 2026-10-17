// El día «cambia» a las 4 de la madrugada: si algo se hace a la 1:00,
// cuenta para el día anterior (que es como se vive de verdad).
const HORA_CAMBIO = 4

export function fechaLogica(d = new Date()): string {
  const x = new Date(d.getTime() - HORA_CAMBIO * 3600_000)
  return isoLocal(x)
}

export function isoLocal(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${dd}`
}

export function desdeIso(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function sumarDias(iso: string, n: number): string {
  const d = desdeIso(iso)
  d.setDate(d.getDate() + n)
  return isoLocal(d)
}

export function diasEntre(a: string, b: string): number {
  return Math.round((desdeIso(b).getTime() - desdeIso(a).getTime()) / 86_400_000)
}

const fmtLargo = new Intl.DateTimeFormat('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })
export const fechaBonita = (d = new Date()) => fmtLargo.format(d)

export function saludo(d = new Date()): string {
  const h = d.getHours()
  if (h >= 6 && h < 13) return 'Buenos días'
  if (h >= 13 && h < 20) return 'Buenas tardes'
  return 'Buenas noches'
}
