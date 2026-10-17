import { WEB_TEMARIO } from '../personal'

export type Peldano = 1 | 2 | 3 | 4
export type Momento = 'manana' | 'tarde' | 'noche' | 'cuando'
export type Categoria = 'cuidarme' | 'moverme' | 'disfrutar' | 'casa' | 'conectar' | 'estudiar' | 'belleza' | 'descanso'

export type Accion =
  | { tipo: 'enlace'; etiqueta: string; url: string }
  | { tipo: 'musica'; etiqueta: string; canciones: string[] }
  | { tipo: 'respirar' }
  | { tipo: 'temporizador'; minutos: number; enlace?: { etiqueta: string; url: string } }

export interface Cosita {
  id: string
  titulo: string
  pista?: string
  emoji: string
  peldano: Peldano
  categoria: Categoria
  momento: Momento
  accion?: Accion
  propia?: boolean
}

export const PELDANOS: Record<Peldano, { nombre: string; emoji: string; lema: string; dias: number }> = {
  1: { nombre: 'Semilla', emoji: '🌱', lema: 'Un minuto, de verdad', dias: 0 },
  2: { nombre: 'Brote', emoji: '🌿', lema: 'Unos cinco minutos', dias: 7 },
  3: { nombre: 'Flor', emoji: '🌷', lema: 'De diez a quince minutos', dias: 21 },
  4: { nombre: 'Jardín', emoji: '🌳', lema: 'Rutinas enteras', dias: 45 },
}

export const MOMENTOS: Record<Momento, string> = {
  manana: 'Por la mañana',
  tarde: 'Por la tarde',
  noche: 'Por la noche',
  cuando: 'Cuando sea',
}

const ANIMO = [
  'Valerie Amy Winehouse Mark Ronson',
  'Tears Dry on Their Own Amy Winehouse',
  'Despechá Rosalía',
  'Bizcochito Rosalía',
  'Con altura Rosalía',
  'Love Lana Del Rey',
  'Searchin My Soul Vonda Shepard',
]
const CALMA = [
  'Our Day Will Come Amy Winehouse',
  'Body and Soul Amy Winehouse Tony Bennett',
  'Mariners Apartment Complex Lana Del Rey',
  'hope is a dangerous thing for a woman like me to have Lana Del Rey',
  'Video Games Lana Del Rey',
  'Pienso en tu mirá Rosalía',
  'Sakura Rosalía',
]
const BAILE = ['Despechá Rosalía', 'Saoko Rosalía', 'Malamente Rosalía', 'Con altura Rosalía', 'Bizcochito Rosalía']

export const CANCIONES = { animo: ANIMO, calma: CALMA, baile: BAILE }

