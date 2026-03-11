'use client'

import Link from 'next/link'
import {usePathname} from 'next/navigation'
import {useState} from 'react'

import Image from '@/app/components/SanityImage'
import {DEFAULT_LANGUAGE, normalizeLanguage} from '@/sanity/lib/i18n'
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

type MenuDropdownGroup = {
  _key?: string
  title?: string | null
  links?: MenuSubLink[] | null
}

type MenuLink = {
  _key?: string
  itemId?: string | null
  label?: string | null
  link?: ContentLink | null
  subLinks?: MenuSubLink[] | null
  dropdownGroups?: MenuDropdownGroup[] | null
}

type MenuGroup = {
  menuId?: string | null
  title?: string | null
  links?: MenuLink[] | null
}

type HeaderVariant = 'positive' | 'negative'

type HeaderImage = {
  asset?: {_ref?: string; _id?: string} | null
  alt?: string | null
} | null

export type LayoutSettings = {
  _id?: string
  title?: string | null
  contactPhone?: string | null
  contactEmail?: string | null
  menuGroups?: MenuGroup[] | null
}

export type SiteHeader = {
  _id?: string
  defaultVariant?: HeaderVariant | null
  positiveLogo?: HeaderImage
  negativeLogo?: HeaderImage
  primaryMenu?: MenuGroup | null
  secondaryMenu?: MenuGroup | null
  ctaLabel?: string | null
  ctaLink?: ContentLink | null
  languageToggleLabel?: string | null
} | null

type HeaderProps = {
  settings?: LayoutSettings | null
  header?: SiteHeader
  variant?: HeaderVariant | null
  overlay?: boolean
}

function ChevronDownIcon({className}: {className?: string}) {
  return (
    <svg viewBox="0 0 14 14" aria-hidden="true" className={className}>
      <path
        d="M3.25 5.25 7 9l3.75-3.75"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.2"
      />
    </svg>
  )
}

function GlobeIcon({className}: {className?: string}) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className={className}>
      <circle cx="8" cy="8" r="6.25" fill="none" stroke="currentColor" strokeWidth="1" />
      <path
        d="M1.75 8h12.5M8 1.75c1.6 1.55 2.5 3.8 2.5 6.25S9.6 12.7 8 14.25C6.4 12.7 5.5 10.45 5.5 8S6.4 3.3 8 1.75Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      />
    </svg>
  )
}

function MenuIcon({className}: {className?: string}) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        d="M4 7h16M4 12h16M4 17h16"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.6"
      />
    </svg>
  )
}

function CloseIcon({className}: {className?: string}) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        d="M6 6l12 12M18 6 6 18"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.6"
      />
    </svg>
  )
}

function getLocaleFromPath(pathname: string) {
  const [firstSegment] = pathname.split('/').filter(Boolean)
  return firstSegment === 'ae' ? 'ae' : 'en'
}

function buildLocalizedHref(pathname: string, targetLanguage: 'en' | 'ae') {
  const segments = pathname.split('/').filter(Boolean)
  const currentLanguage = getLocaleFromPath(pathname)
  const normalizedSegments = currentLanguage === DEFAULT_LANGUAGE ? segments : segments.slice(1)
  const localizedSegments =
    targetLanguage === DEFAULT_LANGUAGE
      ? normalizedSegments
      : [targetLanguage, ...normalizedSegments]

  return localizedSegments.length > 0 ? `/${localizedSegments.join('/')}` : '/'
}

function getMenuHref(link?: ContentLink | null) {
  return resolveContentLinkHref(link)
}

function HeaderLogo({
  image,
  fallbackTitle,
  href,
  isNegative,
}: {
  image?: HeaderImage
  fallbackTitle?: string | null
  href: string
  isNegative: boolean
}) {
  const logoAssetRef = image?.asset?._ref || image?.asset?._id

  return (
    <Link
      href={href}
      className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center"
    >
      {logoAssetRef ? (
        <Image
          id={logoAssetRef}
          alt={image?.alt || fallbackTitle || 'Site logo'}
          width={260}
          height={60}
          className="h-9 w-auto md:h-[3.75rem]"
          mode="contain"
        />
      ) : (
        <span className={`type-h3 ${isNegative ? 'text-white' : 'text-foreground'}`}>
          {fallbackTitle || 'Albatha'}
        </span>
      )}
    </Link>
  )
}

