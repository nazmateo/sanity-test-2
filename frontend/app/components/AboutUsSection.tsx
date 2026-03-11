import type {ReactNode} from 'react'

import AboutStatCard from '@/app/components/AboutStatCard'
import SplitButtonLink from '@/app/components/SplitButtonLink'

import type {AboutStatCard as AboutStatCardType} from '@/sanity/lib/types'

type AboutUsSectionProps = {
  sectionId?: string | null
  image: ReactNode
  textContent: ReactNode
  ctaHref?: string | null
  ctaLabel?: string | null
  stats?: AboutStatCardType[] | null
}

const statColumnHeights = [
  ['about-stat-height-tall', 'about-stat-height-short'],
  ['about-stat-height-medium', 'about-stat-height-medium'],
  ['about-stat-height-short', 'about-stat-height-tall'],
] as const

const statColumnAlignment = [
  'about-stat-column-center',
  'about-stat-column-end',
  'about-stat-column-start',
] as const

export default function AboutUsSection({
  sectionId,
  image,
  textContent,
  ctaHref,
  ctaLabel,
  stats,
}: AboutUsSectionProps) {
  const statColumns = [
    stats?.slice(0, 2) || [],
    stats?.slice(2, 4) || [],
    stats?.slice(4, 6) || [],
  ]

  return (
    <section id={sectionId || undefined} className="about-section-shell">
      <div className="about-content-width">
        <div className="about-main-layout">
          <div className="about-intro-layout">
            <div className="about-image-wrap">{image}</div>
            <div className="about-text-column">
              <div className="about-copy-stack">
                {textContent}
                {ctaHref && ctaLabel ? <SplitButtonLink href={ctaHref} label={ctaLabel} /> : null}
              </div>
            </div>
          </div>
          <div className="about-stats-grid">
            {statColumns.map((columnStats, columnIndex) => (
              <div
                key={`about-stats-column-${columnIndex}`}
                className={`about-stats-column ${statColumnAlignment[columnIndex] || ''}`}
              >
                {columnStats.map((stat, statIndex) => (
                  <div
                    key={stat._key || `about-stat-${columnIndex}-${statIndex}`}
                    className={statColumnHeights[columnIndex]?.[statIndex] || ''}
                  >
                    <AboutStatCard value={stat.value} label={stat.label} variant={stat.variant} />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
