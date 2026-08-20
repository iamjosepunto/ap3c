// UBICACION: src/App.tsx
import { useEffect } from 'react'
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

      <p className="absolute bottom-3 right-1 z-10 rounded-full border border-line bg-surface/60 px-4 py-2 text-center font-mono text-[0.7rem] uppercase leading-relaxed tracking-[0.16em] text-muted sm:bottom-9 sm:right-10 sm:text-xs">
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

        <main className="flex flex-1 flex-col items-center justify-center py-16 text-center">
          <svg
            aria-hidden="true"
            viewBox="0 0 40 40"
            className="reveal size-9 sm:size-10"
            style={{ animationDelay: '0ms' }}
          >
            <g className="fill-line">
              <rect x="0" y="0" width="17" height="17" rx="5" />
              <rect x="23" y="0" width="17" height="17" rx="5" />
              <rect x="0" y="23" width="17" height="17" rx="5" />
            </g>
            <rect x="23" y="23" width="17" height="17" rx="5" className="fill-accent" />
          </svg>

          <h1
            className="reveal mt-8 font-display text-[clamp(2.5rem,9.5vw,6.25rem)] font-semibold leading-[0.95] tracking-[-0.035em]"
            style={{ animationDelay: '90ms' }}
          >
            {t('hero.title')}
          </h1>
        </main>

        <footer className="-mb-4 -ml-4 flex flex-wrap items-center gap-x-1.5 gap-y-1 font-mono text-[0.7rem] tracking-[0.1em] text-muted/70 sm:mb-0 sm:ml-0 sm:text-xs">
          <span className="flex items-center gap-1.5">
            © {new Date().getFullYear()}
            <img src="/logo-ap3c.webp" alt="ap3c.app" className="h-3.5 w-auto sm:h-4" />
          </span>
          <span className="w-full whitespace-nowrap sm:w-auto">
            <span className="hidden sm:inline">· </span>
            {t('footer.rights')}
          </span>
        </footer>
      </div>
    </div>
  )
}
