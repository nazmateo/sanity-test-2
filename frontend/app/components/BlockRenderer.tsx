import AboutUsSection from '@/app/components/AboutUsSection'
import CTA from '@/app/components/Cta'
import CompaniesSection from '@/app/components/CompaniesSection'
import HeroSection from '@/app/components/HeroSection'
import InfoSection from '@/app/components/InfoSection'
import SectorsSection from '@/app/components/SectorsSection'
import CustomPortableText from '@/app/components/PortableText'
import type {PortableTextBlock} from 'next-sanity'
import type {ReactNode} from 'react'
import {Button} from '@/app/components/atoms/button'
import {Heading} from '@/app/components/atoms/heading'
import {Html} from '@/app/components/atoms/html'
import {Image} from '@/app/components/atoms/image'
import {ListItem} from '@/app/components/atoms/list-item'
import {NavigationLink} from '@/app/components/atoms/navigation-link'
import {Paragraph} from '@/app/components/atoms/paragraph'
import {Buttons} from '@/app/components/molecules/buttons'
import {Column} from '@/app/components/molecules/column'
import {Group} from '@/app/components/molecules/group'
import {List} from '@/app/components/molecules/list'
import {Navigation} from '@/app/components/molecules/navigation'
import {BlockSlot} from '@/app/components/organisms/block-slot'
import {Columns} from '@/app/components/organisms/columns'
import {Cover} from '@/app/components/organisms/cover'
import {
  type CbButton,
  type CbColumn,
  type CbCover,
  type CbGroup,
  type AboutStatCard,
  type AboutStatsBlock,
  type AboutUsSection as AboutUsSectionBlock,
  type CompaniesSection as CompaniesSectionBlock,
  type CompanyFeatureItem,
  type HeroSection as HeroSectionBlock,
  type CbLink,
  type CbMedia,
  type PageBuilderSection,
  type SectorsListBlock,
  type SectorsMediaBlock,
  type SectorsSection as SectorsSectionBlock,
} from '@/sanity/lib/types'
import {dataAttr} from '@/sanity/lib/utils'

type BlockRendererProps = {
  block: PageBuilderSection
  index: number
  pageType: string
  pageId: string
  blockPath: string
  isDraftMode: boolean
}

function toArrayItemPath(arrayPath: string, key: string | undefined, index: number): string {
  if (key) {
    return `${arrayPath}[_key=="${key}"]`
  }
  return `${arrayPath}[${index}]`
}

function resolveLinkHref(link?: CbLink | null, fallbackUrl?: string | null): string | null {
  if (
    link?.linkType === 'internal' &&
    (link.internalTargetType === 'page' || link.internalTargetType == null) &&
    link.internalPageSlug
  ) {
    return `/${link.internalPageSlug}`
  }

  if (link?.linkType === 'internal' && link.internalPath) {
    return link.internalPath.startsWith('/') ? link.internalPath : `/${link.internalPath}`
  }

  if (link?.linkType === 'external' && link.externalUrl) {
    return link.externalUrl
  }

  return fallbackUrl || null
}

function isExternalLink(link?: CbLink | null): boolean {
  return link?.linkType === 'external'
}

function normalizeHeadingLevel(
  level?: string | number | null,
): 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' {
  if (typeof level === 'string') {
    if (
      level === 'h1' ||
      level === 'h2' ||
      level === 'h3' ||
      level === 'h4' ||
      level === 'h5' ||
      level === 'h6'
    ) {
      return level
    }
    return 'h2'
  }

  if (typeof level === 'number' && level >= 1 && level <= 6) {
    return `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  }

  return 'h2'
}

function imageAssetRefToUrl(ref?: string | null): string | null {
  if (!ref) {
    return null
  }

  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
  if (!projectId || !dataset) {
    return null
  }

  const match = ref.match(/^image-([^-]+-\d+x\d+)-([a-z0-9]+)$/i)
  if (!match) {
    return null
  }

  return `https://cdn.sanity.io/images/${projectId}/${dataset}/${match[1]}.${match[2]}`
}

