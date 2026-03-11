import ArrowSquareLink from '@/app/components/ArrowSquareLink'
import {Image} from '@/app/components/atoms/image'

type NewsPostCardProps = {
  title: string
  date: string
  href: string
  imageUrl?: string | null
  imageAlt?: string | null
  excerpt?: string | null
  featured?: boolean
}

export default function NewsPostCard({
  title,
  date,
  href,
  imageUrl,
  imageAlt,
  excerpt,
  featured = false,
}: NewsPostCardProps) {
  if (featured) {
    return (
      <article className="news-featured-card">
        <div className="news-featured-inner">
          <div className="news-featured-media-wrap">
            {imageUrl ? (
              <Image src={imageUrl} alt={imageAlt || title} unstyled className="news-featured-media" />
            ) : (
              <div className="news-featured-media-placeholder" aria-hidden="true" />
            )}
          </div>
          <div className="news-featured-copy">
            <p className="type-news-meta text-foreground/50">{date}</p>
            <div className="news-featured-text">
              <h3 className="type-news-featured-title text-foreground">{title}</h3>
              {excerpt ? <p className="type-news-body text-foreground">{excerpt}</p> : null}
            </div>
            <a href={href} className="type-news-read-more text-brand-blue no-underline">
              READ MORE
            </a>
          </div>
        </div>
        <div className="news-card-arrow">
          <ArrowSquareLink href={href} label={`Read more: ${title}`} />
        </div>
      </article>
    )
  }

  return (
    <article className="news-card">
      <div className="news-card-inner">
        <div className="news-card-text">
          <p className="type-news-meta text-foreground/50">{date}</p>
          <h3 className="type-news-title text-foreground">{title}</h3>
        </div>
        <a href={href} className="type-news-read-more text-brand-blue underline underline-offset-2">
          READ MORE
        </a>
      </div>
      <div className="news-card-arrow">
        <ArrowSquareLink href={href} label={`Read more: ${title}`} />
      </div>
    </article>
  )
}
