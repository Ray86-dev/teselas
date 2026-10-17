// Cuadros de Gustav Klimt (1862–1918), todos de dominio público.
// Imágenes de Wikimedia Commons. Cada cosita hecha descubre una tesela.

export interface Cuadro {
  id: string
  titulo: string
  fecha: string
  lugar?: string
  texto: string
  cols: number
  filas: number
  /** ancho / alto de la imagen */
  ratio: number
  fuente: string
}

export const CUADROS: Cuadro[] = [
  {
    id: 'beso',
    titulo: 'El beso',
    fecha: '1907–1908',
    lugar: 'Belvedere, Viena',
    texto: 'Lo pintó en plena «etapa dorada», con pan de oro de verdad sobre el lienzo. Y tú lo has visto en persona.',
    cols: 5, filas: 5, ratio: 0.997,
    fuente: 'https://commons.wikimedia.org/wiki/File:The_Kiss_-_Gustav_Klimt_-_Google_Cultural_Institute.jpg',
  },
  {
    id: 'amapolas',
    titulo: 'Amapolas en flor',
    fecha: '1907',
    lugar: 'Belvedere, Viena',
    texto: 'Un prado de amapolas pintado en verano. Klimt sin oro, pero con todo el color.',
    cols: 6, filas: 6, ratio: 0.981,
    fuente: 'https://commons.wikimedia.org/wiki/File:Blooming_Poppies_-_Klimt.jpg',
  },
  {
    id: 'adele',
    titulo: 'Adele Bloch-Bauer I',
    fecha: '1907',
    lugar: 'Neue Galerie, Nueva York',
    texto: '«La dama de oro». Robado por los nazis y recuperado por su sobrina, Maria Altmann, en 2006.',
    cols: 6, filas: 6, ratio: 1,
    fuente: 'https://commons.wikimedia.org/wiki/File:Gustav_Klimt_-_Portr%C3%A4t_der_Adele_Bloch-Bauer_I_(1907).jpg',
  },
  {
    id: 'girasoles',
    titulo: 'Jardín con girasoles',
    fecha: 'h. 1907',
    lugar: 'Belvedere, Viena',
    texto: 'Un jardín de campo, cuadrado y lleno de flores. Klimt también tenía su lado jardinero.',
    cols: 6, filas: 6, ratio: 0.982,
    fuente: 'https://commons.wikimedia.org/wiki/File:Klimt_-_Bauerngarten_mit_Sonnenblumen_-_ca1907.jpeg',
  },
  {
    id: 'arbol',
    titulo: 'El árbol de la vida',
    fecha: '1910–1911',
    lugar: 'MAK, Viena',
    texto: 'Un boceto para el friso del Palacio Stoclet, en Bruselas. Ramas que se enroscan en espirales sin fin.',
    cols: 4, filas: 8, ratio: 0.515,
    fuente: 'https://commons.wikimedia.org/wiki/File:Gustav_Klimt_032.jpg',
  },
  {
    id: 'abedules',
    titulo: 'Bosque de abedules',
    fecha: '1903',
    lugar: 'Colección privada',
    texto: 'Abedules en otoño y el suelo cubierto de hojas. Para mirarlo despacio.',
    cols: 7, filas: 7, ratio: 1.014,
    fuente: 'https://commons.wikimedia.org/wiki/File:Gustav_Klimt,_Birch_Forest,_1903_-_Paul_G._Allen_Collection.jpg',
  },
  {
    id: 'attersee',
    titulo: 'Schloss Kammer en el Attersee III',
    fecha: '1909–1910',
    lugar: 'Belvedere, Viena',
    texto: 'Un castillo a la orilla del lago, reflejado en el agua. Dicen que Klimt encuadraba sus paisajes con prismáticos.',
    cols: 7, filas: 7, ratio: 0.991,
    fuente: 'https://commons.wikimedia.org/wiki/File:Gustav_Klimt_-_Schloss_Kammer_am_Attersee_III_-_4318_-_%C3%96sterreichische_Galerie_Belvedere.jpg',
  },
  {
    id: 'emilie',
    titulo: 'Retrato de Emilie Flöge',
    fecha: '1902',
    lugar: 'Wien Museum, Viena',
    texto: 'Emilie, diseñadora de moda y compañera de Klimt toda la vida. Dicen que a ella este retrato no le terminaba de gustar.',
    cols: 4, filas: 9, ratio: 0.442,
    fuente: 'https://commons.wikimedia.org/wiki/File:Portrait_Emilie_Fl%C3%B6ge_Gustav_Klimt_1902.jpg',
  },
  {
    id: 'jardin',
    titulo: 'Jardín de campo',
    fecha: '1907',
    lugar: 'Colección privada',
    texto: 'Un jardín en flor pintado muy de cerca, como si estuvieras dentro.',
    cols: 7, filas: 7, ratio: 0.982,
    fuente: 'https://commons.wikimedia.org/wiki/File:Klimt_bauerngarten.jpg',
  },
  {
    id: 'rosales',
    titulo: 'Rosales bajo los árboles',
    fecha: 'h. 1905',
    texto: 'Estuvo en el Museo de Orsay hasta 2022, cuando Francia lo devolvió a la familia a la que se lo arrebataron los nazis.',
    cols: 8, filas: 8, ratio: 1,
    fuente: 'https://commons.wikimedia.org/wiki/File:Gustav_Klimt_-_Rosebushes_under_the_Trees_-_Google_Art_Project.jpg',
  },
]

export const teselasDe = (c: Cuadro) => c.cols * c.filas
export const imagenDe = (c: Cuadro) => `${import.meta.env.BASE_URL}cuadros/${c.id}.jpg`
export const miniDe = (c: Cuadro) => `${import.meta.env.BASE_URL}cuadros/${c.id}-mini.jpg`