function fileAssetRefToUrl(ref?: string | null): string | null {
  if (!ref) {
    return null
  }

  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
  if (!projectId || !dataset) {
    return null
  }

  const match = ref.match(/^file-([^-]+)-([a-z0-9]+)$/i)
  if (!match) {
    return null
  }

  return `https://cdn.sanity.io/files/${projectId}/${dataset}/${match[1]}.${match[2]}`
}

function resolveMediaUrls(media?: CbMedia | null) {
  const imageRef = media?.image?.asset?._ref
  const videoRef = media?.videoFile?.asset?._ref

  return {
    imageUrl: imageAssetRefToUrl(imageRef),
    videoUrl: fileAssetRefToUrl(videoRef),
    alt: media?.image?.alt || '',
    mediaType: media?.mediaType || 'image',
  }
}

function renderMedia(
  media?: CbMedia | null,
  fallbackUrl?: string | null,
  fallbackAlt?: string | null,
) {
  const resolved = resolveMediaUrls(media)
  const mediaType = resolved.mediaType
  const url = (mediaType === 'video' ? resolved.videoUrl : resolved.imageUrl) || fallbackUrl || ''
  const alt = resolved.alt || fallbackAlt || ''

  if (!url) {
    return null
  }

  if (mediaType === 'video') {
    return <video src={url} controls className="h-auto max-w-full rounded-md" />
  }

  return <Image src={url} alt={alt} className="h-auto max-w-full" />
}

function renderButton(button: CbButton, key?: string) {
  const text = button.label || button.text || 'Button'
  const href = resolveLinkHref(button.link, button.url)

  if (button.actionType === 'link' || href) {
    return (
      <NavigationLink
        key={key}
        href={href || '#'}
        className="inline-flex"
        target={isExternalLink(button.link) && button.link?.openInNewTab ? '_blank' : undefined}
        rel={
          isExternalLink(button.link) && button.link?.openInNewTab
            ? 'noopener noreferrer'
            : undefined
        }
      >
        <Button>{text}</Button>
      </NavigationLink>
    )
  }

  return <Button key={key}>{text}</Button>
}

function renderColumnContent(
  column: CbColumn,
  pageId: string,
  pageType: string,
  columnPath: string,
  isDraftMode: boolean,
) {
  return (
    <div
      data-sanity={
        isDraftMode
          ? dataAttr({
              id: pageId,
              type: pageType,
              path: `${columnPath}.children`,
            }).toString()
          : undefined
      }
    >
      {(column.children || []).map((child, childIndex) => (
        <BlockRenderer
          key={child._key || `${column._key || 'column'}-${childIndex}`}
          block={child}
          index={childIndex}
          pageId={pageId}
          pageType={pageType}
          blockPath={toArrayItemPath(`${columnPath}.children`, child._key, childIndex)}
          isDraftMode={isDraftMode}
        />
      ))}
    </div>
  )
}

function renderGroupContent(
  group: CbGroup,
  pageId: string,
  pageType: string,
  groupPath: string,
  isDraftMode: boolean,
) {
  return (
    <div
      data-sanity={
        isDraftMode
          ? dataAttr({
              id: pageId,
              type: pageType,
              path: `${groupPath}.children`,
            }).toString()
          : undefined
      }
    >
      {(group.children || []).map((child, childIndex) => (
        <BlockRenderer
          key={child._key || `${group._key || 'group'}-${childIndex}`}
          block={child}
          index={childIndex}
          pageId={pageId}
          pageType={pageType}
          blockPath={toArrayItemPath(`${groupPath}.children`, child._key, childIndex)}
          isDraftMode={isDraftMode}
        />
      ))}
    </div>
  )
}

