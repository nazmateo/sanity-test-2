import type {Metadata, ResolvingMetadata} from 'next'
import {notFound} from 'next/navigation'

import PortableText from '@/app/components/PortableText'
import {sanityFetch} from '@/sanity/lib/live'
import {legalPageBySlugQuery} from '@/sanity/lib/queries'
import {resolveOpenGraphImage} from '@/sanity/lib/utils'

type LegalPageData = {
  _id: string
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

export async function generateMetadata(_: unknown, parent: ResolvingMetadata): Promise<Metadata> {
  const {data} = await sanityFetch({
    query: legalPageBySlugQuery,
    params: {slug: 'terms-and-conditions'},
    stega: false,
  })
  const page = data as LegalPageData | null
  const parentMetadata = await parent
  const metadataBase = parentMetadata.metadataBase?.toString().replace(/\/$/, '')
  const canonicalUrl = page?.seo?.canonicalUrl || (metadataBase ? `${metadataBase}/terms-and-conditions` : undefined)
  const previousImages = parentMetadata.openGraph?.images || []
  const ogImage = resolveOpenGraphImage((page?.seo?.ogImage as any) || undefined)
  const title = page?.title || 'Terms and Conditions'
  const description = page?.seo?.metaDescription || 'Terms and conditions'
  const images = ogImage ? [ogImage, ...previousImages] : previousImages

  return {
    title,
    description,
    alternates: canonicalUrl ? {canonical: canonicalUrl} : undefined,
    robots: page?.seo?.noIndex ? {index: false, follow: false} : undefined,
    openGraph: {
      type: 'article',
      title: page?.seo?.ogTitle || title,
      description: page?.seo?.ogDescription || description,
      url: canonicalUrl,
      images,
    },
    twitter: {
      card: 'summary_large_image',
      title: page?.seo?.ogTitle || title,
      description: page?.seo?.ogDescription || description,
      images: images
        .map((image) => (typeof image === 'string' ? image : image?.url))
        .filter((image): image is string => Boolean(image)),
    },
  }
}

export default async function TermsAndConditionsPage() {
  const {data} = await sanityFetch({
    query: legalPageBySlugQuery,
    params: {slug: 'terms-and-conditions'},
  })
  const page = data as LegalPageData | null
  if (!page?._id) {
    return notFound()
  }

  return (
    <div className="container py-16 lg:py-24">
      <article className="max-w-3xl prose prose-gray">
        <h1>{page.title || 'Terms and Conditions'}</h1>
        {page.content?.length ? <PortableText value={page.content as any} /> : null}
      </article>
    </div>
  )
}
