import {defineQuery} from 'next-sanity'

const navigationLinksProjection = /* groq */ `
  ...,
  link{
    ...,
    "internalPageSlug": internalPage->slug.current
  },
  subLinks[]{
    ...,
    link{
      ...,
      "internalPageSlug": internalPage->slug.current
    }
  }
`

export const settingsQuery = defineQuery(`
  *[_type == "settings"][0]{
    ...,
    primaryMenu{
      ...,
      links[]{
        ${navigationLinksProjection}
      }
    },
    secondaryMenu{
      ...,
      links[]{
        ${navigationLinksProjection}
      }
    },
    menuGroups[]{
      ...,
      links[]{
        ${navigationLinksProjection}
      }
    }
  }
`)

const postFields = /* groq */ `
  _id,
  "status": select(_originalId in path("drafts.**") => "draft", "published"),
  "title": coalesce(title, "Untitled"),
  "slug": slug.current,
  excerpt,
  coverImage,
  "date": coalesce(date, _updatedAt),
  "author": author->{firstName, lastName, picture},
`

const linkReference = /* groq */ `
  _type == "link" => {
    "page": page->slug.current,
    "post": post->slug.current
  }
`

const cbButtonWithLinkProjection = /* groq */ `
  _type == "cbButton" => {
    ...,
    link{
      ...,
      "internalPageSlug": internalPage->slug.current
    }
  }
`

const cbButtonsWithLinksProjection = /* groq */ `
  _type == "cbButtons" => {
    ...,
    items[]{
      ...,
      link{
        ...,
        "internalPageSlug": internalPage->slug.current
      }
    }
  }
`

const cbNavigationWithLinksProjection = /* groq */ `
  _type == "cbNavigation" => {
    ...,
    links[]{
      ...,
      link{
        ...,
        "internalPageSlug": internalPage->slug.current
      }
    }
  }
`

export const getPageQuery = defineQuery(`
  *[
    _type == 'page' &&
    slug.current == $slug &&
    coalesce(language, "en") == $language
  ][0]{
    _id,
    _type,
    name,
    language,
    slug,
    seo{
      ...,
      ogImage{
        ...,
        asset->
      }
    },
    structuredData,
    "pageBuilder": pageBuilder[]{
      ...,
      ${cbButtonWithLinkProjection},
      ${cbButtonsWithLinksProjection},
      ${cbNavigationWithLinksProjection},
      _type == "cbGroup" => {
        ...,
        children[]{
          ...,
          ${cbButtonWithLinkProjection},
          ${cbButtonsWithLinksProjection},
          ${cbNavigationWithLinksProjection}
        }
      },
      _type == "cbColumn" => {
        ...,
        children[]{
          ...,
          ${cbButtonWithLinkProjection},
          ${cbButtonsWithLinksProjection},
          ${cbNavigationWithLinksProjection}
        }
      },
      _type == "cbCover" => {
        ...,
        content[]{
          ...,
          ${cbButtonWithLinkProjection},
          ${cbButtonsWithLinksProjection},
          ${cbNavigationWithLinksProjection}
        }
      },
      _type == "cbColumns" => {
        ...,
        columns[]{
          ...,
          children[]{
            ...,
            ${cbButtonWithLinkProjection},
            ${cbButtonsWithLinksProjection},
            ${cbNavigationWithLinksProjection}
          }
        }
      }
    }
  }
`)

export const homePageQuery = defineQuery(`
  *[
    _type == "homePage" &&
    coalesce(language, "en") == $language
  ][0]{
    _id,
    _type,
    name,
    seo{
      ...,
      ogImage{
        ...,
        asset->
      }
    },
    structuredData,
    "pageBuilder": pageBuilder[]{
      ...,
      ${cbButtonWithLinkProjection},
      ${cbButtonsWithLinksProjection},
      ${cbNavigationWithLinksProjection},
      _type == "cbGroup" => {
        ...,
        children[]{
          ...,
          ${cbButtonWithLinkProjection},
          ${cbButtonsWithLinksProjection},
          ${cbNavigationWithLinksProjection}
        }
      },
      _type == "cbColumn" => {
        ...,
        children[]{
          ...,
          ${cbButtonWithLinkProjection},
          ${cbButtonsWithLinksProjection},
          ${cbNavigationWithLinksProjection}
        }
      },
      _type == "cbCover" => {
        ...,
        content[]{
          ...,
          ${cbButtonWithLinkProjection},
          ${cbButtonsWithLinksProjection},
          ${cbNavigationWithLinksProjection}
        }
      },
      _type == "cbColumns" => {
        ...,
        columns[]{
          ...,
          children[]{
            ...,
            ${cbButtonWithLinkProjection},
            ${cbButtonsWithLinksProjection},
            ${cbNavigationWithLinksProjection}
          }
        }
      }
    }
  }
`)

export const homePageLanguagesQuery = defineQuery(`
  *[_type == "homePage"]{
    "language": coalesce(language, "en")
  }
`)

export const sitemapData = defineQuery(`
  *[
    (_type == "homePage") ||
    (_type == "page" && defined(slug.current)) ||
    (_type == "legalPage" && defined(slug))
  ] | order(_type asc) {
    "slug": select(_type == "legalPage" => slug, slug.current),
    "language": coalesce(language, "en"),
    _type,
    _updatedAt,
  }
`)

export const legalPageBySlugQuery = defineQuery(`
  *[
    _type == "legalPage" &&
    slug == $slug &&
    coalesce(language, "en") == $language
  ][0]{
    _id,
    title,
    slug,
    language,
    content,
    seo{
      ...,
      ogImage{
        ...,
        asset->
      }
    }
  }
`)

export const allPostsQuery = defineQuery(`
  *[_type == "post" && defined(slug.current)] | order(date desc, _updatedAt desc) {
    ${postFields}
  }
`)

export const morePostsQuery = defineQuery(`
  *[_type == "post" && _id != $skip && defined(slug.current)] | order(date desc, _updatedAt desc) [0...$limit] {
    ${postFields}
  }
`)

export const postQuery = defineQuery(`
  *[_type == "post" && slug.current == $slug] [0] {
    content[]{
    ...,
    markDefs[]{
      ...,
      ${linkReference}
    }
  },
    ${postFields}
  }
`)

export const postPagesSlugs = defineQuery(`
  *[_type == "post" && defined(slug.current)]
  {"slug": slug.current}
`)

export const pagesSlugs = defineQuery(`
  *[
    _type == "page" &&
    defined(slug.current) &&
    coalesce(language, "en") == $language
  ]
  {"slug": slug.current}
`)

export const localizedPagesSlugs = defineQuery(`
  *[
    _type == "page" &&
    defined(slug.current) &&
    coalesce(language, "en") != $defaultLanguage
  ]{
    "slug": slug.current,
    "language": coalesce(language, "en")
  }
`)

export const pageLanguagesBySlugQuery = defineQuery(`
  *[
    _type == "page" &&
    slug.current == $slug
  ]{
    "language": coalesce(language, "en")
  }
`)

export const legalPageLanguagesBySlugQuery = defineQuery(`
  *[
    _type == "legalPage" &&
    slug == $slug
  ]{
    "language": coalesce(language, "en")
  }
`)
