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

      <div className="relative flex min-h-dvh flex-col px-6 py-7 sm:px-10 sm:py-9">
        <header className="flex items-center justify-between gap-4">
          <span className="font-mono text-sm tracking-[0.14em] text-muted">
            ap<span className="text-accent">3</span>c.app
          </span>
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

          <p
            className="reveal mt-5 max-w-[30ch] text-balance text-base leading-relaxed text-muted sm:mt-6 sm:max-w-[38ch] sm:text-xl"
            style={{ animationDelay: '200ms' }}
          >
            {t('hero.tagline')}
          </p>

          <p
            className="reveal mt-9 rounded-full border border-line bg-surface/60 px-4 py-2 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-muted sm:text-xs"
            style={{ animationDelay: '310ms' }}
          >
            {t('hero.status')}
          </p>
        </main>

        <footer className="font-mono text-[0.7rem] tracking-[0.1em] text-muted/70 sm:text-xs">
          © {new Date().getFullYear()} ap3c.app
          <span className="hidden sm:inline"> · {t('footer.rights')}</span>
        </footer>
      </div>
    </div>
  )
}
