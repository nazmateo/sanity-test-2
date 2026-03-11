import Link from 'next/link'

type CompanyFeatureItemProps = {
  href: string
  title: string
  category: string
}

export default function CompanyFeatureItem({href, title, category}: CompanyFeatureItemProps) {
  return (
    <Link href={href} className="company-feature-link">
      <article className="company-feature-card">
        <div className="company-feature-copy">
          <p className="type-company-title text-white">{title}</p>
          <p className="type-company-category text-brand-blue">{category}</p>
        </div>
        <div className="company-feature-line" aria-hidden="true" />
      </article>
    </Link>
  )
}
