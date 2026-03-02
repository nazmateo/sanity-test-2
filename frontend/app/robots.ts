import type {MetadataRoute} from 'next'

import {sanityFetch} from '@/sanity/lib/live'
import {settingsQuery} from '@/sanity/lib/queries'
import {ensureAbsoluteUrl} from '@/sanity/lib/utils'

export default async function robots(): Promise<MetadataRoute.Robots> {
  const {data: settings} = await sanityFetch({
    query: settingsQuery,
    stega: false,
  })

  const baseUrl = ensureAbsoluteUrl(settings?.ogImage?.metadataBase)

  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
