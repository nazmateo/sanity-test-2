import Link from 'next/link'

import type {LayoutSettings} from '@/app/components/Header'
import {isExternalContentLink, resolveContentLinkHref} from '@/sanity/lib/utils'

export default function Footer({settings}: {settings?: LayoutSettings | null}) {
  const footerMenuGroup = settings?.menuGroups?.find((group) => group?.menuId === 'footer')

  return (
    <footer className="bg-gray-50 relative" data-menu-group-id={footerMenuGroup?.menuId || undefined}>
      <div className="absolute inset-0 bg-[url(/images/tile-grid-black.png)] bg-size-[17px] opacity-20 bg-position-[0_1]" />
      <div className="container relative">
        <div className="flex flex-col items-center py-28 lg:flex-row">
          <h3 className="mb-10 text-center text-4xl font-mono leading-tight tracking-tighter lg:mb-0 lg:w-1/2 lg:pr-4 lg:text-left lg:text-2xl">
            Built with Sanity + Next.js.
          </h3>
          <div className="flex flex-col gap-3 items-center justify-center lg:w-1/2 lg:flex-row lg:pl-4">
            {footerMenuGroup?.links?.map((item) => {
              const href = resolveContentLinkHref(item.link)
              if (!href) {
                return null
              }
              const isExternal = isExternalContentLink(item.link) && item.link?.openInNewTab
              return (
                <Link
                  key={item.itemId || item._key || item.label || href}
                  href={href}
                  className="mx-3 hover:underline font-mono"
                  target={isExternal ? '_blank' : undefined}
                  rel={isExternal ? 'noopener noreferrer' : undefined}
                  data-menu-item-id={item.itemId || undefined}
                >
                  {item.label || 'Link'}
                </Link>
              )
            })}
            <Link href="/privacy-policy" className="mx-3 hover:underline font-mono">
              Privacy Policy
            </Link>
            <Link href="/terms-and-conditions" className="mx-3 hover:underline font-mono">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
