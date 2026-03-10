import Link from 'next/link'

import Image from '@/app/components/SanityImage'
import type {LayoutSettings} from '@/app/components/Header'
import {isExternalContentLink, resolveContentLinkHref} from '@/sanity/lib/utils'

type ContentLink = {
  linkType?: 'external' | 'internal' | null
  internalTargetType?: 'page' | 'path' | null
  internalPageSlug?: string | null
  externalUrl?: string | null
  internalPath?: string | null
  openInNewTab?: boolean | null
}

type MenuSubLink = {
  _key?: string
  itemId?: string | null
  label?: string | null
  link?: ContentLink | null
}

type MenuLink = {
  _key?: string
  itemId?: string | null
  label?: string | null
  link?: ContentLink | null
}

type MenuGroup = {
  _key?: string
  menuId?: string | null
  title?: string | null
  links?: MenuLink[] | null
}

type FooterImage = {
  asset?: {_ref?: string; _id?: string} | null
  alt?: string | null
} | null

type FooterVariant = 'positive' | 'negative'

export type SiteFooter = {
  _id?: string
  positiveLogo?: FooterImage
  negativeLogo?: FooterImage
  officeHeading?: string | null
  officeAddressPrimary?: string | null
  officeAddressSecondary?: string | null
  navigationGroups?: MenuGroup[] | null
  legalMenu?: MenuGroup | null
  showDefaultLegalLinks?: boolean | null
  copyrightText?: string | null
} | null

type FooterProps = {
  footer?: SiteFooter
  variant?: FooterVariant | null
  settings?: LayoutSettings | null
}

function FooterLogo({
  image,
  fallbackTitle,
  href,
}: {
  image?: FooterImage
  fallbackTitle?: string | null
  href: string
}) {
  const logoAssetRef = image?.asset?._ref || image?.asset?._id

  if (logoAssetRef) {
    return (
      <Link href={href} className="inline-flex items-center">
        <Image
          id={logoAssetRef}
          alt={image?.alt || fallbackTitle || 'Site logo'}
          width={214}
          height={64}
          className="h-auto w-[10.5rem] sm:w-[12.25rem] lg:w-[13.375rem]"
          mode="contain"
        />
      </Link>
    )
  }

  return (
    <Link href={href} className="type-h3 inline-flex items-center">
      {fallbackTitle || 'Albatha'}
    </Link>
  )
}

function FooterLink({
  item,
  className,
}: {
  item: MenuLink | MenuSubLink
  className: string
}) {
  const href = resolveContentLinkHref(item.link)
  if (!href) {
    return null
  }

  const isExternal = isExternalContentLink(item.link) && item.link?.openInNewTab

  return (
    <Link
      href={href}
      className={className}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      data-menu-item-id={item.itemId || undefined}
    >
      {item.label || 'Link'}
    </Link>
  )
}

function FooterCopyright({
  value,
  isNegative,
}: {
  value: string
  isNegative: boolean
}) {
  const marker = 'Created by Black.'
  const markerIndex = value.indexOf(marker)

  if (markerIndex === -1) {
    return <p className={`type-footer-meta ${isNegative ? 'text-white/60' : 'text-foreground/60'}`}>{value}</p>
  }

  const prefix = value.slice(0, markerIndex)

  return (
    <p className="type-footer-meta">
      <span className={isNegative ? 'text-white/60' : 'text-foreground/60'}>{prefix}Created by </span>
      <span className="font-medium text-blue underline decoration-current underline-offset-4">Black.</span>
    </p>
  )
}

