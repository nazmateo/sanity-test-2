import type {Metadata, ResolvingMetadata} from 'next'
import {notFound} from 'next/navigation'

import {PageOnboarding} from '@/app/components/Onboarding'
import PageBuilderPage from '@/app/components/PageBuilder'
import PortableText from '@/app/components/PortableText'
import {buildCatchAllStaticParams, resolveCatchAllRoute, routePath, type SitemapRow} from '@/app/lib/catch-all-route'
import {buildSeoMetadata} from '@/app/lib/seo-metadata'
import {sanityFetch} from '@/sanity/lib/live'
import {
  homePageLanguagesQuery,
  homePageQuery,
  getPageQuery,
  legalPageBySlugQuery,
  legalPageLanguagesBySlugQuery,
  pageLanguagesBySlugQuery,
  sitemapData,
} from '@/sanity/lib/queries'
import {DEFAULT_LANGUAGE} from '@/sanity/lib/i18n'
import {parseJsonObject, resolveOpenGraphImage} from '@/sanity/lib/utils'

type Props = {
  params: Promise<{segments?: string[]}>
}

type PageWithSeo = {
  _id?: string
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

type LegalPageData = {
  _id?: string
  title?: string
  content?: any[]
  seo?: {
    metaDescription?: string | null
    canonicalUrl?: string | null
    noIndex?: boolean | null
    ogTitle?: string | null
    ogDescription?: string | null
    ogImage?: unknown
  } | null
}

export async function generateStaticParams(): Promise<Array<{segments?: string[]}>> {
  const {data} = await sanityFetch({
    query: sitemapData,
    perspective: 'published',
    stega: false,
  })

  return buildCatchAllStaticParams((data as SitemapRow[] | null) || [])
}

export async function generateMetadata(props: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const params = await props.params
  const match = resolveCatchAllRoute(params.segments)
  if (!match) {
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
  const fallbackCanonical = metadataBase ? `${metadataBase}${routePath(match)}` : undefined

  if (match.kind === 'home') {
    const [{data: page}, {data: languageRows}] = await Promise.all([
      sanityFetch({
        query: homePageQuery,
        params: {language: match.language},
        stega: false,
      }),
      sanityFetch({
        query: homePageLanguagesQuery,
        stega: false,
      }),
    ])

    const pageWithSeo = page as PageWithSeo | null
    if (!pageWithSeo?._id) {
      return {}
    }

    const discoveredLanguages =
      ((languageRows as Array<{language?: string}> | null) || []).map((row) => row.language || DEFAULT_LANGUAGE)
    const ogImage = resolveOpenGraphImage((pageWithSeo?.seo?.ogImage as any) || undefined)
    const title = pageWithSeo?.seo?.metaTitle || pageWithSeo?.name
    const description = pageWithSeo?.seo?.metaDescription || pageWithSeo?.name

    return buildSeoMetadata({
      title,
      description,
      seo: pageWithSeo.seo,
      previousImages: normalizedPreviousImages,
      newImage: ogImage,
      metadataBase,
      fallbackCanonical,
      alternatePath: '/',
      discoveredLanguages,
      xDefault: metadataBase,
      ogType: 'website',
    })
  }

  if (match.kind === 'legal') {
    const [{data: page}, {data: languageRows}] = await Promise.all([
      sanityFetch({
        query: legalPageBySlugQuery,
        params: {slug: match.slug, language: match.language},
        stega: false,
      }),
      sanityFetch({
        query: legalPageLanguagesBySlugQuery,
        params: {slug: match.slug},
        stega: false,
      }),
    ])

    const legalPage = page as LegalPageData | null
    if (!legalPage?._id) {
      return {}
    }

    const title = legalPage?.title || (match.slug === 'privacy-policy' ? 'Privacy Policy' : 'Terms and Conditions')
    const description =
      legalPage?.seo?.metaDescription || (match.slug === 'privacy-policy' ? 'Privacy policy' : 'Terms and conditions')
    const discoveredLanguages =
      ((languageRows as Array<{language?: string}> | null) || []).map((row) => row.language || DEFAULT_LANGUAGE)
    const ogImage = resolveOpenGraphImage((legalPage?.seo?.ogImage as any) || undefined)

    return buildSeoMetadata({
      title,
      description,
      seo: legalPage.seo,
      previousImages: normalizedPreviousImages,
      newImage: ogImage,
      metadataBase,
      fallbackCanonical,
      alternatePath: `/${match.slug}`,
      discoveredLanguages,
      xDefault: metadataBase ? `${metadataBase}/${match.slug}` : undefined,
      ogType: 'article',
    })
  }

  const [{data: page}, {data: languageRows}] = await Promise.all([
    sanityFetch({
      query: getPageQuery,
      params: {slug: match.slug, language: match.language},
      stega: false,
    }),
    sanityFetch({
      query: pageLanguagesBySlugQuery,
      params: {slug: match.slug},
      stega: false,
    }),
  ])

  const pageWithSeo = page as PageWithSeo | null
  if (!pageWithSeo?._id) {
    return {}
  }

  const discoveredLanguages =
    ((languageRows as Array<{language?: string}> | null) || []).map((row) => row.language || DEFAULT_LANGUAGE)
  const ogImage = resolveOpenGraphImage((pageWithSeo?.seo?.ogImage as any) || undefined)
  const title = pageWithSeo?.seo?.metaTitle || pageWithSeo?.name
  const description = pageWithSeo?.seo?.metaDescription || pageWithSeo?.name

  return buildSeoMetadata({
    title,
    description,
    seo: pageWithSeo.seo,
    previousImages: normalizedPreviousImages,
    newImage: ogImage,
    metadataBase,
    fallbackCanonical,
    alternatePath: `/${match.slug}`,
    discoveredLanguages,
    xDefault: metadataBase ? `${metadataBase}/${match.slug}` : undefined,
    ogType: 'website',
  })
}

export default async function CatchAllPage(props: Props) {
  const params = await props.params
  const match = resolveCatchAllRoute(params.segments)
  if (!match) {
    return notFound()
  }

  if (match.kind === 'home') {
    const {data: page} = await sanityFetch({
      query: homePageQuery,
      params: {language: match.language},
    })
    const pageWithSeo = page as PageWithSeo | null
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

  if (match.kind === 'legal') {
    const {data} = await sanityFetch({
      query: legalPageBySlugQuery,
      params: {slug: match.slug, language: match.language},
    })
    const page = data as LegalPageData | null
    if (!page?._id) {
      return notFound()
    }

    return (
      <div className="container py-16 lg:py-24">
        <article className="max-w-3xl prose prose-gray">
          <h1>{page.title || (match.slug === 'privacy-policy' ? 'Privacy Policy' : 'Terms and Conditions')}</h1>
          {page.content?.length ? <PortableText value={page.content as any} /> : null}
        </article>
      </div>
    )
  }

  const {data: page} = await sanityFetch({
    query: getPageQuery,
    params: {slug: match.slug, language: match.language},
  })
  const pageWithSeo = page as PageWithSeo | null
  const customStructuredData = parseJsonObject(pageWithSeo?.structuredData)

  if (!pageWithSeo?._id) {
    if (match.kind === 'page' && match.language === DEFAULT_LANGUAGE) {
      return (
        <div className="py-40">
          <PageOnboarding />
        </div>
      )
    }
    return notFound()
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
