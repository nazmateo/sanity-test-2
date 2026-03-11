import type {Metadata, ResolvingMetadata} from 'next'
import type {PortableTextBlock} from 'next-sanity'
import {notFound} from 'next/navigation'
import type {PageDocumentForBuilder} from '@/sanity/lib/types'

import Footer, {type SiteFooter} from '@/app/components/Footer'
import {PageOnboarding} from '@/app/components/Onboarding'
import PageBuilderPage from '@/app/components/PageBuilder'
import PortableText from '@/app/components/PortableText'
import Header, {type LayoutSettings, type SiteHeader} from '@/app/components/Header'
import {buildCatchAllStaticParams, resolveCatchAllRoute, routePath, type SitemapRow} from '@/app/lib/catch-all-route'
import {buildSeoMetadata} from '@/app/lib/seo-metadata'
import {sanityFetch} from '@/sanity/lib/live'
import {
  footerQuery,
  homePageLanguagesQuery,
  homePageQuery,
  headerQuery,
  getPageQuery,
  legalPageBySlugQuery,
  legalPageLanguagesBySlugQuery,
  pageLanguagesBySlugQuery,
  settingsQuery,
  sitemapData,
} from '@/sanity/lib/queries'
import {DEFAULT_LANGUAGE} from '@/sanity/lib/i18n'
import {parseJsonObject, resolveOpenGraphImage} from '@/sanity/lib/utils'

type OpenGraphImageValue = Parameters<typeof resolveOpenGraphImage>[0]

type Props = {
  params: Promise<{segments?: string[]}>
}

type PageWithSeo = {
  _id?: string
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

type LegalPageData = {
  _id?: string
  title?: string
  headerVariant?: 'positive' | 'negative' | null
  footerVariant?: 'positive' | 'negative' | null
  content?: PortableTextBlock[]
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
    const ogImage = resolveOpenGraphImage((pageWithSeo?.seo?.ogImage as OpenGraphImageValue) || undefined)
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
    const ogImage = resolveOpenGraphImage((legalPage?.seo?.ogImage as OpenGraphImageValue) || undefined)

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
  const ogImage = resolveOpenGraphImage((pageWithSeo?.seo?.ogImage as OpenGraphImageValue) || undefined)
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
    const [{data: page}, {data: settings}, {data: header}, {data: footer}] = await Promise.all([
      sanityFetch({
        query: homePageQuery,
        params: {language: match.language},
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
    const pageWithSeo = page as PageWithSeo | null
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
          <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(customStructuredData)}} />
        ) : null}
        <PageBuilderPage page={page as PageDocumentForBuilder} />
        <Footer footer={siteFooter} variant={pageWithSeo.footerVariant} settings={layoutSettings} />
      </>
    )
  }

  if (match.kind === 'legal') {
    const [{data}, {data: settings}, {data: header}, {data: footer}] = await Promise.all([
      sanityFetch({
        query: legalPageBySlugQuery,
        params: {slug: match.slug, language: match.language},
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
    const page = data as LegalPageData | null
    const layoutSettings = settings as LayoutSettings | null
    const siteHeader = header as SiteHeader
    const siteFooter = footer as SiteFooter
    if (!page?._id) {
      return notFound()
    }

    return (
      <>
        <Header settings={layoutSettings} header={siteHeader} variant={page.headerVariant} />
        <div className="container py-16 pt-32 lg:py-24 lg:pt-36">
          <article className="max-w-3xl prose prose-gray">
            <h1>{page.title || (match.slug === 'privacy-policy' ? 'Privacy Policy' : 'Terms and Conditions')}</h1>
            {page.content?.length ? <PortableText value={page.content} /> : null}
          </article>
        </div>
        <Footer footer={siteFooter} variant={page.footerVariant} settings={layoutSettings} />
      </>
    )
  }

  const [{data: page}, {data: settings}, {data: header}, {data: footer}] = await Promise.all([
    sanityFetch({
      query: getPageQuery,
      params: {slug: match.slug, language: match.language},
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
  const pageWithSeo = page as PageWithSeo | null
  const layoutSettings = settings as LayoutSettings | null
  const siteHeader = header as SiteHeader
  const siteFooter = footer as SiteFooter
  const customStructuredData = parseJsonObject(pageWithSeo?.structuredData)

  if (!pageWithSeo?._id) {
    if (match.kind === 'page' && match.language === DEFAULT_LANGUAGE) {
      return (
        <>
          <Header settings={layoutSettings} header={siteHeader} />
          <div className="py-40 pt-32">
            <PageOnboarding />
          </div>
          <Footer footer={siteFooter} settings={layoutSettings} />
        </>
      )
    }
    return notFound()
  }

  return (
    <>
      <Header settings={layoutSettings} header={siteHeader} variant={pageWithSeo.headerVariant} />
      {customStructuredData ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(customStructuredData)}} />
      ) : null}
      <div className="my-12 pt-24 lg:my-24 lg:pt-28">
        <div className="container">
          <div className="pb-6 border-b border-gray-100">
            <div className="max-w-3xl">
              <h1 className="text-4xl text-gray-900 sm:text-5xl lg:text-7xl">{pageWithSeo.name}</h1>
            </div>
          </div>
        </div>
        <PageBuilderPage page={page as PageDocumentForBuilder} />
      </div>
      <Footer footer={siteFooter} variant={pageWithSeo.footerVariant} settings={layoutSettings} />
    </>
  )
}