export default function Footer({footer, variant = 'negative', settings}: FooterProps) {
  const isNegative = variant === 'negative'
  const selectedLogo = isNegative ? footer?.negativeLogo : footer?.positiveLogo
  const navigationGroups = footer?.navigationGroups?.filter((group) => group?.links?.length) || []
  const legalLinks = footer?.legalMenu?.links || []
  const showDefaultLegalLinks = footer?.showDefaultLegalLinks ?? true
  const contactPhone = settings?.contactPhone
  const contactEmail = settings?.contactEmail

  const sectionClassName = isNegative ? 'bg-foreground text-white' : 'bg-background text-foreground'
  const dividerClassName = isNegative ? 'border-white/60' : 'border-foreground/60'
  const primaryTextClassName = isNegative ? 'text-white' : 'text-foreground'
  const navLinkClassName = isNegative
    ? 'type-footer-nav-link text-white transition hover:text-blue'
    : 'type-footer-nav-link text-foreground transition hover:text-blue'
  const metaTextClassName = isNegative ? 'text-white/60' : 'text-foreground/60'
  const metaLinkClassName = isNegative
    ? 'type-footer-meta text-white/60 underline decoration-current underline-offset-4 transition hover:text-white'
    : 'type-footer-meta text-foreground/60 underline decoration-current underline-offset-4 transition hover:text-foreground'

  return (
    <footer className={sectionClassName}>
      <div className="container">
        <div className="footer-content-width footer-main-layout">
          <div className="footer-left-stack">
            <FooterLogo image={selectedLogo} fallbackTitle={settings?.title} href="/" />

            <div className="space-y-10">
              {footer?.officeHeading ? (
                <p className={`type-footer-office-heading ${primaryTextClassName}`}>
                  {footer.officeHeading}
                </p>
              ) : null}

              <div className={`footer-address-layout type-footer-address ${primaryTextClassName}`}>
                {footer?.officeAddressPrimary ? <p>{footer.officeAddressPrimary}</p> : null}
                {footer?.officeAddressSecondary ? <p>{footer.officeAddressSecondary}</p> : null}
              </div>

              <div className="type-footer-contact space-y-2 text-brand">
                {contactPhone ? (
                  <a href={`tel:${contactPhone.replace(/\s+/g, '')}`} className="transition hover:opacity-80">
                    {contactPhone}
                  </a>
                ) : null}
                {contactEmail ? (
                  <div>
                    <a href={`mailto:${contactEmail}`} className="transition hover:opacity-80">
                      {contactEmail}
                    </a>
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          <div className="footer-nav-layout">
            {navigationGroups.map((group, groupIndex) => (
              <nav
                key={group.menuId || group._key || `footer-group-${groupIndex}`}
                aria-label={group.title || `Footer group ${groupIndex + 1}`}
                data-menu-group-id={group.menuId || undefined}
                className="footer-nav-column"
              >
                {group.title ? (
                  <p className="type-footer-nav-heading mb-7 text-blue">
                    {group.title}
                  </p>
                ) : (
                  <div className="mb-7 h-6" aria-hidden="true" />
                )}
                <ul className="footer-nav-links">
                  {group.links?.map((item, linkIndex) => (
                    <li key={item.itemId || item._key || `footer-link-${groupIndex}-${linkIndex}`}>
                      <FooterLink item={item} className={navLinkClassName} />
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className={`footer-content-width footer-meta-layout border-t ${dividerClassName}`}>
          <nav
            aria-label={footer?.legalMenu?.title || 'Legal navigation'}
            data-menu-group-id={footer?.legalMenu?.menuId || undefined}
          >
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {legalLinks.length
                ? legalLinks.map((item, index) => (
                    <li key={item.itemId || item._key || `legal-link-${index}`}>
                      <FooterLink item={item} className={metaLinkClassName} />
                    </li>
                  ))
                : null}
              {showDefaultLegalLinks && legalLinks.length === 0 ? (
                <>
                  <li>
                    <Link href="/privacy-policy" className={metaLinkClassName}>
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms-and-conditions" className={metaLinkClassName}>
                      Terms & Conditions
                    </Link>
                  </li>
                </>
              ) : null}
            </ul>
          </nav>

          {footer?.copyrightText ? <FooterCopyright value={footer.copyrightText} isNegative={isNegative} /> : null}
        </div>
      </div>
    </footer>
  )
}
