// UBICACION: src/App.tsx
import { useEffect, useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from './components/LanguageSwitcher'

const VELOCIDADES = [1, 1.5, 2, 3, 4]

function reloj(segundos: number) {
  const m = Math.floor(segundos / 60)
  const s = Math.floor(segundos % 60)
  return `${m}:${String(s).padStart(2, '0')}`
}

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
  const video = useRef<HTMLVideoElement>(null)
  const [animacionLista, setAnimacionLista] = useState(false)
  const [cartelVisible, setCartelVisible] = useState(true)
  const [posicionPanel, setPosicionPanel] = useState<number | null>(null)
  const zonaVideo = useRef<HTMLDivElement>(null)
  const panel = useRef<HTMLDivElement>(null)
  const arrastre = useRef<{ desdeY: number; desdePos: number } | null>(null)
  const [enPausa, setEnPausa] = useState(false)
  const [velocidad, setVelocidad] = useState(VELOCIDADES.length - 1)
  const [tiempo, setTiempo] = useState(0)
  const [duracion, setDuracion] = useState(0)

  // Si el video ya estaba en cache, onLoadedData no llega a dispararse
  useEffect(() => {
    if ((video.current?.readyState ?? 0) >= 2) setAnimacionLista(true)
  }, [])

  // Mantiene sincronizados el reloj y la barra con la reproduccion
  useEffect(() => {
    const v = video.current
    if (!v) return
    // defaultPlaybackRate es el que el navegador aplica al cargar la fuente
    v.defaultPlaybackRate = VELOCIDADES[VELOCIDADES.length - 1]
    v.playbackRate = VELOCIDADES[VELOCIDADES.length - 1]
    const alAvanzar = () => setTiempo(v.currentTime)
    const alTenerDatos = () => setDuracion(Number.isFinite(v.duration) ? v.duration : 0)
    v.addEventListener('timeupdate', alAvanzar)
    v.addEventListener('loadedmetadata', alTenerDatos)
    alTenerDatos()
    return () => {
      v.removeEventListener('timeupdate', alAvanzar)
      v.removeEventListener('loadedmetadata', alTenerDatos)
    }
  }, [])

  // El navegador reinicia playbackRate al cargar el video, hay que reaplicarlo
  useEffect(() => {
    if (video.current) video.current.playbackRate = VELOCIDADES[velocidad]
  }, [velocidad, animacionLista])

  // Un solo boton recorre las velocidades y vuelve al principio
  const siguienteVelocidad = () => {
    setVelocidad((i) => (i + 1) % VELOCIDADES.length)
  }

  // El panel se arrastra solo en vertical y sin salirse del area del video
  const empezarArrastre = (e: ReactPointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button, input')) return
    const zona = zonaVideo.current
    const p = panel.current
    if (!zona || !p) return
    arrastre.current = {
      desdeY: e.clientY,
      desdePos: p.getBoundingClientRect().top - zona.getBoundingClientRect().top
    }
    p.setPointerCapture(e.pointerId)
  }

  const moverArrastre = (e: ReactPointerEvent<HTMLDivElement>) => {
    const a = arrastre.current
    const zona = zonaVideo.current
    const p = panel.current
    if (!a || !zona || !p) return
    const tope = zona.clientHeight - p.offsetHeight
    setPosicionPanel(Math.min(tope, Math.max(0, a.desdePos + (e.clientY - a.desdeY))))
  }

  const soltarArrastre = (e: ReactPointerEvent<HTMLDivElement>) => {
    arrastre.current = null
    panel.current?.releasePointerCapture(e.pointerId)
  }

  const irA = (segundos: number) => {
    const v = video.current
    if (!v) return
    v.currentTime = segundos
    setTiempo(segundos)
  }

  const alternarPausa = () => {
    const v = video.current
    if (!v) return
    if (v.paused) {
      void v.play()
      setEnPausa(false)
    } else {
      v.pause()
      setEnPausa(true)
    }
  }

  const detener = () => {
    const v = video.current
    if (!v) return
    v.pause()
    v.currentTime = 0
    setEnPausa(true)
  }

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

      <div ref={zonaVideo} className="absolute inset-x-0 top-[70px] mx-auto aspect-[720/1606] h-[calc(100dvh-134px)] sm:top-0 sm:h-dvh">
        <video
          ref={video}
          src="/Prueba.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onLoadedData={() => setAnimacionLista(true)}
          className={[
            'h-full w-full',
            'transition-opacity duration-500',
            animacionLista ? 'opacity-100' : 'opacity-0'
          ].join(' ')}
        />
        {animacionLista && (
          <div
            ref={panel}
            onPointerDown={empezarArrastre}
            onPointerMove={moverArrastre}
            onPointerUp={soltarArrastre}
            onPointerCancel={soltarArrastre}
            style={posicionPanel === null ? undefined : { top: posicionPanel, bottom: 'auto' }}
            className={[
              'absolute inset-x-0 z-20 select-none border-y border-line/60 bg-surface/50 px-2 py-1.5 backdrop-blur-sm',
              'cursor-ns-resize touch-none',
              posicionPanel === null ? 'bottom-28 sm:bottom-36' : ''
            ].join(' ')}
          >
            <div className="relative flex items-center justify-start gap-3">
              {[
                { etiqueta: t('controls.stop'), simbolo: '\u25A0', accion: detener },
                {
                  etiqueta: enPausa ? t('controls.play') : t('controls.pause'),
                  simbolo: enPausa ? '\u25B6' : '\u2759\u2759',
                  accion: alternarPausa
                },
                { etiqueta: t('controls.faster'), simbolo: '>>>', accion: siguienteVelocidad }
              ].map((b) => (
                <button
                  key={b.etiqueta}
                  type="button"
                  onClick={b.accion}
                  aria-label={b.etiqueta}
                  title={b.etiqueta}
                  className="cursor-pointer rounded-sm px-2 py-1 font-mono text-[2.45rem] leading-none text-muted transition-colors hover:bg-line/40 hover:text-ink sm:text-[2.625rem]"
                >
                  {b.simbolo}
                </button>
              ))}
              <span className="absolute right-1 font-mono text-[1.4rem] leading-none text-accent sm:text-2xl">
                {VELOCIDADES[velocidad]}x
              </span>
            </div>

            <div className="mt-1.5 flex items-center gap-2">
              <input
                type="range"
                min={0}
                max={duracion || 0}
                step={0.1}
                value={Math.min(tiempo, duracion || 0)}
                onChange={(e) => irA(Number(e.target.value))}
                aria-label={t('controls.timeline')}
                className="h-1 w-full cursor-pointer touch-auto accent-accent"
              />
              <span className="shrink-0 font-mono text-[1.3rem] leading-none tabular-nums text-muted sm:text-[1.4rem]">
                {reloj(tiempo)} / {reloj(duracion)}
              </span>
            </div>
          </div>
        )}
      </div>

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
        {cartelVisible && (
          <>
            <span aria-hidden="true" className="parpadeo flex h-16 shrink-0 items-center self-start text-3xl text-accent sm:h-auto sm:self-center sm:text-6xl">
              ←
            </span>
            <button
              type="button"
              onClick={() => setCartelVisible(false)}
              title={t('hero.dismiss')}
              className="parpadeo max-w-[9.5rem] cursor-pointer rounded-md border border-line bg-surface/60 px-2.5 py-1.5 text-left text-lg leading-snug text-accent sm:w-[680px] sm:max-w-none sm:self-center sm:px-4 sm:py-1.5 sm:text-4xl"
            >
              {t('hero.tagline')}
            </button>
          </>
        )}
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
