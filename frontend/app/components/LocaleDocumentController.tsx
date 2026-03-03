'use client'

import {usePathname} from 'next/navigation'
import {useEffect} from 'react'

function getLocaleFromPath(pathname: string): 'en' | 'ae' {
  const [firstSegment] = pathname.split('/').filter(Boolean)
  return firstSegment === 'ae' ? 'ae' : 'en'
}

export default function LocaleDocumentController() {
  const pathname = usePathname()

  useEffect(() => {
    const locale = getLocaleFromPath(pathname)
    const isArabic = locale === 'ae'
    const html = document.documentElement

    html.lang = isArabic ? 'ar-AE' : 'en-US'
    html.dir = isArabic ? 'rtl' : 'ltr'
  }, [pathname])

  return null
}
