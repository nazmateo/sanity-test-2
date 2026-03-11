import Link from 'next/link'

type ArrowSquareLinkProps = {
  href: string
  label: string
  className?: string
}

export default function ArrowSquareLink({href, label, className}: ArrowSquareLinkProps) {
  return (
    <Link
      href={href}
      aria-label={label}
      className={className ? `arrow-square-link ${className}` : 'arrow-square-link'}
    >
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M6.5 14H21.5M21.5 14L14.5 7M21.5 14L14.5 21"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Link>
  )
}
