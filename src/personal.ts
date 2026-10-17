// ─────────────────────────────────────────────────────────────
//  Lo personal. Este es el archivo para tocar a mano.
// ─────────────────────────────────────────────────────────────

export const NOMBRE = 'Mirian'

/** Cómo te llama ella. Aparece en las notas y en «Escribir a …». */
export const PAREJA = 'Ray'

/** Se ve una sola vez, al abrir la app por primera vez. Escríbela tú. */
export const DEDICATORIA = `${PAREJA} ha hecho esto para ti.`

/**
 * Las notas para ella se escriben en el BUZÓN (enlace en Ajustes → Portátil y móvil),
 * que es privado. Este repositorio es público: lo que pongas aquí lo puede leer cualquiera.
 *
 * Aun así, si quieres dejar alguna nota fija en el código, va así (id único que no cambie):
 *   { id: 'n1', texto: '…' },
 */
export const NOTAS: { id: string; texto: string }[] = [
  // { id: 'n1', texto: '…' },
]

/** La web del temario de las oposiciones. */
export const WEB_TEMARIO = 'https://ray86-dev.github.io/opo-admin-ull/#'