function renderCoverContent(
  cover: CbCover,
  pageId: string,
  pageType: string,
  coverPath: string,
  isDraftMode: boolean,
) {
  return (
    <div
      data-sanity={
        isDraftMode
          ? dataAttr({
              id: pageId,
              type: pageType,
              path: `${coverPath}.content`,
            }).toString()
          : undefined
      }
    >
      {(cover.content || []).map((child, childIndex) => (
        <BlockRenderer
          key={child._key || `${cover._key || 'cover'}-${childIndex}`}
          block={child}
          index={childIndex}
          pageId={pageId}
          pageType={pageType}
          blockPath={toArrayItemPath(`${coverPath}.content`, child._key, childIndex)}
          isDraftMode={isDraftMode}
        />
      ))}
    </div>
  )
}

function renderHeroColumnContent(
  column: CbColumn,
  pageId: string,
  pageType: string,
  columnPath: string,
  isDraftMode: boolean,
) {
  return (
    <div
      data-sanity={
        isDraftMode
          ? dataAttr({
              id: pageId,
              type: pageType,
              path: `${columnPath}.children`,
            }).toString()
          : undefined
      }
      className="space-y-4"
    >
      {(column.children || []).map((child, childIndex) => {
        const childPath = toArrayItemPath(`${columnPath}.children`, child._key, childIndex)
        const childDataAttr = isDraftMode
          ? dataAttr({
              id: pageId,
              type: pageType,
              path: childPath,
            }).toString()
          : undefined

        if (child._type === 'cbHeading') {
          const as = normalizeHeadingLevel(child.level)
          return (
            <Heading
              key={child._key || `hero-heading-${childIndex}`}
              as={as}
              unstyled
              className={as === 'h1' ? 'type-hero-heading whitespace-pre-line text-white' : 'type-h2 text-white'}
              data-sanity={childDataAttr}
            >
              {child.content || ''}
            </Heading>
          )
        }

        if (child._type === 'cbParagraph') {
          return (
            <Paragraph
              key={child._key || `hero-paragraph-${childIndex}`}
              unstyled
              className="type-hero-body text-white"
              data-sanity={childDataAttr}
            >
              {child.content || ''}
            </Paragraph>
          )
        }

        return (
          <BlockRenderer
            key={child._key || `hero-child-${childIndex}`}
            block={child}
            index={childIndex}
            pageId={pageId}
            pageType={pageType}
            blockPath={childPath}
            isDraftMode={isDraftMode}
          />
        )
      })}
    </div>
  )
}

function renderAboutImageColumn(
  column: CbColumn | undefined,
  pageId: string,
  pageType: string,
  columnPath: string | undefined,
  isDraftMode: boolean,
) {
  if (!column || !columnPath) {
    return null
  }

  const imageBlock = (column.children || []).find((child) => child._type === 'cbImage')
  if (!imageBlock || imageBlock._type !== 'cbImage') {
    return null
  }

  const childIndex = (column.children || []).findIndex((child) => child._key === imageBlock._key)
  const childPath = toArrayItemPath(`${columnPath}.children`, imageBlock._key, childIndex >= 0 ? childIndex : 0)
  const media = resolveMediaUrls(imageBlock.media)
  const url = media.imageUrl || imageBlock.url || ''

  if (!url) {
    return null
  }

  return (
    <div
      data-sanity={
        isDraftMode
          ? dataAttr({
              id: pageId,
              type: pageType,
              path: childPath,
            }).toString()
          : undefined
      }
    >
      <Image src={url} alt={media.alt || imageBlock.alt || ''} unstyled className="about-image-media" />
    </div>
  )
}

