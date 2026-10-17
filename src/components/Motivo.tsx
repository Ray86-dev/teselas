// Motivos de Klimt dibujados a mano en SVG: círculos concéntricos, espiral,
// rectángulos del manto de «El beso», flor del prado y el «ojo» del árbol de la vida.

export function Motivo({ n, className }: { n: number; className?: string }) {
  const tipo = ((n % 5) + 5) % 5
  return (
    <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" className={className} aria-hidden>
      {tipo === 0 && (
        <>
          <circle cx="20" cy="20" r="13" />
          <circle cx="20" cy="20" r="8" />
          <circle cx="20" cy="20" r="3" fill="currentColor" stroke="none" />
        </>
      )}
      {tipo === 1 && <path d="M20 20c0-2 2-3 3.5-2s1.5 4-1 5.5-6.5.5-7.5-3 1.5-8 6-8.5 9.5 3 9.5 7.5-3.5 10-9 10.5-12-3-12.5-9" />}
      {tipo === 2 && (
        <>
          <rect x="9" y="7" width="9" height="26" rx="1" />
          <rect x="22" y="12" width="9" height="16" rx="1" />
          <rect x="24.5" y="16" width="4" height="8" fill="currentColor" stroke="none" />
        </>
      )}
      {tipo === 3 && (
        <>
          {[0, 60, 120, 180, 240, 300].map((a) => (
            <circle key={a} cx={20 + 8 * Math.cos((a * Math.PI) / 180)} cy={20 + 8 * Math.sin((a * Math.PI) / 180)} r="4.5" />
          ))}
          <circle cx="20" cy="20" r="3" fill="currentColor" stroke="none" />
        </>
      )}
      {tipo === 4 && (
        <>
          <path d="M6 20c5-8 23-8 28 0-5 8-23 8-28 0Z" />
          <circle cx="20" cy="20" r="4" fill="currentColor" stroke="none" />
        </>
      )}
    </svg>
  )
}
