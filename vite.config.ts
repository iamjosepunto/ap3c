// UBICACION: vite.config.ts
import { defineConfig } from 'vite'
import type { Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { SLUGS } from './src/rutas'

const DOMINIO = 'https://ap3c.app'
const IDIOMAS = ['en', 'es'] as const
const OG_LOCALES = { en: 'en_US', es: 'es_ES' } as const

type Idioma = (typeof IDIOMAS)[number]

function leerDiccionario(idioma: Idioma) {
  const crudo = readFileSync(join(__dirname, 'src', 'locales', `${idioma}.json`), 'utf8')
  return JSON.parse(crudo) as {
    meta: { title: string; description: string }
    hero: { title: string }
    videos: Record<string, string>
  }
}

function escapar(texto: string) {
  return texto.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
}

// Sustituye el contenido de una etiqueta meta sin depender del formato ni de
// los saltos de linea, que vite puede haber compactado al compilar
function ponerMeta(html: string, atributo: string, clave: string, valor: string) {
  const patron = new RegExp(`<meta\\s+${atributo}="${clave}"[\\s\\S]*?/?>`, 'i')
  return html.replace(patron, `<meta ${atributo}="${clave}" content="${escapar(valor)}" />`)
}

function paginaDe(plantilla: string, idioma: Idioma, indice: number) {
  const dic = leerDiccionario(idioma)
  const alterno: Idioma = idioma === 'es' ? 'en' : 'es'
  const camino = `/${idioma}/${SLUGS[idioma][indice]}`
  const url = `${DOMINIO}${camino}`
  const titulo = `${dic.videos[`v${indice}`]} \u2014 ${dic.hero.title}`
  const descripcion = dic.meta.description

  let html = plantilla
  html = html.replace(/<html lang="[^"]*"/i, `<html lang="${idioma}"`)
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapar(titulo)}</title>`)
  html = ponerMeta(html, 'name', 'description', descripcion)
  html = ponerMeta(html, 'property', 'og:title', titulo)
  html = ponerMeta(html, 'property', 'og:description', descripcion)
  html = ponerMeta(html, 'property', 'og:url', url)
  html = ponerMeta(html, 'property', 'og:locale', OG_LOCALES[idioma])
  html = ponerMeta(html, 'property', 'og:locale:alternate', OG_LOCALES[alterno])
  html = html.replace(/<link\s+rel="canonical"[\s\S]*?\/?>/i, `<link rel="canonical" href="${url}" />`)

  // hreflang: le dice al buscador que estas dos paginas son la misma en dos idiomas
  const alternas = [
    `<link rel="alternate" hreflang="${idioma}" href="${url}" />`,
    `<link rel="alternate" hreflang="${alterno}" href="${DOMINIO}/${alterno}/${SLUGS[alterno][indice]}" />`,
    `<link rel="alternate" hreflang="x-default" href="${DOMINIO}/en/${SLUGS.en[indice]}" />`
  ].join('\n    ')

  return html.replace(/<\/head>/i, `  ${alternas}\n  </head>`)
}

function sitemapDe() {
  const urls = IDIOMAS.flatMap((idioma) =>
    SLUGS[idioma].map((slug) => `  <url><loc>${DOMINIO}/${idioma}/${slug}</loc></url>`)
  )
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`
}

// Genera una carpeta por video y idioma, cada una con su index.html propio.
// Asi GitHub Pages responde 200 con el titulo correcto sin redirigir a nada
function prerenderizar(): Plugin {
  return {
    name: 'ap3c-prerender',
    apply: 'build',
    closeBundle() {
      const salida = join(__dirname, 'dist')
      const raiz = join(salida, 'index.html')
      const plantilla = readFileSync(raiz, 'utf8')
      let generadas = 0

      for (const idioma of IDIOMAS) {
        SLUGS[idioma].forEach((slug, indice) => {
          const carpeta = join(salida, idioma, slug)
          mkdirSync(carpeta, { recursive: true })
          writeFileSync(join(carpeta, 'index.html'), paginaDe(plantilla, idioma, indice), 'utf8')
          generadas++
        })
      }

      // La raiz apunta al primer video en ingles para no duplicar contenido
      writeFileSync(
        raiz,
        plantilla.replace(
          /<link\s+rel="canonical"[\s\S]*?\/?>/i,
          `<link rel="canonical" href="${DOMINIO}/en/${SLUGS.en[0]}" />`
        ),
        'utf8'
      )

      // Red de seguridad: cualquier direccion inventada carga la web igualmente
      copyFileSync(raiz, join(salida, '404.html'))
      writeFileSync(join(salida, 'sitemap.xml'), sitemapDe(), 'utf8')

      console.log(`ap3c-prerender: ${generadas} paginas, 404.html y sitemap.xml`)
    }
  }
}

export default defineConfig({
  // Dominio propio: el sitio se sirve desde la raiz, no desde /ap3c/
  base: '/',
  plugins: [react(), tailwindcss(), prerenderizar()],
  build: {
    outDir: 'dist',
    sourcemap: false
  }
})