function renderAboutTextColumn(
  column: CbColumn | undefined,
  pageId: string,
  pageType: string,
  columnPath: string | undefined,
  isDraftMode: boolean,
) {
  if (!column || !columnPath) {
    return {
      content: null,
      ctaHref: null,
      ctaLabel: null,
    }
  }

  let ctaHref: string | null = null
  let ctaLabel: string | null = null

  const content = (
    <div className="about-copy-text">
      {(column.children || []).map((child, childIndex) => {
        const childPath = toArrayItemPath(`${columnPath}.children`, child._key, childIndex)
        const childDataAttr = isDraftMode
          ? dataAttr({
              id: pageId,
              type: pageType,
              path: childPath,
            }).toString()
          : undefined

        if (child._type === 'cbHeading') {
          const as = normalizeHeadingLevel(child.level)
          return (
            <Heading
              key={child._key || `about-heading-${childIndex}`}
              as={as}
              unstyled
              className="type-h2 text-foreground"
              data-sanity={childDataAttr}
            >
              {child.content || ''}
            </Heading>
          )
        }

        if (child._type === 'cbParagraph') {
          return (
            <Paragraph
              key={child._key || `about-paragraph-${childIndex}`}
              unstyled
              className="type-body text-foreground"
              data-sanity={childDataAttr}
            >
              {child.content || ''}
            </Paragraph>
          )
        }

        if (child._type === 'cbButton') {
          ctaHref = resolveLinkHref(child.link, child.url)
          ctaLabel = child.label || child.text || null
          return null
        }

        return (
          <BlockRenderer
            key={child._key || `about-child-${childIndex}`}
            block={child}
            index={childIndex}
            pageId={pageId}
            pageType={pageType}
            blockPath={childPath}
            isDraftMode={isDraftMode}
          />
        )
      })}
    </div>
  )

  return {content, ctaHref, ctaLabel}
}

function extractAboutRows(rows: CbGroup[] | null | undefined) {
  const introRow = rows?.[0]
  const statsRow = rows?.[1]
  const introColumnsBlock = introRow?.children?.find((child) => child._type === 'cbColumns')
  const statsBlock = statsRow?.children?.find((child) => child._type === 'aboutStatsBlock')

  if (!introColumnsBlock || introColumnsBlock._type !== 'cbColumns') {
    return {
      introColumns: null,
      stats: [],
    }
  }

  const stats =
    statsBlock && statsBlock._type === 'aboutStatsBlock'
      ? ((statsBlock as AboutStatsBlock).stats || [])
      : []

  return {
    introColumns: introColumnsBlock,
    stats,
  }
}

function renderSectorsHeadingGroup(
  group: CbGroup | undefined,
  pageId: string,
  pageType: string,
  groupPath: string | undefined,
  isDraftMode: boolean,
) {
  if (!group || !groupPath) {
    return null
  }

  return (
    <div>
      {(group.children || []).map((child, childIndex) => {
        const childPath = toArrayItemPath(`${groupPath}.children`, child._key, childIndex)
        const childDataAttr = isDraftMode
          ? dataAttr({
              id: pageId,
              type: pageType,
              path: childPath,
            }).toString()
          : undefined

        if (child._type === 'cbHeading') {
          return (
            <Heading
              key={child._key || `sectors-heading-${childIndex}`}
              as={normalizeHeadingLevel(child.level)}
              unstyled
              className="type-h2 text-foreground whitespace-pre-line"
              data-sanity={childDataAttr}
            >
              {child.content || ''}
            </Heading>
          )
        }

        if (child._type === 'cbParagraph') {
          return (
            <Paragraph
              key={child._key || `sectors-paragraph-${childIndex}`}
              unstyled
              className="type-body text-foreground"
              data-sanity={childDataAttr}
            >
              {child.content || ''}
            </Paragraph>
          )
        }

        return (
          <BlockRenderer
            key={child._key || `sectors-heading-child-${childIndex}`}
            block={child}
            index={childIndex}
            pageId={pageId}
            pageType={pageType}
            blockPath={childPath}
            isDraftMode={isDraftMode}
          />
        )
      })}
    </div>
  )
}

function renderSectorsImage(
  media: CbMedia | null | undefined,
  className: string,
  fallbackAlt = '',
) {
  const resolved = resolveMediaUrls(media)
  const url = resolved.imageUrl || ''

  if (!url) {
    return null
  }

  return <Image src={url} alt={resolved.alt || fallbackAlt} unstyled className={className} />
}