export const COSITAS: Cosita[] = [
  // ── Semilla ────────────────────────────────────────────────
  { id: 'agua', titulo: 'Beber un vaso de agua', pista: 'Uno. Despacito.', emoji: '💧', peldano: 1, categoria: 'cuidarme', momento: 'cuando' },
  { id: 'ventana', titulo: 'Abrir la ventana o la persiana', pista: 'Que entre un poco de luz.', emoji: '🪟', peldano: 1, categoria: 'casa', momento: 'manana' },
  { id: 'cara', titulo: 'Lavarme la cara', pista: 'Agua fresquita y listo.', emoji: '🫧', peldano: 1, categoria: 'cuidarme', momento: 'manana' },
  { id: 'cancion', titulo: 'Escuchar una canción que me guste', pista: 'Te propongo una, si quieres.', emoji: '🎧', peldano: 1, categoria: 'disfrutar', momento: 'cuando', accion: { tipo: 'musica', etiqueta: 'Ponerla', canciones: [...ANIMO, ...CALMA] } },
  { id: 'estirar', titulo: 'Estirarme como un gato', pista: 'Brazos arriba y tres respiraciones.', emoji: '🐈', peldano: 1, categoria: 'moverme', momento: 'manana' },
  { id: 'respirar', titulo: 'Respirar un minuto', pista: 'Yo te marco el ritmo.', emoji: '🍃', peldano: 1, categoria: 'descanso', momento: 'cuando', accion: { tipo: 'respirar' } },
  { id: 'edredon', titulo: 'Estirar el edredón', pista: 'No hace falta que quede perfecto.', emoji: '🛏️', peldano: 1, categoria: 'casa', momento: 'manana' },
  { id: 'crema', titulo: 'Ponerme crema de manos o bálsamo', pista: 'Un gesto de mimo.', emoji: '🧴', peldano: 1, categoria: 'belleza', momento: 'cuando' },
  { id: 'dientes', titulo: 'Lavarme los dientes', emoji: '🪥', peldano: 1, categoria: 'cuidarme', momento: 'noche' },
  { id: 'una-cosa', titulo: 'Dejar una sola cosa en su sitio', pista: 'Una. Solo una.', emoji: '🧺', peldano: 1, categoria: 'casa', momento: 'cuando' },
  { id: 'asomarme', titulo: 'Asomarme fuera un minuto', pista: 'Balcón, ventana o puerta.', emoji: '🌤️', peldano: 1, categoria: 'moverme', momento: 'cuando' },
  { id: 'luz-bonita', titulo: 'Encender una luz bonita', pista: 'Una lámpara o una vela.', emoji: '🕯️', peldano: 1, categoria: 'casa', momento: 'noche' },

  // ── Brote ──────────────────────────────────────────────────
  { id: 'ducha', titulo: 'Darme una ducha', pista: 'Con música, mejor.', emoji: '🚿', peldano: 2, categoria: 'cuidarme', momento: 'cuando' },
  { id: 'ropa', titulo: 'Ponerme ropa de estar', pista: 'Adiós, pijama (hasta la noche).', emoji: '👚', peldano: 2, categoria: 'cuidarme', momento: 'manana' },
  { id: 'bailar', titulo: 'Bailar una canción de Rosalía', pista: 'Nadie mira. O sí, da igual.', emoji: '💃', peldano: 2, categoria: 'moverme', momento: 'cuando', accion: { tipo: 'musica', etiqueta: 'Ponerla', canciones: BAILE } },
  { id: 'caminar-5', titulo: 'Caminar cinco minutos', pista: 'Por casa también vale.', emoji: '👟', peldano: 2, categoria: 'moverme', momento: 'cuando', accion: { tipo: 'temporizador', minutos: 5 } },
  { id: 'labial', titulo: 'Ponerme mi labial favorito', pista: 'Aunque no salga de casa.', emoji: '💄', peldano: 2, categoria: 'belleza', momento: 'cuando' },
  { id: 'mensaje', titulo: 'Mandar un mensaje a alguien que quiero', pista: 'Un «¿qué tal?» basta.', emoji: '💌', peldano: 2, categoria: 'conectar', momento: 'tarde' },
  { id: 'rincon', titulo: 'Ordenar un rincón pequeño', pista: 'La mesilla, un estante…', emoji: '🪴', peldano: 2, categoria: 'casa', momento: 'tarde' },
  { id: 'ter', titulo: 'Ver un vídeo de Ter', pista: 'Arquitectura y curiosidades.', emoji: '📐', peldano: 2, categoria: 'disfrutar', momento: 'tarde', accion: { tipo: 'enlace', etiqueta: 'Abrir YouTube', url: 'https://www.youtube.com/results?search_query=Ter+arquitectura' } },
  { id: 'pagina', titulo: 'Leer una página', pista: 'Una sola. Si luego quieres más, más.', emoji: '📖', peldano: 2, categoria: 'disfrutar', momento: 'noche' },
  { id: 'temario-mirar', titulo: 'Abrir el temario y mirar el índice', pista: 'Solo mirar. Nada más.', emoji: '🗂️', peldano: 2, categoria: 'estudiar', momento: 'tarde', accion: { tipo: 'enlace', etiqueta: 'Abrir el temario', url: `${WEB_TEMARIO}/temario` } },
  { id: 'desayuno', titulo: 'Desayunar algo rico, sentada', pista: 'Sin pantallas, si puede ser.', emoji: '☕', peldano: 2, categoria: 'cuidarme', momento: 'manana' },
  { id: 'planta', titulo: 'Regar una planta', pista: 'O saludarla, que también cuenta.', emoji: '🌿', peldano: 2, categoria: 'casa', momento: 'manana' },
  { id: 'movil-fuera', titulo: 'Dejar el móvil lejos de la cama', pista: 'Para dormir un poquito mejor.', emoji: '🌙', peldano: 2, categoria: 'descanso', momento: 'noche' },

  // ── Flor ───────────────────────────────────────────────────
  { id: 'paseo-15', titulo: 'Salir a pasear un cuarto de hora', pista: 'Con cascos y tu música.', emoji: '🚶‍♀️', peldano: 3, categoria: 'moverme', momento: 'cuando', accion: { tipo: 'temporizador', minutos: 15 } },
  { id: 'temario-escuchar', titulo: 'Escuchar diez minutos de un tema', pista: 'La web te lo lee en voz alta.', emoji: '🎙️', peldano: 3, categoria: 'estudiar', momento: 'tarde', accion: { tipo: 'temporizador', minutos: 10, enlace: { etiqueta: 'Abrir el tema 1', url: `${WEB_TEMARIO}/tema/1-01` } } },
  { id: 'resumen', titulo: 'Leer el resumen de un tema', pista: 'Solo el resumen. Es cortito.', emoji: '📝', peldano: 3, categoria: 'estudiar', momento: 'tarde', accion: { tipo: 'enlace', etiqueta: 'Abrir un resumen', url: `${WEB_TEMARIO}/tema/1-01?tab=resumen` } },
  { id: 'flashcards', titulo: 'Diez minutos de flashcards', pista: 'Tarjetitas, sin presión.', emoji: '🃏', peldano: 3, categoria: 'estudiar', momento: 'tarde', accion: { tipo: 'temporizador', minutos: 10, enlace: { etiqueta: 'Abrir flashcards', url: `${WEB_TEMARIO}/flashcards` } } },
  { id: 'cocinar', titulo: 'Cocinar algo sencillo', pista: 'Con música de fondo.', emoji: '🍳', peldano: 3, categoria: 'cuidarme', momento: 'tarde' },
  { id: 'maquillaje', titulo: 'Maquillarme con calma', pista: '¿Un eyeliner a lo Amy?', emoji: '💋', peldano: 3, categoria: 'belleza', momento: 'manana' },
  { id: 'unas', titulo: 'Pintarme las uñas', pista: 'Modo Rosalía.', emoji: '💅', peldano: 3, categoria: 'belleza', momento: 'tarde' },
  { id: 'decorar', titulo: 'Cambiar algo de sitio en casa', pista: 'Un cojín, una lámina, una planta.', emoji: '🖼️', peldano: 3, categoria: 'casa', momento: 'tarde' },
  { id: 'leer-10', titulo: 'Leer diez minutos', pista: 'Un cuento corto es perfecto.', emoji: '📚', peldano: 3, categoria: 'disfrutar', momento: 'noche', accion: { tipo: 'temporizador', minutos: 10 } },
  { id: 'llamar', titulo: 'Llamar a alguien', pista: 'Aunque sean cinco minutos.', emoji: '📞', peldano: 3, categoria: 'conectar', momento: 'tarde' },
  { id: 'piel', titulo: 'Mi rutina de cuidado de la piel', pista: 'Limpiar, hidratar y ya.', emoji: '🌸', peldano: 3, categoria: 'belleza', momento: 'noche' },
  { id: 'dormir', titulo: 'Acostarme a una hora amable', pista: 'Antes de medianoche, por ejemplo.', emoji: '😴', peldano: 3, categoria: 'descanso', momento: 'noche' },

  // ── Jardín ─────────────────────────────────────────────────
  { id: 'manana-bonita', titulo: 'Mi mañana bonita', pista: 'Agua, ventana, cara y ropa de estar.', emoji: '☀️', peldano: 4, categoria: 'cuidarme', momento: 'manana' },
  { id: 'pomodoro', titulo: 'Veinticinco minutos de estudio', pista: 'Un pomodoro. Luego, descanso.', emoji: '⏳', peldano: 4, categoria: 'estudiar', momento: 'tarde', accion: { tipo: 'temporizador', minutos: 25, enlace: { etiqueta: 'Abrir el temario', url: `${WEB_TEMARIO}/temario` } } },
  { id: 'test', titulo: 'Hacer un test cortito', pista: 'Diez preguntas. Fallar también enseña.', emoji: '✅', peldano: 4, categoria: 'estudiar', momento: 'tarde', accion: { tipo: 'enlace', etiqueta: 'Abrir los tests', url: `${WEB_TEMARIO}/test` } },
  { id: 'paseo-30', titulo: 'Pasear media hora', pista: 'Un pódcast o un disco entero.', emoji: '🌳', peldano: 4, categoria: 'moverme', momento: 'cuando', accion: { tipo: 'temporizador', minutos: 30 } },
  { id: 'noche-tranquila', titulo: 'Mi noche tranquila', pista: 'Dientes, piel, móvil lejos y luz bajita.', emoji: '🌙', peldano: 4, categoria: 'descanso', momento: 'noche' },
  { id: 'casa-15', titulo: 'Un cuarto de hora de casa', pista: 'Con «Back to Black» de fondo.', emoji: '🏡', peldano: 4, categoria: 'casa', momento: 'tarde', accion: { tipo: 'temporizador', minutos: 15 } },
  { id: 'plan', titulo: 'Hacer un plan con alguien', pista: 'Un café, un paseo, una peli.', emoji: '🎟️', peldano: 4, categoria: 'conectar', momento: 'cuando' },
  { id: 'peli', titulo: 'Ver una peli de las mías', pista: 'Rohmer, Woody Allen, Kieślowski…', emoji: '🎬', peldano: 4, categoria: 'disfrutar', momento: 'noche' },
]

