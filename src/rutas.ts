// UBICACION: src/rutas.ts
import type { SupportedLanguage } from './i18n'

// Solo se importa el tipo, nunca i18next: asi vite.config.ts puede leer este
// archivo durante la compilacion sin arrastrar la libreria entera
const IDIOMAS: readonly SupportedLanguage[] = ['en', 'es']

// Los slugs son fijos a proposito y no se derivan de los diccionarios: si algun
// dia cambia el texto de un menu, las direcciones ya compartidas siguen valiendo
export const SLUGS: Record<SupportedLanguage, readonly string[]> = {
  en: [
    'start',
    'change-language',
    'upload-an-image',
    'change-profile-picture',
    'change-nickname',
    'location',
    'sign-out',
    'delete-account',
    'warnings',
    'apps',
    'contact'
  ],
  es: [
    'empezar',
    'cambiar-idioma',
    'subir-una-imagen',
    'cambiar-imagen-de-perfil',
    'cambiar-nickname',
    'ubicacion',
    'cerrar-sesion',
    'eliminar-cuenta',
    'warnings',
    'apps',
    'contacto'
  ]
}

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
