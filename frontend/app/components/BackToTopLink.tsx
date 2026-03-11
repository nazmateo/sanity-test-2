type BackToTopLinkProps = {
  href: string
  label: string
}

function ChevronDoubleUpIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="size-3.5">
      <path
        d="M4.5 11.25 8 7.75l3.5 3.5M4.5 7.75 8 4.25l3.5 3.5"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.2"
      />
    </svg>
  )
}

export default function BackToTopLink({href, label}: BackToTopLinkProps) {
  return (
    <a href={href} className="back-to-top-link">
      <span className="type-news-read-more">{label}</span>
      <ChevronDoubleUpIcon />
    </a>
  )
}
