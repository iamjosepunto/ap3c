// UBICACION: src/rutas.ts
import type { SupportedLanguage } from './i18n'
import slugs from './slugs.json'

const IDIOMAS: readonly SupportedLanguage[] = ['en', 'es']

// La tabla vive en slugs.json para que vite.config.ts pueda leerla al compilar
// sin importar este archivo. Los slugs son fijos a proposito y no se derivan de
// los diccionarios: si cambia el texto de un menu, los enlaces ya compartidos
// siguen valiendo
export const SLUGS: Record<SupportedLanguage, readonly string[]> = slugs

export function esIdiomaValido(valor: string): valor is SupportedLanguage {
  return (IDIOMAS as readonly string[]).includes(valor)
}

// Camino del navegador para un video concreto, con el idioma por delante
export function rutaDe(idioma: string, indice: number) {
  const lang = esIdiomaValido(idioma) ? idioma : 'en'
  return `/${lang}/${SLUGS[lang][indice]}`
}

// Interpreta el camino actual; null si no corresponde a ningun video
export function leerRuta(camino: string): { idioma: SupportedLanguage; indice: number } | null {
  const partes = camino.split('/').filter(Boolean)
  if (partes.length !== 2) return null
  const [idioma, slug] = partes
  if (!esIdiomaValido(idioma)) return null
  const indice = SLUGS[idioma].indexOf(slug)
  return indice === -1 ? null : { idioma, indice }
}