export const COSITAS_POR_ID: Record<string, Cosita> = Object.fromEntries(COSITAS.map((c) => [c.id, c]))

/** Las cositas del refugio: para días de tormenta. Cuentan como tesela, pero no se eligen. */
export const REFUGIO: Cosita[] = [
  { id: 'refugio-agua', titulo: 'Beber un poco de agua', emoji: '💧', peldano: 1, categoria: 'cuidarme', momento: 'cuando' },
  { id: 'refugio-cancion', titulo: 'Escuchar una canción bonita', emoji: '🎧', peldano: 1, categoria: 'descanso', momento: 'cuando', accion: { tipo: 'musica', etiqueta: 'Ponerla', canciones: CALMA } },
  { id: 'refugio-respirar', titulo: 'Respirar un minuto conmigo', emoji: '🍃', peldano: 1, categoria: 'descanso', momento: 'cuando', accion: { tipo: 'respirar' } },
  { id: 'refugio-manta', titulo: 'Tumbarme con una manta cinco minutos', emoji: '🛋️', peldano: 1, categoria: 'descanso', momento: 'cuando' },
]
for (const c of REFUGIO) COSITAS_POR_ID[c.id] = c

export const SEMILLAS_INICIO = ['agua', 'ventana', 'cancion', 'cara', 'estirar', 'respirar']
