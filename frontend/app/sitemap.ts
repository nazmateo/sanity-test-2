import {MetadataRoute} from 'next'
import {sanityFetch} from '@/sanity/lib/live'
import {settingsQuery, sitemapData} from '@/sanity/lib/queries'
import {ensureAbsoluteUrl} from '@/sanity/lib/utils'

/**
 * This file creates a sitemap (sitemap.xml) for the application. Learn more about sitemaps in Next.js here: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
 * Be sure to update the `changeFrequency` and `priority` values to match your application's content.
 */

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [{data: allPostsAndPages}, {data: settings}] = await Promise.all([
    sanityFetch({
      query: sitemapData,
    }),
    sanityFetch({
      query: settingsQuery,
    }),
  ])

  const sitemap: MetadataRoute.Sitemap = []
  const domain = ensureAbsoluteUrl(settings?.ogImage?.metadataBase)

  sitemap.push({
    url: domain,
    lastModified: new Date(),
    priority: 1,
    changeFrequency: 'monthly',
  })

  if (allPostsAndPages != null && allPostsAndPages.length !== 0) {
    let priority: number = 0.5
    let changeFrequency:
      | 'monthly'
      | 'always'
      | 'hourly'
      | 'daily'
      | 'weekly'
      | 'yearly'
      | 'never'
      | undefined
    let url: string = domain

    for (const p of allPostsAndPages) {
      switch (p._type) {
        case 'page':
          priority = 0.8
          changeFrequency = 'monthly'
          url = `${domain}/${p.slug}`
          break
        case 'post':
          priority = 0.5
          changeFrequency = 'never'
          url = `${domain}/posts/${p.slug}`
          break
        case 'legalPage':
          priority = 0.3
          changeFrequency = 'yearly'
          url = `${domain}/${p.slug}`
          break
      }
      sitemap.push({
        lastModified: p._updatedAt || new Date(),
        priority,
        changeFrequency,
        url,
      })
    }
  }

  return sitemap
}