function extractSectorsRowContent(rows: CbGroup[] | null | undefined) {
  const headingRow = rows?.[0]
  const bodyRow = rows?.[1]
  const bodyColumns = bodyRow?.children?.find((child) => child._type === 'cbColumns')

  if (!bodyColumns || bodyColumns._type !== 'cbColumns') {
    return {
      headingRow,
      listBlock: null,
      mediaBlock: null,
    }
  }

  const leftColumn = bodyColumns.columns?.[0]
  const rightColumn = bodyColumns.columns?.[1]
  const listBlock =
    leftColumn?.children?.find((child) => child._type === 'sectorsListBlock') || null
  const mediaBlock =
    rightColumn?.children?.find((child) => child._type === 'sectorsMediaBlock') || null

  return {
    headingRow,
    listBlock: listBlock && listBlock._type === 'sectorsListBlock' ? (listBlock as SectorsListBlock) : null,
    mediaBlock: mediaBlock && mediaBlock._type === 'sectorsMediaBlock' ? (mediaBlock as SectorsMediaBlock) : null,
  }
}

function renderCompaniesHeadingGroup(
  group: CbGroup | undefined,
  pageId: string,
  pageType: string,
  groupPath: string | undefined,
  isDraftMode: boolean,
) {
  if (!group || !groupPath) {
    return null
  }

  return (
    <div>
      {(group.children || []).map((child, childIndex) => {
        const childPath = toArrayItemPath(`${groupPath}.children`, child._key, childIndex)
        const childDataAttr = isDraftMode
          ? dataAttr({
              id: pageId,
              type: pageType,
              path: childPath,
            }).toString()
          : undefined

        if (child._type === 'cbParagraph') {
          return (
            <Paragraph
              key={child._key || `companies-paragraph-${childIndex}`}
              unstyled
              className="type-companies-body text-white"
              data-sanity={childDataAttr}
            >
              {child.content || ''}
            </Paragraph>
          )
        }

        if (child._type === 'cbHeading') {
          return (
            <Heading
              key={child._key || `companies-heading-${childIndex}`}
              as={normalizeHeadingLevel(child.level)}
              unstyled
              className="type-companies-body text-white"
              data-sanity={childDataAttr}
            >
              {child.content || ''}
            </Heading>
          )
        }

        return (
          <BlockRenderer
            key={child._key || `companies-heading-child-${childIndex}`}
            block={child}
            index={childIndex}
            pageId={pageId}
            pageType={pageType}
            blockPath={childPath}
            isDraftMode={isDraftMode}
          />
        )
      })}
    </div>
  )
}

function extractCompaniesRows(rows: CbGroup[] | null | undefined) {
  const headingRow = rows?.[0]
  const featuresRow = rows?.[1]
  const featuresBlock = featuresRow?.children?.find((child) => child._type === 'companyFeaturesBlock')

  return {
    headingRow,
    items:
      featuresBlock && featuresBlock._type === 'companyFeaturesBlock'
        ? featuresBlock.items || []
        : [],
  }
}

