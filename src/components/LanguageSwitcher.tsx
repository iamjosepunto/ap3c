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
    <nav aria-label={t('language.label')} className="flex items-center gap-1.5">
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
              'flex items-center gap-3 rounded-sm px-[15px] py-[9px]',
              'font-mono text-lg uppercase tracking-[0.18em]',
              'cursor-pointer transition-colors duration-200',
              active ? 'text-accent' : 'text-muted hover:text-ink'
            ].join(' ')}
          >
            <img
              src={BANDERAS[code]}
              alt=""
              width={30}
              height={21}
              className="h-[21px] w-[30px] rounded-[3px] object-cover"
            />
            {code}
          </button>
        )
      })}
    </nav>
  )
}
