import type {Metadata} from 'next'
import type {PortableTextBlock} from 'next-sanity'
import {notFound} from 'next/navigation'

import Footer, {type SiteFooter} from '@/app/components/Footer'
import Header, {type LayoutSettings, type SiteHeader} from '@/app/components/Header'
import {Image} from '@/app/components/atoms/image'
import PageBuilderPage from '@/app/components/PageBuilder'
import PortableText from '@/app/components/PortableText'
import {buildSeoMetadata} from '@/app/lib/seo-metadata'
import {sanityFetch} from '@/sanity/lib/live'
import {
  footerQuery,
  headerQuery,
  postBySlugQuery,
  postSlugsQuery,
  settingsQuery,
} from '@/sanity/lib/queries'
import type {PageDocumentForBuilder, PostReference} from '@/sanity/lib/types'
import {DEFAULT_LANGUAGE} from '@/sanity/lib/i18n'
import {parseJsonObject, resolveOpenGraphImage} from '@/sanity/lib/utils'

type Props = {
  params: Promise<{slug: string}>
}

type OpenGraphImageValue = Parameters<typeof resolveOpenGraphImage>[0]

function formatPostDate(value?: string | null) {
  if (!value) {
    return ''
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date)
}

function resolveSanityImageUrl(image?: PostReference['cardImage']) {
  const asset = image?.asset
  const assetId = asset?._ref || asset?._id
  if (!assetId) {
    return null
  }

  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
  if (!projectId || !dataset) {
    return null
  }

  const match = assetId.match(/^image-([^-]+-\d+x\d+)-([a-z0-9]+)$/i)
  if (!match) {
    return null
  }

  return `https://cdn.sanity.io/images/${projectId}/${dataset}/${match[1]}.${match[2]}`
}

export async function generateStaticParams(): Promise<Array<{slug: string}>> {
  const {data} = await sanityFetch({
    query: postSlugsQuery,
    params: {language: DEFAULT_LANGUAGE},
    perspective: 'published',
    stega: false,
  })

  return ((data as Array<{slug?: string}> | null) || [])
    .map((row) => row.slug)
    .filter((slug): slug is string => Boolean(slug))
    .map((slug) => ({slug}))
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const {data} = await sanityFetch({
    query: postBySlugQuery,
    params: {slug: params.slug, language: DEFAULT_LANGUAGE},
    stega: false,
  })

  const post = data as PostReference | null
  if (!post?._id) {
    return {}
  }

  const resolvedOgImage = resolveOpenGraphImage((post.seo?.ogImage as OpenGraphImageValue) || undefined)

  return buildSeoMetadata({
    title: post.seo?.metaTitle || post.title || undefined,
    description: post.seo?.metaDescription || post.excerpt || undefined,
    seo: post.seo || undefined,
    previousImages: [],
    newImage: resolvedOgImage,
    alternatePath: `/news/${params.slug}`,
    discoveredLanguages: [DEFAULT_LANGUAGE],
    xDefault: undefined,
    ogType: 'article',
  })
}

export default async function NewsPostPage(props: Props) {
  const params = await props.params
  const [{data: postData}, {data: settings}, {data: header}, {data: footer}] = await Promise.all([
    sanityFetch({
      query: postBySlugQuery,
      params: {slug: params.slug, language: DEFAULT_LANGUAGE},
    }),
    sanityFetch({query: settingsQuery}),
    sanityFetch({query: headerQuery}),
    sanityFetch({query: footerQuery}),
  ])

  const post = postData as PostReference | null
  const layoutSettings = settings as LayoutSettings | null
  const siteHeader = header as SiteHeader
  const siteFooter = footer as SiteFooter

  if (!post?._id) {
    return notFound()
  }

  const imageUrl = resolveSanityImageUrl(post.cardImage)
  const customStructuredData = parseJsonObject(post.structuredData)

  return (
    <>
      <Header settings={layoutSettings} header={siteHeader} variant={post.headerVariant || 'positive'} />
      {customStructuredData ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{__html: JSON.stringify(customStructuredData)}}
        />
      ) : null}
      <article className="news-post-page-shell">
        <div className="news-post-content-width">
          <div className="news-post-header">
            <p className="type-news-meta text-foreground/50">{formatPostDate(post.publishedAt)}</p>
            <h1 className="type-news-post-title text-foreground">{post.title || ''}</h1>
            {post.excerpt ? <p className="type-news-body text-foreground">{post.excerpt}</p> : null}
          </div>
          {imageUrl ? (
            <div className="news-post-image-wrap">
              <Image
                src={imageUrl}
                alt={post.cardImage?.alt || post.title || ''}
                unstyled
                className="news-post-image"
              />
            </div>
          ) : null}
          {post.body?.length ? (
            <div className="news-post-body prose prose-gray max-w-none">
              <PortableText value={post.body as PortableTextBlock[]} />
            </div>
          ) : null}
        </div>
        {post.pageBuilder?.length ? <PageBuilderPage page={post as PageDocumentForBuilder} /> : null}
      </article>
      <Footer footer={siteFooter} variant={post.footerVariant || 'negative'} settings={layoutSettings} />
    </>
  )
}