export default function BlockRenderer({
  block,
  index,
  pageType,
  pageId,
  blockPath,
  isDraftMode,
}: BlockRendererProps) {
  const key = block._key || `${block._type}-${index}`
  const blockDataAttr = isDraftMode
    ? dataAttr({
        id: pageId,
        type: pageType,
        path: blockPath,
      }).toString()
    : undefined

  switch (block._type) {
    case 'cbHeading': {
      const as = normalizeHeadingLevel(block.level)
      return (
        <BlockSlot
          refId={key}
          data-page-id={pageId}
          data-page-type={pageType}
          data-sanity={blockDataAttr}
          unstyled
        >
          <Heading as={as}>{block.content || ''}</Heading>
        </BlockSlot>
      )
    }
    case 'cbParagraph':
      return (
        <BlockSlot
          refId={key}
          data-page-id={pageId}
          data-page-type={pageType}
          data-sanity={blockDataAttr}
        >
          <Paragraph>{block.content || ''}</Paragraph>
        </BlockSlot>
      )
    case 'cbWysiwyg':
      return (
        <BlockSlot
          refId={key}
          data-page-id={pageId}
          data-page-type={pageType}
          data-sanity={blockDataAttr}
        >
          <div className="prose">
            <CustomPortableText
              value={Array.isArray(block.content) ? (block.content as PortableTextBlock[]) : []}
            />
          </div>
        </BlockSlot>
      )
    case 'cbHtml':
      return (
        <BlockSlot
          refId={key}
          data-page-id={pageId}
          data-page-type={pageType}
          data-sanity={blockDataAttr}
        >
          <Html html={block.content || ''} />
        </BlockSlot>
      )
    case 'cbImage':
      return (
        <BlockSlot
          refId={key}
          data-page-id={pageId}
          data-page-type={pageType}
          data-sanity={blockDataAttr}
        >
          {renderMedia(block.media, block.url, block.alt)}
        </BlockSlot>
      )
    case 'cbButton':
      return (
        <BlockSlot
          refId={key}
          data-page-id={pageId}
          data-page-type={pageType}
          data-sanity={blockDataAttr}
        >
          {renderButton(block)}
        </BlockSlot>
      )
    case 'cbButtons':
      return (
        <BlockSlot
          refId={key}
          data-page-id={pageId}
          data-page-type={pageType}
          data-sanity={blockDataAttr}
        >
          <Buttons>
            {(block.items || []).map((item, i) => (
              <span
                key={item._key || `${key}-${i}`}
                data-sanity={
                  isDraftMode
                    ? dataAttr({
                        id: pageId,
                        type: pageType,
                        path: toArrayItemPath(`${blockPath}.items`, item._key, i),
                      }).toString()
                    : undefined
                }
              >
                {renderButton(item, item._key || `${key}-${i}`)}
              </span>
            ))}
          </Buttons>
        </BlockSlot>
      )
    case 'cbList':
      return (
        <BlockSlot
          refId={key}
          data-page-id={pageId}
          data-page-type={pageType}
          data-sanity={blockDataAttr}
        >
          <List kind={block.ordered ? 'ordered' : 'unordered'}>
            {(block.items || []).map((item, i) => (
              <ListItem
                key={item._key || `${key}-${i}`}
                data-sanity={
                  isDraftMode
                    ? dataAttr({
                        id: pageId,
                        type: pageType,
                        path: toArrayItemPath(`${blockPath}.items`, item._key, i),
                      }).toString()
                    : undefined
                }
              >
                {item.content || ''}
              </ListItem>
            ))}
          </List>
        </BlockSlot>
      )
    case 'cbNavigation':
      return (
        <BlockSlot
          refId={key}
          data-page-id={pageId}
          data-page-type={pageType}
          data-sanity={blockDataAttr}
        >
          <Navigation>
            <div className="flex flex-wrap gap-3">
              {(block.links || []).map((link, i) => (
                <NavigationLink
                  key={link._key || `${key}-${i}`}
                  data-sanity={
                    isDraftMode
                      ? dataAttr({
                          id: pageId,
                          type: pageType,
                          path: toArrayItemPath(`${blockPath}.links`, link._key, i),
                        }).toString()
                      : undefined
                  }
                  href={resolveLinkHref(link.link, link.url) || '#'}
                  target={
                    isExternalLink(link.link) && link.link?.openInNewTab ? '_blank' : undefined
                  }
                  rel={
                    isExternalLink(link.link) && link.link?.openInNewTab
                      ? 'noopener noreferrer'
                      : undefined
                  }
                >
                  {link.label || 'Link'}
                </NavigationLink>
              ))}
            </div>
          </Navigation>
        </BlockSlot>
      )
    case 'cbGroup':
      return (
        <BlockSlot
          refId={key}
          data-page-id={pageId}
          data-page-type={pageType}
          data-sanity={blockDataAttr}
        >
          <Group className="flex flex-wrap items-start gap-4">
            {renderGroupContent(block, pageId, pageType, blockPath, isDraftMode)}
          </Group>
        </BlockSlot>
      )
    case 'cbColumn':
      return (
        <BlockSlot
          refId={key}
          data-page-id={pageId}
          data-page-type={pageType}
          data-sanity={blockDataAttr}
        >
          <Column className="space-y-4">
            {renderColumnContent(block, pageId, pageType, blockPath, isDraftMode)}
          </Column>
        </BlockSlot>
      )
    case 'cbColumns':
      return (
        <BlockSlot
          refId={key}
          data-page-id={pageId}
          data-page-type={pageType}
          data-sanity={blockDataAttr}
        >
          <Columns>
            {(block.columns || []).map((column, i) => (
              <Column
                key={column._key || `${key}-${i}`}
                className="col-span-12 md:col-span-6 space-y-4"
                data-sanity={
                  isDraftMode
                    ? dataAttr({
                        id: pageId,
                        type: pageType,
                        path: toArrayItemPath(`${blockPath}.columns`, column._key, i),
                      }).toString()
                    : undefined
                }
              >
                {renderColumnContent(
                  column,
                  pageId,
                  pageType,
                  toArrayItemPath(`${blockPath}.columns`, column._key, i),
                  isDraftMode,
                )}
              </Column>
            ))}
          </Columns>
        </BlockSlot>
      )
    case 'cbCover': {
      const coverMedia = resolveMediaUrls(block.backgroundMedia)
      return (
        <BlockSlot
          refId={key}
          data-page-id={pageId}
          data-page-type={pageType}
          data-sanity={blockDataAttr}
        >
          <Cover
            backgroundMedia={
              coverMedia.videoUrl
                ? {mediaType: 'video', url: coverMedia.videoUrl}
                : coverMedia.imageUrl
                  ? {mediaType: 'image', url: coverMedia.imageUrl}
                  : undefined
            }
            imageUrl={block.url || undefined}
            contentClassName="space-y-4 text-white"
          >
            {renderCoverContent(block, pageId, pageType, blockPath, isDraftMode)}
          </Cover>
        </BlockSlot>
      )
    }
    case 'heroSection': {
      const heroBlock = block as HeroSectionBlock
      const columns = heroBlock.content?.columns || []
      const leftColumn = columns[0]
      const rightColumn = columns[1]
      const heroMedia = resolveMediaUrls(heroBlock.backgroundMedia)
      const leftPath = leftColumn
        ? toArrayItemPath(`${blockPath}.content.columns`, leftColumn._key, 0)
        : undefined
      const rightPath = rightColumn
        ? toArrayItemPath(`${blockPath}.content.columns`, rightColumn._key, 1)
        : undefined

      return (
        <BlockSlot
          refId={key}
          data-page-id={pageId}
          data-page-type={pageType}
          data-sanity={blockDataAttr}
          unstyled
        >
          <HeroSection
            sectionId={heroBlock.sectionId}
            backgroundImageUrl={heroMedia.imageUrl}
            backgroundVideoUrl={heroMedia.videoUrl}
            heroPhrases={heroBlock.heroPhrases}
            ctaHref={heroBlock.cta ? resolveLinkHref(heroBlock.cta.link, heroBlock.cta.url) : null}
            ctaLabel={heroBlock.cta?.label}
            leftContent={
              leftColumn && leftPath ? (
                <div
                  data-sanity={
                    isDraftMode
                      ? dataAttr({
                          id: pageId,
                          type: pageType,
                          path: leftPath,
                        }).toString()
                      : undefined
                  }
                >
                  {renderHeroColumnContent(leftColumn, pageId, pageType, leftPath, isDraftMode)}
                </div>
              ) : null
            }
            rightContent={
              rightColumn && rightPath ? (
                <div
                  data-sanity={
                    isDraftMode
                      ? dataAttr({
                          id: pageId,
                          type: pageType,
                          path: rightPath,
                        }).toString()
                      : undefined
                  }
                >
                  {renderHeroColumnContent(rightColumn, pageId, pageType, rightPath, isDraftMode)}
                </div>
              ) : null
            }
          />
        </BlockSlot>
      )
    }
    case 'aboutUsSection': {
      const aboutBlock = block as AboutUsSectionBlock
      const {introColumns, stats} = extractAboutRows(aboutBlock.rows)
      const columns = introColumns?.columns || []
      const imageColumn = columns[0]
      const textColumn = columns[1]
      const imageColumnPath = imageColumn
        ? toArrayItemPath(`${blockPath}.rows[0].children[0].columns`, imageColumn._key, 0)
        : undefined
      const textColumnPath = textColumn
        ? toArrayItemPath(`${blockPath}.rows[0].children[0].columns`, textColumn._key, 1)
        : undefined
      const {content, ctaHref, ctaLabel} = renderAboutTextColumn(
        textColumn,
        pageId,
        pageType,
        textColumnPath,
        isDraftMode,
      )

      return (
        <BlockSlot
          refId={key}
          data-page-id={pageId}
          data-page-type={pageType}
          data-sanity={blockDataAttr}
          unstyled
        >
          <AboutUsSection
            sectionId={aboutBlock.sectionId}
            image={renderAboutImageColumn(imageColumn, pageId, pageType, imageColumnPath, isDraftMode)}
            textContent={content}
            ctaHref={ctaHref}
            ctaLabel={ctaLabel}
            stats={stats}
          />
        </BlockSlot>
      )
    }
    case 'sectorsSection': {
      const sectorsBlock = block as SectorsSectionBlock
      const {headingRow, listBlock, mediaBlock} = extractSectorsRowContent(sectorsBlock.rows)
      const headingPath = headingRow ? toArrayItemPath(`${blockPath}.rows`, headingRow._key, 0) : undefined
      const ctaHref = mediaBlock?.cta ? resolveLinkHref(mediaBlock.cta.link, mediaBlock.cta.url) : null
      const ctaLabel = mediaBlock?.cta?.label || mediaBlock?.cta?.text || null

      return (
        <BlockSlot
          refId={key}
          data-page-id={pageId}
          data-page-type={pageType}
          data-sanity={blockDataAttr}
          unstyled
        >
          <SectorsSection
            sectionId={sectorsBlock.sectionId}
            heading={renderSectorsHeadingGroup(
              headingRow || undefined,
              pageId,
              pageType,
              headingPath,
              isDraftMode,
            )}
            leftImage={renderSectorsImage(listBlock?.leftImage, 'sectors-left-image', 'Albatha sectors visual')}
            rightImage={renderSectorsImage(mediaBlock?.rightImage, 'sectors-media-image', 'Albatha sector image')}
            ctaHref={ctaHref}
            ctaLabel={ctaLabel}
          />
        </BlockSlot>
      )
    }
    case 'companiesSection': {
      const companiesBlock = block as CompaniesSectionBlock
      const {headingRow, items} = extractCompaniesRows(companiesBlock.rows)
      const headingPath = headingRow ? toArrayItemPath(`${blockPath}.rows`, headingRow._key, 0) : undefined

      return (
        <BlockSlot
          refId={key}
          data-page-id={pageId}
          data-page-type={pageType}
          data-sanity={blockDataAttr}
          unstyled
        >
          <CompaniesSection
            sectionId={companiesBlock.sectionId}
            backgroundImage={renderSectorsImage(
              companiesBlock.backgroundImage,
              'companies-background-image',
              'Albatha companies background',
            )}
            heading={renderCompaniesHeadingGroup(
              headingRow || undefined,
              pageId,
              pageType,
              headingPath,
              isDraftMode,
            )}
            items={items}
            resolveHref={(item: CompanyFeatureItem) => resolveLinkHref(item.link, null)}
          />
        </BlockSlot>
      )
    }
    case 'callToAction':
      return (
        <BlockSlot
          refId={key}
          data-page-id={pageId}
          data-page-type={pageType}
          data-sanity={blockDataAttr}
        >
          <CTA block={block as never} index={index} pageId={pageId} pageType={pageType} />
        </BlockSlot>
      )
    case 'infoSection':
      return (
        <BlockSlot
          refId={key}
          data-page-id={pageId}
          data-page-type={pageType}
          data-sanity={blockDataAttr}
        >
          <InfoSection block={block as never} index={index} pageId={pageId} pageType={pageType} />
        </BlockSlot>
      )
    default:
      return null
  }
}
