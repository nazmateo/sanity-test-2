import type {ReactNode} from 'react'

import CompanyFeatureItem from '@/app/components/CompanyFeatureItem'

import type {CompanyFeatureItem as CompanyFeatureItemType} from '@/sanity/lib/types'

type CompaniesSectionProps = {
  sectionId?: string | null
  backgroundImage?: ReactNode
  heading: ReactNode
  items?: CompanyFeatureItemType[] | null
  resolveHref: (item: CompanyFeatureItemType) => string | null
}

export default function CompaniesSection({
  sectionId,
  backgroundImage,
  heading,
  items,
  resolveHref,
}: CompaniesSectionProps) {
  return (
    <section id={sectionId || undefined} className="companies-section-shell">
      <div className="companies-background-layer">
        {backgroundImage}
        <div className="companies-background-overlay" aria-hidden="true" />
      </div>
      <div className="companies-content-width">
        <div className="companies-main-layout">
          <div className="companies-heading-wrap">{heading}</div>
          <div className="companies-features-row">
            {(items || []).map((item, index) => {
              const href = resolveHref(item)

              if (!href) {
                return null
              }

              return (
                <CompanyFeatureItem
                  key={item._key || `company-feature-${index}`}
                  href={href}
                  title={item.title || ''}
                  category={item.category || ''}
                />
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
