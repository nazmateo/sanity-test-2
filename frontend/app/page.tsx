import type {Metadata, ResolvingMetadata} from 'next'
import type {PageDocumentForBuilder} from '@/sanity/lib/types'

import Footer, {type SiteFooter} from '@/app/components/Footer'
import {PageOnboarding} from '@/app/components/Onboarding'
import PageBuilderPage from '@/app/components/PageBuilder'
import Header, {type LayoutSettings, type SiteHeader} from '@/app/components/Header'
import {buildSeoMetadata} from '@/app/lib/seo-metadata'
import {sanityFetch} from '@/sanity/lib/live'
import {DEFAULT_LANGUAGE} from '@/sanity/lib/i18n'
import {
  footerQuery,
  headerQuery,
  homePageLanguagesQuery,
  homePageQuery,
  settingsQuery,
} from '@/sanity/lib/queries'
import {parseJsonObject, resolveOpenGraphImage} from '@/sanity/lib/utils'

type OpenGraphImageValue = Parameters<typeof resolveOpenGraphImage>[0]

type HomePageData = {
  _id?: string
  _type?: string
  name?: string
  headerVariant?: 'positive' | 'negative' | null
  footerVariant?: 'positive' | 'negative' | null
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
  const ogImage = resolveOpenGraphImage(
    (pageWithSeo?.seo?.ogImage as OpenGraphImageValue) || undefined,
  )
  const title = pageWithSeo?.seo?.metaTitle || pageWithSeo?.name
  const description = pageWithSeo?.seo?.metaDescription || pageWithSeo?.name
  const discoveredLanguages = ((languageRows as Array<{language?: string}> | null) || []).map(
    (row) => row.language || DEFAULT_LANGUAGE,
  )

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
  const [{data: page}, {data: settings}, {data: header}, {data: footer}] = await Promise.all([
    sanityFetch({
      query: homePageQuery,
      params: {language: DEFAULT_LANGUAGE},
    }),
    sanityFetch({
      query: settingsQuery,
    }),
    sanityFetch({
      query: headerQuery,
    }),
    sanityFetch({
      query: footerQuery,
    }),
  ])
  const pageWithSeo = page as HomePageData | null
  const layoutSettings = settings as LayoutSettings | null
  const siteHeader = header as SiteHeader
  const siteFooter = footer as SiteFooter
  const customStructuredData = parseJsonObject(pageWithSeo?.structuredData)
  if (!pageWithSeo?._id) {
    return (
      <>
        <Header settings={layoutSettings} header={siteHeader} overlay />
        <div className="py-40 pt-32">
          <PageOnboarding />
        </div>
        <Footer footer={siteFooter} settings={layoutSettings} />
      </>
    )
  }

  return (
    <>
      <Header settings={layoutSettings} header={siteHeader} variant={pageWithSeo.headerVariant} overlay />
      {customStructuredData ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{__html: JSON.stringify(customStructuredData)}}
        />
      ) : null}
      <PageBuilderPage page={page as PageDocumentForBuilder} />
      <Footer footer={siteFooter} variant={pageWithSeo.footerVariant} settings={layoutSettings} />
    </>
  )
}
