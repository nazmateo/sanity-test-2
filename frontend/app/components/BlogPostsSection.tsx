import type {ReactNode} from 'react'

import BackToTopLink from '@/app/components/BackToTopLink'

type BlogPostsSectionProps = {
  sectionId?: string | null
  featuredPost: ReactNode
  postsGrid: ReactNode
  backToTopHref?: string | null
  backToTopLabel?: string | null
}

export default function BlogPostsSection({
  sectionId,
  featuredPost,
  postsGrid,
  backToTopHref,
  backToTopLabel,
}: BlogPostsSectionProps) {
  return (
    <section id={sectionId || undefined} className="news-section-shell">
      <div className="news-content-width">
        <div className="news-main-layout">
          <div className="news-featured-row">{featuredPost}</div>
          <div className="news-cards-row">{postsGrid}</div>
          {backToTopHref && backToTopLabel ? (
            <div className="news-back-to-top-row">
              <BackToTopLink href={backToTopHref} label={backToTopLabel} />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
