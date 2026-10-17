import { isTauri } from '@tauri-apps/api/core'

export type ServicioMusica = 'youtube' | 'spotify' | 'ytmusic'

export const SERVICIOS: Record<ServicioMusica, string> = {
  youtube: 'YouTube',
  spotify: 'Spotify',
  ytmusic: 'YouTube Music',
}

export function urlMusica(busqueda: string, servicio: ServicioMusica): string {
  const q = encodeURIComponent(busqueda)
  if (servicio === 'spotify') return `https://open.spotify.com/search/${q}`
  if (servicio === 'ytmusic') return `https://music.youtube.com/search?q=${q}`
  return `https://www.youtube.com/results?search_query=${q}`
}

export async function abrirEnlace(url: string) {
  if (isTauri()) {
    const { openUrl } = await import('@tauri-apps/plugin-opener')
    await openUrl(url)
  } else {
    window.open(url, '_blank', 'noopener')
  }
}
