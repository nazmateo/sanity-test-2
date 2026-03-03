import {DEFAULT_LANGUAGE, isSupportedLanguage} from '@/sanity/lib/i18n'

export type RouteKind = 'home' | 'page' | 'legal'

export type RouteMatch = {
  kind: RouteKind
  language: string
  slug: string
}

export type SitemapRow = {
  slug?: string
  language?: string
  _type?: 'homePage' | 'page' | 'legalPage'
}

const LEGAL_SLUGS = ['privacy-policy', 'terms-and-conditions'] as const

export function isLegalSlug(slug: string): slug is (typeof LEGAL_SLUGS)[number] {
  return (LEGAL_SLUGS as readonly string[]).includes(slug)
}

export function resolveCatchAllRoute(segments?: string[]): RouteMatch | null {
  if (!segments || segments.length === 0) {
    return null
  }

  if (segments.length === 1) {
    const [segment] = segments
    if (segment === 'home') {
      return null
    }
    if (isSupportedLanguage(segment)) {
      if (segment === DEFAULT_LANGUAGE) {
        return null
      }
      return {kind: 'home', language: segment, slug: 'home'}
    }
    if (isLegalSlug(segment)) {
      return {kind: 'legal', language: DEFAULT_LANGUAGE, slug: segment}
    }
    return {kind: 'page', language: DEFAULT_LANGUAGE, slug: segment}
  }

  if (segments.length === 2) {
    const [language, slug] = segments
    if (!isSupportedLanguage(language) || language === DEFAULT_LANGUAGE || slug === 'home') {
      return null
    }
    if (isLegalSlug(slug)) {
      return {kind: 'legal', language, slug}
    }
    return {kind: 'page', language, slug}
  }

  return null
}

export function routePath(match: RouteMatch): string {
  if (match.kind === 'home') {
    return match.language === DEFAULT_LANGUAGE ? '/' : `/${match.language}`
  }
  return match.language === DEFAULT_LANGUAGE ? `/${match.slug}` : `/${match.language}/${match.slug}`
}

export function buildCatchAllStaticParams(rows: SitemapRow[]): Array<{segments?: string[]}> {
  const params = new Set<string>()

  for (const row of rows) {
    const slug = row.slug
    const language = row.language || DEFAULT_LANGUAGE
    if (!isSupportedLanguage(language)) {
      continue
    }

    if (row._type === 'homePage') {
      if (language !== DEFAULT_LANGUAGE) {
        params.add(language)
      }
      continue
    }

    if (!slug) {
      continue
    }

    if (language === DEFAULT_LANGUAGE) {
      params.add(slug)
      continue
    }

    params.add(`${language}/${slug}`)
  }

  return Array.from(params).map((value) => ({
    segments: value ? value.split('/') : undefined,
  }))
}
