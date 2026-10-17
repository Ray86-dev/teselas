export type TipoSorpresa = 'cancion' | 'pantalla' | 'klimt' | 'viaje' | 'lectura' | 'belleza' | 'casa' | 'permiso' | 'nota'

export interface Sorpresa {
  id: string
  tipo: TipoSorpresa
  emoji: string
  titulo: string
  texto: string
  /** Búsqueda para el servicio de música elegido */
  musica?: string
  enlace?: { etiqueta: string; url: string }
}

export const ETIQUETA_TIPO: Record<TipoSorpresa, string> = {
  cancion: 'Una canción',
  pantalla: 'Para ver',
  klimt: 'Klimt y Viena',
  viaje: 'Recuerdos',
  lectura: 'Para leer',
  belleza: 'Belleza',
  casa: 'Casa bonita',
  permiso: 'Permiso oficial',
  nota: 'Una nota',
}

const yt = (q: string) => `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`

export const SORPRESAS: Sorpresa[] = [
  // ── Canciones ──────────────────────────────────────────────
  { id: 'c-valerie', tipo: 'cancion', emoji: '🎺', titulo: '«Valerie»', texto: 'Amy Winehouse con Mark Ronson. Imposible escucharla sin mover un pie.', musica: 'Valerie Amy Winehouse Mark Ronson' },
  { id: 'c-tears', tipo: 'cancion', emoji: '🎙️', titulo: '«Tears Dry on Their Own»', texto: 'Amy, con ese ritmo de los sesenta. Las lágrimas se secan solas. Y se secan.', musica: 'Tears Dry on Their Own Amy Winehouse' },
  { id: 'c-ourday', tipo: 'cancion', emoji: '🌅', titulo: '«Our Day Will Come»', texto: 'La versión dulce de Amy. Nuestro día llegará.', musica: 'Our Day Will Come Amy Winehouse' },
  { id: 'c-body', tipo: 'cancion', emoji: '🎷', titulo: '«Body and Soul»', texto: 'Amy y Tony Bennett, juntos, cantando jazz. Para escuchar con los ojos cerrados.', musica: 'Body and Soul Amy Winehouse Tony Bennett' },
  { id: 'c-btb', tipo: 'cancion', emoji: '💿', titulo: '«Back to Black», entero', texto: 'Hoy toca disco completo. Para hacer cualquier cosa de casa como una diva.', musica: 'Back to Black Amy Winehouse album' },
  { id: 'c-hope', tipo: 'cancion', emoji: '🕊️', titulo: 'Una de Lana con título largo', texto: 'Se llama «hope is a dangerous thing for a woman like me to have – but I have it». La esperanza es peligrosa para una mujer como yo, pero la tengo.', musica: 'hope is a dangerous thing for a woman like me to have Lana Del Rey' },
  { id: 'c-love', tipo: 'cancion', emoji: '💛', titulo: '«Love»', texto: 'Lana en su versión más luminosa.', musica: 'Love Lana Del Rey' },
  { id: 'c-mariners', tipo: 'cancion', emoji: '🌊', titulo: '«Mariners Apartment Complex»', texto: 'Lana Del Rey. Para escuchar mirando por la ventana.', musica: 'Mariners Apartment Complex Lana Del Rey' },
  { id: 'c-young', tipo: 'cancion', emoji: '🥂', titulo: '«Young and Beautiful»', texto: 'Lana, orquesta y purpurina de los años veinte.', musica: 'Young and Beautiful Lana Del Rey' },
  { id: 'c-videogames', tipo: 'cancion', emoji: '📼', titulo: '«Video Games»', texto: 'La canción con la que empezó todo para Lana.', musica: 'Video Games Lana Del Rey' },
  { id: 'c-malamente', tipo: 'cancion', emoji: '👏', titulo: '«Malamente»', texto: 'Rosalía, palmas y energía. Para venirse arriba un poquito.', musica: 'Malamente Rosalía' },
  { id: 'c-pienso', tipo: 'cancion', emoji: '🌹', titulo: '«Pienso en tu mirá»', texto: 'Rosalía, de «El mal querer». Un disco que cuenta una historia de principio a fin.', musica: 'Pienso en tu mirá Rosalía' },
  { id: 'c-despecha', tipo: 'cancion', emoji: '🪩', titulo: '«Despechá»', texto: 'Para bailar en la cocina. Aunque sea un ratito.', musica: 'Despechá Rosalía' },
  { id: 'c-bizcochito', tipo: 'cancion', emoji: '🍰', titulo: '«Bizcochito»', texto: 'Dos minutos de pura chulería de Rosalía.', musica: 'Bizcochito Rosalía' },
  { id: 'c-ally', tipo: 'cancion', emoji: '🎹', titulo: '«Searchin\' My Soul»', texto: 'Vonda Shepard, la canción de Ally McBeal. Imposible no imaginarse el bar donde canta Vonda.', musica: 'Searchin My Soul Vonda Shepard' },

  // ── Para ver ───────────────────────────────────────────────
  { id: 'p-ally', tipo: 'pantalla', emoji: '⚖️', titulo: 'Un capítulo de Ally McBeal', texto: 'Esta noche, con manta y sin culpa.' },
  { id: 'p-baby', tipo: 'pantalla', emoji: '👶', titulo: 'El bebé bailarín', texto: 'El famoso bebé que bailaba en las visiones de Ally fue uno de los primeros memes de internet, allá por los noventa.', enlace: { etiqueta: 'Verlo bailar', url: yt('Ally McBeal dancing baby') } },
  { id: 'p-bygones', tipo: 'pantalla', emoji: '🤝', titulo: '«Bygones»', texto: 'Richard Fish lo resolvía todo con una palabra: lo pasado, pasado. Hoy también vale.' },
  { id: 'p-cage', tipo: 'pantalla', emoji: '🎶', titulo: 'El truco de John Cage', texto: 'En Ally McBeal, Cage se ponía a Barry White en la cabeza para venirse arriba. ¿Cuál sería tu canción para entrar en escena?' },
  { id: 'p-2hm', tipo: 'pantalla', emoji: '🛋️', titulo: 'Dos hombres y medio', texto: 'Un capítulo, en el sofá, juntos. Reírse también es una rutina.' },
  { id: 'p-berta', tipo: 'pantalla', emoji: '🧹', titulo: 'Actitud Berta', texto: 'Hoy, como la Berta de Dos hombres y medio: hacer lo justo, con estilo y una frase lapidaria.' },
  { id: 'p-rayo', tipo: 'pantalla', emoji: '🌇', titulo: '«El rayo verde»', texto: 'Rohmer: una chica que no termina de encontrar su sitio y espera ver el último rayo de sol. Una peli para cualquier tarde.' },
  { id: 'p-estaciones', tipo: 'pantalla', emoji: '🍂', titulo: 'Un cuento por estación', texto: 'Rohmer rodó cuatro cuentos, uno para cada estación del año. ¿Y si ves el de la estación en la que estamos?' },
  { id: 'p-azul', tipo: 'pantalla', emoji: '💙', titulo: '«Tres colores: Azul»', texto: 'Juliette Binoche nadando sola en una piscina azul. Kieślowski sabía filmar la tristeza, y también la vuelta a la vida.' },
  { id: 'p-rojo', tipo: 'pantalla', emoji: '❤️', titulo: '«Tres colores: Rojo»', texto: 'Irène Jacob y un juez jubilado que escucha a sus vecinos. La más luminosa de las tres.' },
  { id: 'p-veronica', tipo: 'pantalla', emoji: '🔮', titulo: '«La doble vida de Verónica»', texto: 'Si te gustó «Rojo»: también de Kieślowski y también con Irène Jacob. Pura música.' },
  { id: 'p-rosa', tipo: 'pantalla', emoji: '🎞️', titulo: '«La rosa púrpura de El Cairo»', texto: 'Mia Farrow se refugia en el cine… y el protagonista sale de la pantalla a buscarla.' },
  { id: 'p-paris', tipo: 'pantalla', emoji: '🗼', titulo: '«Medianoche en París»', texto: 'Un paseo nocturno en el que, al dar las doce, todo puede pasar.' },
  { id: 'p-hannah', tipo: 'pantalla', emoji: '🍁', titulo: '«Hannah y sus hermanas»', texto: 'Tres hermanas, tres cenas de Acción de Gracias y mucho Nueva York.' },
  { id: 'p-ter', tipo: 'pantalla', emoji: '📐', titulo: 'Un vídeo de Ter', texto: 'Para acompañar el café: arquitectura, ciudades y curiosidades.', enlace: { etiqueta: 'Abrir YouTube', url: yt('Ter arquitectura') } },

  // ── Klimt y Viena ──────────────────────────────────────────
  { id: 'k-padre', tipo: 'klimt', emoji: '🪙', titulo: 'Oro de familia', texto: 'El padre de Klimt era grabador de oro. Quizá por eso el oro acabó en sus cuadros.' },
  { id: 'k-beso', tipo: 'klimt', emoji: '🖼️', titulo: 'Tú lo has visto de cerca', texto: '«El Beso» mide 180 × 180 centímetros. En persona impone, ¿verdad?' },
  { id: 'k-belvedere', tipo: 'klimt', emoji: '🏛️', titulo: 'Casi recién pintado', texto: '«El Beso» vive en el Belvedere de Viena. El Estado austriaco lo compró en 1908, nada más exponerse.' },
  { id: 'k-emilie', tipo: 'klimt', emoji: '👗', titulo: 'Emilie Flöge', texto: 'La compañera de Klimt era diseñadora de moda: hacía vestidos amplios, sin corsé, para que las mujeres pudieran respirar.' },
  { id: 'k-adele', tipo: 'klimt', emoji: '✨', titulo: 'La dama de oro', texto: 'El retrato dorado de Adele Bloch-Bauer lo robaron los nazis. Su sobrina, Maria Altmann, lo recuperó en 2006 tras años de juicios. Hay peli: «La dama de oro».' },
  { id: 'k-attersee', tipo: 'klimt', emoji: '🏞️', titulo: 'Veranos en el lago', texto: 'En verano, Klimt pintaba paisajes junto al lago Attersee. Casi siempre en lienzos cuadrados.' },
  { id: 'k-bata', tipo: 'klimt', emoji: '🥻', titulo: 'Comodidad ante todo', texto: 'Klimt pintaba con un blusón largo, como una túnica. Hoy, ropa cómoda y a lo tuyo.' },
  { id: 'k-secesion', tipo: 'klimt', emoji: '🌿', titulo: 'Un lema', texto: '«A cada época su arte, al arte su libertad». Lo dice la fachada de la Secesión de Viena, de la que Klimt fue el primer presidente.' },
  { id: 'k-cafe', tipo: 'klimt', emoji: '☕', titulo: 'Café vienés', texto: 'En los cafés de Viena el café llega con un vaso de agua y todo el tiempo del mundo. Hoy, café sin prisa.' },

  // ── Recuerdos ──────────────────────────────────────────────
  { id: 'v-irlanda', tipo: 'viaje', emoji: '☘️', titulo: 'Ese verde', texto: 'Busca una foto de Irlanda, de aquel viaje, y ponla de fondo de pantalla.' },
  { id: 'v-viena', tipo: 'viaje', emoji: '🎡', titulo: 'Viena en una foto', texto: 'Abre las fotos de Viena y elige tu favorita. Solo mirarla un ratito.' },
  { id: 'v-slainte', tipo: 'viaje', emoji: '🥛', titulo: '¡Sláinte!', texto: 'Así brindan en Irlanda: «salud». Brindemos con un vaso de agua.' },
  { id: 'v-lluvia', tipo: 'viaje', emoji: '🌧️', titulo: 'Lluvia irlandesa', texto: 'En Irlanda llueve muchísimo y por eso todo es tan verde. A veces la lluvia también hace crecer cosas.' },
  { id: 'v-proximo', tipo: 'viaje', emoji: '🧳', titulo: 'Soñar no cuesta', texto: 'Si pudieras volver mañana a Viena o a Irlanda, ¿qué es lo primero que harías?' },

  // ── Para leer ──────────────────────────────────────────────
  { id: 'l-perras', tipo: 'lectura', emoji: '🐾', titulo: '«Perras de reserva»', texto: 'De Dahlia de la Cerda: cuentos cortos, rabiosos y muy vivos. Con uno solo, hoy, es suficiente.' },
  { id: 'l-zulos', tipo: 'lectura', emoji: '🔥', titulo: '«Desde los zulos»', texto: 'Ensayos de Dahlia de la Cerda sobre un feminismo desde abajo. Para leer a trocitos.' },
  { id: 'l-medea', tipo: 'lectura', emoji: '🎤', titulo: '«Medea me cantó un corrido»', texto: 'La novela de Dahlia de la Cerda. Para cuando apetezca algo más largo.' },
  { id: 'l-wiener', tipo: 'lectura', emoji: '📰', titulo: 'Gabriela Wiener', texto: 'Crónicas en primera persona, valientes y con humor. «Sexografías» se lee a mordiscos.' },
  { id: 'l-ziga', tipo: 'lectura', emoji: '🐕', titulo: '«Devenir perra»', texto: 'De Itziar Ziga: feminismo gamberro. Un capítulo y una sonrisa de lado.' },
  { id: 'l-malas', tipo: 'lectura', emoji: '🌙', titulo: '«Las malas»', texto: 'De Camila Sosa Villada: una familia elegida de travestis en Córdoba, Argentina. Dura y tierna a la vez.' },
  { id: 'l-oidos', tipo: 'lectura', emoji: '🎧', titulo: 'Leer con los oídos', texto: 'Truco para días de poca concentración: un audiolibro o un pódcast mientras haces otra cosa. También es leer.' },

  // ── Belleza ────────────────────────────────────────────────
  { id: 'b-amy', tipo: 'belleza', emoji: '🐱', titulo: 'Eyeliner a lo Amy', texto: 'Una línea gruesa y un rabito largo. No tiene que salir perfecto: el de Amy era de todo menos tímido.' },
  { id: 'b-lana', tipo: 'belleza', emoji: '🌺', titulo: 'Look Lana', texto: 'Piel luminosa, eyeliner suave y una flor en el pelo. Aunque sea para estar en casa.' },
  { id: 'b-rosalia', tipo: 'belleza', emoji: '💅', titulo: 'Uñas Rosalía', texto: 'Un color atrevido o una pegatina brillante. Una sola uña decorada ya cuenta.' },
  { id: 'b-labial', tipo: 'belleza', emoji: '💄', titulo: 'El labial olvidado', texto: 'Ese que hace tiempo que no usas: hoy es su día.' },
  { id: 'b-spa', tipo: 'belleza', emoji: '🧖‍♀️', titulo: 'Spa en casa', texto: 'Una mascarilla y cinco minutos tumbada. Sin salir de casa.' },

  // ── Casa bonita ────────────────────────────────────────────
  { id: 'h-flores', tipo: 'casa', emoji: '💐', titulo: 'Algo vivo en la mesa', texto: 'Unas flores, unas ramas o unas hierbas en un vaso con agua. La mesa cambia.' },
  { id: 'h-luz', tipo: 'casa', emoji: '💡', titulo: 'Luz de tarde', texto: 'Esta tarde, apaga la luz del techo y deja solo lámparas o velas.' },
  { id: 'h-cojin', tipo: 'casa', emoji: '🛋️', titulo: 'Un cambio pequeño', texto: 'Mueve un cojín, una manta o una lámina. A veces un rincón solo necesita eso.' },
  { id: 'h-pinterest', tipo: 'casa', emoji: '📌', titulo: 'Soñar rincones', texto: 'Busca «rincón de lectura» en Pinterest y guarda el que más te guste. Solo soñar.', enlace: { etiqueta: 'Abrir Pinterest', url: 'https://www.pinterest.es/search/pins/?q=rinc%C3%B3n%20de%20lectura' } },
  { id: 'h-lamina', tipo: 'casa', emoji: '🖼️', titulo: 'Klimt en casa', texto: '¿Y si «El Beso» acabara también en una pared de casa? Una lámina, una postal, un imán…' },
  { id: 'h-olor', tipo: 'casa', emoji: '🍊', titulo: 'Un olor bonito', texto: 'Una vela, un incienso o una naranja con clavos. La casa también se siente por la nariz.' },

  // ── Permisos oficiales ─────────────────────────────────────
  { id: 's-sl', tipo: 'permiso', emoji: '🌐', titulo: 'Second Life', texto: 'Permiso oficial para un rato de Second Life sin ninguna culpa. Descansar también es esto.' },
  { id: 's-tb', tipo: 'permiso', emoji: '🏰', titulo: 'Total Battle', texto: 'Permiso para una partida. Construir, aunque sea con píxeles, también es construir.' },
  { id: 's-siesta', tipo: 'permiso', emoji: '💤', titulo: 'Siesta', texto: 'Permiso para veinte minutos de siesta. Con alarma, eso sí.' },
  { id: 's-no', tipo: 'permiso', emoji: '✋', titulo: 'Decir que no', texto: 'Permiso para decir que no a algo hoy. Sin dar explicaciones.' },
  { id: 's-nada', tipo: 'permiso', emoji: '🫶', titulo: 'Ya está', texto: 'Permiso para no hacer nada más hoy. Lo de hoy ya cuenta.' },
]
