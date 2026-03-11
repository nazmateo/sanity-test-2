import Link from 'next/link'

type HeroPhraseItem = {
  _key?: string
  text?: string | null
}

type HeroSectionProps = {
  sectionId?: string | null
  backgroundImageUrl?: string | null
  backgroundVideoUrl?: string | null
  heroPhrases?: HeroPhraseItem[] | null
  leftContent?: React.ReactNode
  rightContent?: React.ReactNode
  ctaHref?: string | null
  ctaLabel?: string | null
}

const HERO_PHRASE_POSITIONS = [
  {left: '22.9%', top: '22.6%'},
  {left: '65.2%', top: '44.3%'},
  {left: '8.8%', bottom: '4rem'},
] as const

function ChevronDoubleDownIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="size-3.5">
      <path
        d="M4.5 4.75 8 8.25l3.5-3.5M4.5 8.25 8 11.75l3.5-3.5"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.2"
      />
    </svg>
  )
}

export default function HeroSection({
  sectionId,
  backgroundImageUrl,
  backgroundVideoUrl,
  heroPhrases,
  leftContent,
  rightContent,
  ctaHref,
  ctaLabel,
}: HeroSectionProps) {
  const phrases = heroPhrases?.slice(0, 3) || []

  return (
    <section id={sectionId || undefined} className="hero-section-shell">
      <div className="hero-media-layer">
        {backgroundVideoUrl ? (
          <video
            src={backgroundVideoUrl}
            autoPlay
            muted
            loop
            playsInline
            className="size-full object-cover"
          />
        ) : backgroundImageUrl ? (
          <img src={backgroundImageUrl} alt="" aria-hidden className="size-full object-cover" />
        ) : (
          <div className="size-full bg-black" />
        )}
      </div>

      <div className="hero-overlay-layer" aria-hidden />

      <div className="hero-phrases-layer" aria-hidden>
        {phrases.map((phrase, index) => {
          const position = HERO_PHRASE_POSITIONS[index]
          const delayClassName =
            index === 0 ? 'hero-phrase-delay-1' : index === 1 ? 'hero-phrase-delay-2' : 'hero-phrase-delay-3'

          return (
            <div
              key={phrase._key || `hero-phrase-${index}`}
              className={`hero-phrase-chip hero-phrase-animate ${delayClassName}`}
              style={position}
            >
              <span className="hero-phrase-shape" />
              <span className="type-hero-phrase relative z-10 text-center text-white">{phrase.text || ''}</span>
            </div>
          )
        })}
      </div>

      <div className="container relative z-10">
        <div className="hero-content-width hero-content-layout">
          <div className="hero-columns-layout">
            <div className="hero-left-column">{leftContent}</div>
            <div className="hero-right-column hero-copy-stack lg:justify-self-end">{rightContent}</div>
          </div>

          {ctaHref && ctaLabel ? (
            <div className="flex justify-end fixed bottom-8 right-8 z-20 lg:right-20">
              <Link href={ctaHref} className="hero-cta-button type-hero-cta">
                <span>{ctaLabel}</span>
                <ChevronDoubleDownIcon />
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
