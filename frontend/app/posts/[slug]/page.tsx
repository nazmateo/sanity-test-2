import type {Metadata, ResolvingMetadata} from 'next'
import {notFound} from 'next/navigation'
import {type PortableTextBlock} from 'next-sanity'
import {Suspense} from 'react'

import Avatar from '@/app/components/Avatar'
import {MorePosts} from '@/app/components/Posts'
import PortableText from '@/app/components/PortableText'
import Image from '@/app/components/SanityImage'
import {sanityFetch} from '@/sanity/lib/live'
import {postPagesSlugs, postQuery, settingsQuery} from '@/sanity/lib/queries'
import {ensureAbsoluteUrl, resolveOpenGraphImage} from '@/sanity/lib/utils'

type Props = {
  params: Promise<{slug: string}>
}

type PostData = {
  _id: string
  title?: string
  excerpt?: string
  date?: string
  content?: PortableTextBlock[]
  coverImage?: {
    asset?: {_ref?: string}
    alt?: string
    hotspot?: any
    crop?: any
  } | null
  author?: {
    firstName?: string
    lastName?: string
    picture?: unknown
  } | null
}

/**
 * Generate the static params for the page.
 * Learn more: https://nextjs.org/docs/app/api-reference/functions/generate-static-params
 */
export async function generateStaticParams() {
  const {data} = await sanityFetch({
    query: postPagesSlugs,
    // Use the published perspective in generateStaticParams
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
  const {data: post} = await sanityFetch({
    query: postQuery,
    params,
    // Metadata should never contain stega
    stega: false,
  })
  const parentMetadata = await parent
  const postData = post as PostData | null
  const previousImages = parentMetadata.openGraph?.images || []
  const metadataBase = parentMetadata.metadataBase?.toString().replace(/\/$/, '')
  const canonicalUrl = metadataBase ? `${metadataBase}/posts/${params.slug}` : undefined
  const ogImage = resolveOpenGraphImage(postData?.coverImage)
  const images = ogImage ? [ogImage, ...previousImages] : previousImages

  return {
    authors:
      postData?.author?.firstName && postData?.author?.lastName
        ? [{name: `${postData.author.firstName} ${postData.author.lastName}`}]
        : [],
    title: postData?.title,
    description: postData?.excerpt,
    alternates: canonicalUrl ? {canonical: canonicalUrl} : undefined,
    openGraph: {
      title: postData?.title,
      description: postData?.excerpt,
      type: 'article',
      url: canonicalUrl,
      images,
    },
    twitter: {
      card: 'summary_large_image',
      title: postData?.title,
      description: postData?.excerpt,
      images: images
        .map((image) => (typeof image === 'string' ? image : image?.url))
        .filter((image): image is string => Boolean(image)),
    },
  } satisfies Metadata
}

export default async function PostPage(props: Props) {
  const params = await props.params
  const [{data: post}, {data: settings}] = await Promise.all([
    sanityFetch({query: postQuery, params}),
    sanityFetch({query: settingsQuery}),
  ])
  const postData = post as PostData | null

  if (!postData?._id) {
    return notFound()
  }

  const baseUrl = ensureAbsoluteUrl(settings?.ogImage?.metadataBase)
  const canonicalUrl = `${baseUrl}/posts/${params.slug}`
  const ogImage = resolveOpenGraphImage(postData?.coverImage)
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: postData?.title || '',
    description: postData?.excerpt || '',
    datePublished: postData?.date || undefined,
    dateModified: postData?.date || undefined,
    mainEntityOfPage: canonicalUrl,
    image: ogImage?.url ? [ogImage.url] : undefined,
    author:
      postData?.author?.firstName && postData?.author?.lastName
        ? {
            '@type': 'Person',
            name: `${postData.author.firstName} ${postData.author.lastName}`,
          }
        : undefined,
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(articleJsonLd)}} />
      <div className="">
        <div className="container my-12 lg:my-24 grid gap-12">
          <div>
            <div className="pb-6 grid gap-6 mb-6 border-b border-gray-100">
              <div className="max-w-3xl flex flex-col gap-6">
                <h1 className="text-4xl text-gray-900 sm:text-5xl lg:text-7xl">{postData.title}</h1>
              </div>
              <div className="max-w-3xl flex gap-4 items-center">
                {postData.author && postData.author.firstName && postData.author.lastName && (
                  <Avatar
                    person={{
                      firstName: postData.author.firstName ?? null,
                      lastName: postData.author.lastName ?? null,
                      picture: postData.author.picture as any,
                    }}
                    date={postData.date || ''}
                  />
                )}
              </div>
            </div>
            <article className="gap-6 grid max-w-4xl">
              <div className="">
                {postData?.coverImage && (
                  <Image
                    id={postData.coverImage.asset?._ref || ''}
                    alt={postData.coverImage.alt || ''}
                    className="rounded-sm w-full"
                    width={1024}
                    height={538}
                    mode="cover"
                    hotspot={postData.coverImage.hotspot}
                    crop={postData.coverImage.crop}
                  />
                )}
              </div>
              {postData.content?.length && (
                <PortableText
                  className="max-w-2xl prose-headings:font-medium prose-headings:tracking-tight"
                  value={postData.content}
                />
              )}
            </article>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-100 bg-gray-50">
        <div className="container py-12 lg:py-24 grid gap-12">
          <aside>
            <Suspense>{await MorePosts({skip: postData._id, limit: 2})}</Suspense>
          </aside>
        </div>
      </div>
    </>
  )
}
