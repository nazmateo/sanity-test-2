import type {ReactNode} from 'react'

import ArrowSquareLink from '@/app/components/ArrowSquareLink'

type SectorsSectionProps = {
  sectionId?: string | null
  heading: ReactNode
  leftImage?: ReactNode
  rightImage?: ReactNode
  ctaHref?: string | null
  ctaLabel?: string | null
}

export default function SectorsSection({
  sectionId,
  heading,
  leftImage,
  rightImage,
  ctaHref,
  ctaLabel,
}: SectorsSectionProps) {
  return (
    <section id={sectionId || undefined} className="sectors-section-shell">
      <div className="sectors-content-width">
        <div className="sectors-main-layout">
          <div className="sectors-heading-wrap">{heading}</div>
          <div className="sectors-body-layout">
            <div className="sectors-list-stack">
              {leftImage ? <div className="sectors-left-image-layer">{leftImage}</div> : null}
              <div className="sectors-list-fade" aria-hidden="true" />
            </div>
            <div className="sectors-media-frame">
              {rightImage}
              {ctaHref && ctaLabel ? (
                <div className="sectors-media-cta">
                  <span className="sectors-media-label type-about-cta">{ctaLabel}</span>
                  <ArrowSquareLink href={ctaHref} label={ctaLabel} />
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
