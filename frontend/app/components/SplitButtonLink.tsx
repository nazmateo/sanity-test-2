import Link from 'next/link'

type SplitButtonLinkProps = {
  href: string
  label: string
  className?: string
}

export default function SplitButtonLink({href, label, className}: SplitButtonLinkProps) {
  return (
    <Link href={href} className={className ? `about-cta-link ${className}` : 'about-cta-link'}>
      <span className="about-cta-label type-about-cta">{label}</span>
      <span className="about-cta-arrow" aria-hidden="true">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M6.5 14H21.5M21.5 14L14.5 7M21.5 14L14.5 21"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </Link>
  )
}
