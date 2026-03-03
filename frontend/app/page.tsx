import type {Metadata, ResolvingMetadata} from 'next'

import {PageOnboarding} from '@/app/components/Onboarding'
import PageBuilderPage from '@/app/components/PageBuilder'
import {buildSeoMetadata} from '@/app/lib/seo-metadata'
import {sanityFetch} from '@/sanity/lib/live'
import {DEFAULT_LANGUAGE} from '@/sanity/lib/i18n'
import {homePageLanguagesQuery, homePageQuery} from '@/sanity/lib/queries'
import {parseJsonObject, resolveOpenGraphImage} from '@/sanity/lib/utils'

type HomePageData = {
  _id?: string
  _type?: string
  name?: string
  pageBuilder?: unknown[]
  structuredData?: string | null
  seo?: {
    metaTitle?: string | null
    metaDescription?: string | null
    canonicalUrl?: string | null
    noIndex?: boolean | null
    ogTitle?: string | null
    ogDescription?: string | null
    ogImage?: unknown
  } | null
}

export async function generateMetadata(_: unknown, parent: ResolvingMetadata): Promise<Metadata> {
  const [{data: page}, {data: languageRows}] = await Promise.all([
    sanityFetch({
      query: homePageQuery,
      params: {language: DEFAULT_LANGUAGE},
      stega: false,
    }),
    sanityFetch({
      query: homePageLanguagesQuery,
      stega: false,
    }),
  ])

  const pageWithSeo = page as HomePageData | null
  if (!pageWithSeo?._id) {
    return {}
  }

  const parentMetadata = await parent
  const metadataBase = parentMetadata.metadataBase?.toString().replace(/\/$/, '')
  const previousImages = parentMetadata.openGraph?.images
  const normalizedPreviousImages = previousImages
    ? Array.isArray(previousImages)
      ? previousImages
      : [previousImages]
    : []
  const ogImage = resolveOpenGraphImage((pageWithSeo?.seo?.ogImage as any) || undefined)
  const title = pageWithSeo?.seo?.metaTitle || pageWithSeo?.name
  const description = pageWithSeo?.seo?.metaDescription || pageWithSeo?.name
  const discoveredLanguages =
    ((languageRows as Array<{language?: string}> | null) || []).map((row) => row.language || DEFAULT_LANGUAGE)

  return buildSeoMetadata({
    title,
    description,
    seo: pageWithSeo.seo,
    previousImages: normalizedPreviousImages,
    newImage: ogImage,
    metadataBase,
    fallbackCanonical: metadataBase || undefined,
    alternatePath: '/',
    discoveredLanguages,
    xDefault: metadataBase,
    ogType: 'website',
  })
}

export default async function HomePage() {
  const {data: page} = await sanityFetch({
    query: homePageQuery,
    params: {language: DEFAULT_LANGUAGE},
  })
  const pageWithSeo = page as HomePageData | null
  const customStructuredData = parseJsonObject(pageWithSeo?.structuredData)

  if (!pageWithSeo?._id) {
    return (
      <div className="py-40">
        <PageOnboarding />
      </div>
    )
  }

  return (
    <>
      {customStructuredData ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(customStructuredData)}} />
      ) : null}
      <div className="my-12 lg:my-24">
        <div className="container">
          <div className="pb-6 border-b border-gray-100">
            <div className="max-w-3xl">
              <h1 className="text-4xl text-gray-900 sm:text-5xl lg:text-7xl">{pageWithSeo.name}</h1>
            </div>
          </div>
        </div>
        <PageBuilderPage page={page as any} />
      </div>
    </>
  )
}
