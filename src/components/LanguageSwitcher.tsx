// UBICACION: src/components/LanguageSwitcher.tsx
import { useTranslation } from 'react-i18next'
import { SUPPORTED_LANGUAGES } from '../i18n'
import type { SupportedLanguage } from '../i18n'

export default function LanguageSwitcher() {
  const { t, i18n } = useTranslation()
  const current = i18n.resolvedLanguage as SupportedLanguage | undefined

  return (
    <nav aria-label={t('language.label')} className="flex items-center gap-1">
      {SUPPORTED_LANGUAGES.map((code) => {
        const active = current === code
        return (
          <button
            key={code}
            type="button"
            lang={code}
            aria-current={active ? 'true' : undefined}
            aria-label={t(`language.${code}`)}
            onClick={() => void i18n.changeLanguage(code)}
            className={[
              'font-mono text-xs uppercase tracking-[0.18em] px-2.5 py-1.5 rounded-sm',
              'transition-colors duration-200 cursor-pointer',
              active
                ? 'text-accent'
                : 'text-muted hover:text-ink'
            ].join(' ')}
          >
            {code}
          </button>
        )
      })}
    </nav>
  )
}
