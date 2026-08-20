// UBICACION: src/components/LanguageSwitcher.tsx
import { useTranslation } from 'react-i18next'
import { SUPPORTED_LANGUAGES } from '../i18n'
import type { SupportedLanguage } from '../i18n'

const BANDERAS: Record<SupportedLanguage, string> = {
  es: '/bandera-es.webp',
  en: '/bandera-en.webp'
}

export default function LanguageSwitcher() {
  const { t, i18n } = useTranslation()
  const current = i18n.resolvedLanguage as SupportedLanguage | undefined

  return (
    <nav aria-label={t('language.label')} className="-mr-5 -mt-4 flex items-center gap-0 sm:mr-0 sm:mt-0 sm:gap-1.5">
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
              'flex items-center gap-2 rounded-sm px-1.5 py-1.5',
              'sm:gap-3 sm:px-[15px] sm:py-[9px]',
              'font-mono text-xs uppercase tracking-[0.18em] sm:text-lg',
              'cursor-pointer transition-colors duration-200',
              active ? 'text-accent' : 'text-muted hover:text-ink'
            ].join(' ')}
          >
            <img
              src={BANDERAS[code]}
              alt=""
              width={20}
              height={14}
              className="h-3.5 w-5 rounded-[2px] object-cover sm:h-[21px] sm:w-[30px] sm:rounded-[3px]"
            />
            {code}
          </button>
        )
      })}
    </nav>
  )
}