function DropdownPanel({
  item,
  itemLabel,
  isNegative,
}: {
  item: MenuLink
  itemLabel: string
  isNegative: boolean
}) {
  const dropdownGroups = item.dropdownGroups?.filter((group) => group?.links?.length) || []
  const fallbackLinks = item.subLinks?.filter((link) => getMenuHref(link.link)) || []

  if (!dropdownGroups.length && !fallbackLinks.length) {
    return null
  }

  const groups = dropdownGroups.length
    ? dropdownGroups
    : [
        {
          _key: `${item.itemId || item._key || itemLabel}-fallback`,
          title: itemLabel,
          links: fallbackLinks,
        },
      ]

  return (
    <div className="invisible absolute left-0 top-full z-50 min-w-4xl translate-y-3 pt-5 opacity-0 transition duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
      <div
        className={`flex flex-wrap gap-3 overflow-hidden border shadow-2xl md:flex-nowrap ${
          isNegative
            ? 'border-white/40 bg-[linear-gradient(135deg,#071a2e_0%,#131417_100%)] shadow-black/25'
            : 'border-foreground/20 bg-[linear-gradient(135deg,#071a2e_0%,#161616_100%)] shadow-black/18'
        }`}
      >
        {groups.map((group) => (
          <div
            key={group._key || group.title || 'dropdown-group'}
            className="min-w-72 flex-1 border-r border-white/20 bg-black/10 px-7 py-8 last:border-r-0"
          >
            <p className="type-dropdown-heading mb-6 text-blue">{group.title || itemLabel}</p>
            <ul className="grid gap-6 sm:grid-cols-2 md:grid-cols-1">
              {group.links?.map((subLink, index) => {
                const href = getMenuHref(subLink.link)
                if (!href) {
                  return null
                }

                const isExternal = isExternalContentLink(subLink.link) && subLink.link?.openInNewTab

                return (
                  <li
                    key={subLink.itemId || subLink._key || `${group.title || itemLabel}-${index}`}
                  >
                    <Link
                      href={href}
                      className="type-nav inline-flex text-white/92 transition hover:text-blue focus-visible:text-blue"
                      target={isExternal ? '_blank' : undefined}
                      rel={isExternal ? 'noopener noreferrer' : undefined}
                    >
                      {subLink.label || 'Link'}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

function DesktopPrimaryMenu({
  items,
  textClassName,
  isNegative,
}: {
  items: MenuLink[]
  textClassName: string
  isNegative: boolean
}) {
  return (
    <ul role="list" className="flex items-center gap-3">
      {items.map((item, index) => {
        const href = getMenuHref(item.link)
        const itemLabel = item.label || 'Link'
        const itemKey = item.itemId || item._key || `${itemLabel}-${index}`
        const hasDropdown = Boolean(item.dropdownGroups?.length || item.subLinks?.length)
        const isExternal = isExternalContentLink(item.link) && item.link?.openInNewTab

        const itemClassName = [
          'type-nav inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 transition',
          textClassName,
          hasDropdown
            ? isNegative
              ? 'group-hover:bg-white/10 group-focus-within:bg-white/10'
              : 'group-hover:bg-black/6 group-focus-within:bg-black/6'
            : '',
        ]
          .filter(Boolean)
          .join(' ')

        return (
          <li key={itemKey} data-menu-item-id={item.itemId || undefined} className="group relative">
            {href ? (
              <Link
                href={href}
                className={itemClassName}
                target={isExternal ? '_blank' : undefined}
                rel={isExternal ? 'noopener noreferrer' : undefined}
              >
                <span>{itemLabel}</span>
                {hasDropdown ? <ChevronDownIcon className="mt-px size-3.5" /> : null}
              </Link>
            ) : (
              <button
                type="button"
                className={itemClassName}
                aria-haspopup={hasDropdown ? 'menu' : undefined}
              >
                <span>{itemLabel}</span>
                {hasDropdown ? <ChevronDownIcon className="mt-px size-3.5" /> : null}
              </button>
            )}
            {hasDropdown ? (
              <DropdownPanel item={item} itemLabel={itemLabel} isNegative={isNegative} />
            ) : null}
          </li>
        )
      })}
    </ul>
  )
}

function DesktopSecondaryMenu({items, textClassName}: {items: MenuLink[]; textClassName: string}) {
  return (
    <ul role="list" className="flex items-center gap-3">
      {items.map((item, index) => {
        const href = getMenuHref(item.link)
        if (!href) {
          return null
        }

        const itemLabel = item.label || 'Link'
        const itemKey = item.itemId || item._key || `${itemLabel}-${index}`
        const isExternal = isExternalContentLink(item.link) && item.link?.openInNewTab

        return (
          <li key={itemKey} data-menu-item-id={item.itemId || undefined}>
            <Link
              href={href}
              className={`type-nav inline-flex rounded-lg px-2.5 py-2 transition ${textClassName}`}
              target={isExternal ? '_blank' : undefined}
              rel={isExternal ? 'noopener noreferrer' : undefined}
            >
              {itemLabel}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

function MobileMenuLink({
  item,
  index,
  currentOpenId,
  onToggle,
  isNegative,
}: {
  item: MenuLink
  index: number
  currentOpenId: string | null
  onToggle: (value: string | null) => void
  isNegative: boolean
}) {
  const href = getMenuHref(item.link)
  const itemLabel = item.label || 'Link'
  const itemId = item.itemId || item._key || `${itemLabel}-${index}`
  const hasDropdown = Boolean(item.dropdownGroups?.length || item.subLinks?.length)
  const isOpen = currentOpenId === itemId
  const isExternal = isExternalContentLink(item.link) && item.link?.openInNewTab

  return (
    <li
      className={`rounded-2xl border p-4 ${isNegative ? 'border-white/15 bg-white/6' : 'border-black/10 bg-white/80'}`}
    >
      <div className="flex items-center justify-between gap-3">
        {href ? (
          <Link
            href={href}
            className={`type-nav ${isNegative ? 'text-white' : 'text-foreground'}`}
            target={isExternal ? '_blank' : undefined}
            rel={isExternal ? 'noopener noreferrer' : undefined}
          >
            {itemLabel}
          </Link>
        ) : (
          <span className={`type-nav ${isNegative ? 'text-white' : 'text-foreground'}`}>
            {itemLabel}
          </span>
        )}
        {hasDropdown ? (
          <button
            type="button"
            className={`rounded-full border p-2 ${isNegative ? 'border-white/20 text-white' : 'border-black/10 text-foreground'}`}
            aria-expanded={isOpen}
            onClick={() => onToggle(isOpen ? null : itemId)}
          >
            <ChevronDownIcon className={`size-4 transition ${isOpen ? 'rotate-180' : ''}`} />
          </button>
        ) : null}
      </div>
      {hasDropdown && isOpen ? (
        <div className="mt-4 space-y-4">
          {(item.dropdownGroups?.length
            ? item.dropdownGroups
            : [
                {
                  _key: `${itemId}-fallback`,
                  title: itemLabel,
                  links: item.subLinks,
                } as MenuDropdownGroup,
              ]
          ).map((group) => (
            <div
              key={group._key || group.title || `${itemId}-group`}
              className={`rounded-xl p-4 ${isNegative ? 'bg-black/20' : 'bg-foreground'}`}
            >
              <p className="type-dropdown-heading mb-4 text-blue">{group.title || itemLabel}</p>
              <ul className="space-y-3">
                {group.links?.map((subLink, subIndex) => {
                  const subHref = getMenuHref(subLink.link)
                  if (!subHref) {
                    return null
                  }

                  const subIsExternal =
                    isExternalContentLink(subLink.link) && subLink.link?.openInNewTab

                  return (
                    <li key={subLink.itemId || subLink._key || `${itemId}-${subIndex}`}>
                      <Link
                        href={subHref}
                        className="type-nav text-white"
                        target={subIsExternal ? '_blank' : undefined}
                        rel={subIsExternal ? 'noopener noreferrer' : undefined}
                      >
                        {subLink.label || 'Link'}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>
      ) : null}
    </li>
  )
}

export default function Header({settings, header, variant, overlay = false}: HeaderProps) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openMobileItemId, setOpenMobileItemId] = useState<string | null>(null)

  const headerConfig = header
  const resolvedVariant = variant || headerConfig?.defaultVariant || 'positive'
  const isNegative = resolvedVariant === 'negative'
  const currentLanguage = normalizeLanguage(getLocaleFromPath(pathname || '/'))
  const targetLanguage = currentLanguage === 'en' ? 'ae' : 'en'
  const languageHref = buildLocalizedHref(pathname || '/', targetLanguage)
  const languageLabel = currentLanguage === 'en' ? headerConfig?.languageToggleLabel || 'AR' : 'EN'

  const primaryMenu = headerConfig?.primaryMenu
  const secondaryMenu = headerConfig?.secondaryMenu
  const primaryLinks = primaryMenu?.links || []
  const secondaryLinks = secondaryMenu?.links || []

  const selectedLogo = isNegative ? headerConfig?.negativeLogo : headerConfig?.positiveLogo

  const headerShellClassName = isNegative
    ? 'border-white/25 bg-transparent text-white'
    : 'border-black/12 bg-transparent text-foreground'

  const desktopTextClassName = isNegative
    ? 'text-white hover:text-blue focus-visible:text-blue'
    : 'text-foreground hover:text-blue focus-visible:text-blue'

  const languageClassName = isNegative
    ? 'border-white/70 text-white hover:border-blue hover:text-blue'
    : 'border-black/30 text-foreground hover:border-blue hover:text-blue'

  const mobilePanelClassName = isNegative
    ? 'border-white/15 bg-[linear-gradient(180deg,#151d28_0%,#11161e_100%)] text-white'
    : 'border-black/10 bg-[#f4f4f2] text-foreground'

  const positionClassName = overlay ? 'absolute' : 'fixed'

  return (
    <header className={`${positionClassName} inset-x-0 top-0 z-50 border-b ${headerShellClassName}`}>
      <div className="container">
        <div className="relative flex min-h-[4.625rem] items-center justify-between">
          <button
            type="button"
            className={`inline-flex items-center rounded-full border px-3 py-2 lg:hidden ${isNegative ? 'border-white/25 text-white' : 'border-black/15 text-foreground'}`}
            aria-expanded={mobileMenuOpen}
            aria-controls="site-mobile-menu"
            onClick={() => setMobileMenuOpen((value) => !value)}
          >
            {mobileMenuOpen ? <CloseIcon className="size-5" /> : <MenuIcon className="size-5" />}
          </button>

          <nav
            aria-label="Primary navigation"
            data-menu-group-id={primaryMenu?.menuId || 'primary'}
            className="hidden lg:block"
          >
            <DesktopPrimaryMenu
              items={primaryLinks}
              textClassName={desktopTextClassName}
              isNegative={isNegative}
            />
          </nav>

          <HeaderLogo
            image={selectedLogo}
            fallbackTitle={settings?.title}
            href={currentLanguage === 'en' ? '/' : '/ae'}
            isNegative={isNegative}
          />

          <div className="hidden items-center gap-8 lg:flex">
            <nav
              aria-label="Secondary navigation"
              data-menu-group-id={secondaryMenu?.menuId || 'secondary'}
            >
              <DesktopSecondaryMenu items={secondaryLinks} textClassName={desktopTextClassName} />
            </nav>

            <Link
              href={languageHref}
              className={`type-language inline-flex h-[1.875rem] items-center gap-2 rounded-lg border px-3 transition ${languageClassName}`}
            >
              <GlobeIcon className="size-4" />
              <span>{languageLabel}</span>
            </Link>
          </div>

          <div className="lg:hidden" />
        </div>

        {mobileMenuOpen ? (
          <div
            id="site-mobile-menu"
            className={`border-t py-5 lg:hidden ${mobilePanelClassName} ${isNegative ? 'border-white/15' : 'border-black/10'}`}
          >
            <div className="space-y-6">
              <ul className="space-y-3">
                {primaryLinks.map((item, index) => (
                  <MobileMenuLink
                    key={item.itemId || item._key || `mobile-primary-${index}`}
                    item={item}
                    index={index}
                    currentOpenId={openMobileItemId}
                    onToggle={setOpenMobileItemId}
                    isNegative={isNegative}
                  />
                ))}
              </ul>

              {secondaryLinks.length ? (
                <nav aria-label="Secondary navigation">
                  <ul className="flex flex-wrap gap-3">
                    {secondaryLinks.map((item, index) => {
                      const href = getMenuHref(item.link)
                      if (!href) {
                        return null
                      }
                      const isExternal = isExternalContentLink(item.link) && item.link?.openInNewTab

                      return (
                        <li key={item.itemId || item._key || `mobile-secondary-${index}`}>
                          <Link
                            href={href}
                            className={`type-nav inline-flex rounded-full border px-4 py-2 ${isNegative ? 'border-white/20 text-white' : 'border-black/10 text-foreground'}`}
                            target={isExternal ? '_blank' : undefined}
                            rel={isExternal ? 'noopener noreferrer' : undefined}
                          >
                            {item.label || 'Link'}
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                </nav>
              ) : null}

              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href={languageHref}
                  className={`type-language inline-flex items-center gap-2 rounded-lg border px-4 py-2 ${isNegative ? 'border-white/20 text-white' : 'border-black/10 text-foreground'}`}
                >
                  <GlobeIcon className="size-4" />
                  <span>{languageLabel}</span>
                </Link>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </header>
  )
}
