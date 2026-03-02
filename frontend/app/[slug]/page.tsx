import type {Metadata, ResolvingMetadata} from 'next'

import PageBuilderPage from '@/app/components/PageBuilder'
import {sanityFetch} from '@/sanity/lib/live'
import {getPageQuery, pagesSlugs} from '@/sanity/lib/queries'
import {PageOnboarding} from '@/app/components/Onboarding'
import {parseJsonObject, resolveOpenGraphImage} from '@/sanity/lib/utils'

type Props = {
  params: Promise<{slug: string}>
}

type PageWithSeo = {
  _id?: string
  name?: string
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

/**
 * Generate the static params for the page.
 * Learn more: https://nextjs.org/docs/app/api-reference/functions/generate-static-params
 */
export async function generateStaticParams() {
  const {data} = await sanityFetch({
    query: pagesSlugs,
    // // Use the published perspective in generateStaticParams
    perspective: 'published',
    stega: false,
  })
  return data
}

/**
 * Generate metadata for the page.
 * Learn more: https://nextjs.org/docs/app/api-reference/functions/generate-metadata#generatemetadata-function
 */
export async function generateMetadata(props: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const params = await props.params
  const {data: page} = await sanityFetch({
    query: getPageQuery,
    params,
    // Metadata should never contain stega
    stega: false,
  })
  const pageWithSeo = page as PageWithSeo | null

  const parentMetadata = await parent
  const previousImages = parentMetadata.openGraph?.images || []
  const metadataBase = parentMetadata.metadataBase?.toString().replace(/\/$/, '')
  const canonicalUrl = pageWithSeo?.seo?.canonicalUrl || (metadataBase ? `${metadataBase}/${params.slug}` : undefined)
  const ogImage = resolveOpenGraphImage((pageWithSeo?.seo?.ogImage as any) || undefined)
  const title = pageWithSeo?.seo?.metaTitle || pageWithSeo?.name
  const description = pageWithSeo?.seo?.metaDescription || pageWithSeo?.name
  const images = ogImage ? [ogImage, ...previousImages] : previousImages

  return {
    title,
    description,
    alternates: canonicalUrl ? {canonical: canonicalUrl} : undefined,
    robots: pageWithSeo?.seo?.noIndex ? {index: false, follow: false} : undefined,
    openGraph: {
      title: pageWithSeo?.seo?.ogTitle || title || undefined,
      description: pageWithSeo?.seo?.ogDescription || description || undefined,
      type: 'website',
      url: canonicalUrl,
      images,
    },
    twitter: {
      card: 'summary_large_image',
      title: pageWithSeo?.seo?.ogTitle || title || undefined,
      description: pageWithSeo?.seo?.ogDescription || description || undefined,
      images: images
        .map((image) => (typeof image === 'string' ? image : image?.url))
        .filter((image): image is string => Boolean(image)),
    },
  } satisfies Metadata
}

export default async function Page(props: Props) {
  const params = await props.params
  const [{data: page}] = await Promise.all([sanityFetch({query: getPageQuery, params})])
  const pageWithSeo = page as PageWithSeo | null
  const customStructuredData = parseJsonObject(pageWithSeo?.structuredData)

  if (!page?._id) {
    return (
      <div className="py-40">
        <PageOnboarding />
      </div>
    )
  }

  return (
    <>
      {customStructuredData ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{__html: JSON.stringify(customStructuredData)}}
        />
      ) : null}
      <div className="my-12 lg:my-24">
        <div>
          <div className="container">
            <div className="pb-6 border-b border-gray-100">
              <div className="max-w-3xl">
                <h1 className="text-4xl text-gray-900 sm:text-5xl lg:text-7xl">{page.name}</h1>
              </div>
            </div>
          </div>
        </div>
        <PageBuilderPage page={page} />
      </div>
    </>
  )
}
