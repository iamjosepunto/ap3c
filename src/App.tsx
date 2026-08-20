// UBICACION: src/App.tsx
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from './components/LanguageSwitcher'

const OG_LOCALES: Record<string, string> = {
  es: 'es_ES',
  en: 'en_US'
}

function setMeta(selector: string, content: string) {
  const tag = document.head.querySelector<HTMLMetaElement>(selector)
  if (tag) tag.content = content
}

export default function App() {
  const { t, i18n } = useTranslation()
  const language = i18n.resolvedLanguage ?? 'en'
  const animacion = useRef<HTMLImageElement>(null)
  const [animacionLista, setAnimacionLista] = useState(false)

  // Si la imagen ya estaba en cache, onLoad no llega a dispararse
  useEffect(() => {
    if (animacion.current?.complete) setAnimacionLista(true)
  }, [])

  // El idioma activo debe reflejarse en el documento, no solo en la interfaz
  useEffect(() => {
    const title = t('meta.title')
    const description = t('meta.description')

    document.documentElement.lang = language
    document.title = title
    setMeta('meta[name="description"]', description)
    setMeta('meta[property="og:title"]', title)
    setMeta('meta[property="og:description"]', description)
    setMeta('meta[property="og:locale"]', OG_LOCALES[language] ?? 'en_US')
  }, [language, t])

  return (
    <div className="relative min-h-dvh overflow-hidden">
      <div aria-hidden="true" className="field pointer-events-none absolute inset-0" />
      <div aria-hidden="true" className="halo pointer-events-none absolute inset-0" />

      <img
        ref={animacion}
        src="/Prueba.gif"
        alt=""
        width={720}
        height={1606}
        onLoad={() => setAnimacionLista(true)}
        className={[
          'absolute left-1/2 top-0 h-dvh w-auto max-w-none -translate-x-1/2',
          'transition-opacity duration-500',
          animacionLista ? 'opacity-100' : 'opacity-0'
        ].join(' ')}
      />

      {!animacionLista && (
        <div
          role="status"
          aria-live="polite"
          className="pointer-events-none absolute inset-0 flex items-center justify-center gap-3"
        >
          <span
            aria-hidden="true"
            className="size-5 animate-spin rounded-full border-2 border-line border-t-accent"
          />
          <span className="font-mono text-xs uppercase tracking-[0.16em] text-muted">
            {t('hero.loading')}
          </span>
        </div>
      )}

      <div className="absolute left-0 top-0 z-10 flex items-start gap-0 sm:gap-1">
        <img
          src="/logo-app-place.webp"
          alt="App Place Catalog"
          width={256}
          height={256}
          className="w-16 shrink-0 sm:w-32"
        />
        <span aria-hidden="true" className="parpadeo flex h-16 shrink-0 items-center self-start text-3xl text-accent sm:h-auto sm:self-center sm:text-6xl">
          ←
        </span>
        <p className="parpadeo max-w-[9.5rem] rounded-md border border-line bg-surface/60 px-2.5 py-1.5 text-lg leading-snug text-accent sm:w-[680px] sm:max-w-none sm:self-center sm:px-4 sm:py-1.5 sm:text-4xl">
          {t('hero.tagline')}
        </p>
      </div>

      <p className="absolute bottom-1 right-1 z-10 rounded-full border border-line bg-surface/60 px-3 py-1.5 text-center font-mono text-[0.6rem] uppercase leading-relaxed tracking-[0.16em] text-muted sm:bottom-9 sm:right-10 sm:px-4 sm:py-2 sm:text-xs">
        {t('hero.status')
          .split('·')
          .map((linea) => (
            <span key={linea} className="block">
              {`<${linea.trim()}>`}
            </span>
          ))}
      </p>

      <div className="relative flex min-h-dvh flex-col px-6 py-7 sm:px-10 sm:py-9">
        <header className="flex items-start justify-end gap-4">
          <LanguageSwitcher />
        </header>

        <main className="flex-1" />

        <footer className="-mb-6 -ml-4 flex flex-wrap items-center gap-x-1.5 gap-y-1 font-mono text-[0.7rem] tracking-[0.1em] text-muted/70 sm:mb-0 sm:ml-0 sm:text-xs">
          <span className="flex items-center gap-1.5">
            © {new Date().getFullYear()}
            <img src="/logo-ap3c.webp" alt="ap3c.app" className="h-3.5 w-auto sm:h-4" />
          </span>
          <span className="w-full whitespace-nowrap text-[0.6rem] sm:w-auto sm:text-xs">
            <span className="hidden sm:inline">· </span>
            {t('footer.rights')}
          </span>
        </footer>
      </div>
    </div>
  )
}
