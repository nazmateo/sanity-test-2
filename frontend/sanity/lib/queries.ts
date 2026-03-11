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
  },
  dropdownGroups[]{
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

export const settingsQuery = defineQuery(`
  *[_type == "settings"][0]{
    ...,
    menuGroups[]{
      ...,
      links[]{
        ${navigationLinksProjection}
      }
    }
  }
`)

export const headerQuery = defineQuery(`
  *[_type == "header"][0]{
    ...,
    ctaLink{
      ...,
      "internalPageSlug": internalPage->slug.current
    },
    positiveLogo{
      ...,
      asset->
    },
    negativeLogo{
      ...,
      asset->
    },
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
    }
  }
`)

export const footerQuery = defineQuery(`
  *[_type == "footer"][0]{
    ...,
    positiveLogo{
      ...,
      asset->
    },
    negativeLogo{
      ...,
      asset->
    },
    navigationGroups[]{
      ...,
      links[]{
        ${navigationLinksProjection}
      }
    },
    legalMenu{
      ...,
      links[]{
        ${navigationLinksProjection}
      }
    }
  }
`)

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

const cbWysiwygWithResolvedLinksProjection = /* groq */ `
  _type == "cbWysiwyg" => {
    ...,
    content[]{
      ...,
      markDefs[]{
        ...,
        _type == "link" => {
          ...,
          "page": page->slug.current
        }
      }
    }
  }
`

const heroSectionProjection = /* groq */ `
  _type == "heroSection" => {
    ...,
    cta{
      ...,
      link{
        ...,
        "internalPageSlug": internalPage->slug.current
      }
    },
    content{
      ...,
      columns[]{
        ...,
        children[]{
          ...,
          ${cbButtonWithLinkProjection},
          ${cbButtonsWithLinksProjection},
          ${cbNavigationWithLinksProjection},
          ${cbWysiwygWithResolvedLinksProjection}
        }
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
    headerVariant,
    footerVariant,
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
      ${heroSectionProjection},
      ${cbWysiwygWithResolvedLinksProjection},
      _type == "cbGroup" => {
        ...,
        children[]{
          ...,
          ${cbButtonWithLinkProjection},
          ${cbButtonsWithLinksProjection},
          ${cbNavigationWithLinksProjection},
          ${heroSectionProjection},
          ${cbWysiwygWithResolvedLinksProjection}
        }
      },
      _type == "cbColumn" => {
        ...,
        children[]{
          ...,
          ${cbButtonWithLinkProjection},
          ${cbButtonsWithLinksProjection},
          ${cbNavigationWithLinksProjection},
          ${heroSectionProjection},
          ${cbWysiwygWithResolvedLinksProjection}
        }
      },
      _type == "cbCover" => {
        ...,
        content[]{
          ...,
          ${cbButtonWithLinkProjection},
          ${cbButtonsWithLinksProjection},
          ${cbNavigationWithLinksProjection},
          ${heroSectionProjection},
          ${cbWysiwygWithResolvedLinksProjection}
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
            ${cbNavigationWithLinksProjection},
            ${heroSectionProjection},
            ${cbWysiwygWithResolvedLinksProjection}
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
    headerVariant,
    footerVariant,
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
      ${heroSectionProjection},
      ${cbWysiwygWithResolvedLinksProjection},
      _type == "cbGroup" => {
        ...,
        children[]{
          ...,
          ${cbButtonWithLinkProjection},
          ${cbButtonsWithLinksProjection},
          ${cbNavigationWithLinksProjection},
          ${heroSectionProjection},
          ${cbWysiwygWithResolvedLinksProjection}
        }
      },
      _type == "cbColumn" => {
        ...,
        children[]{
          ...,
          ${cbButtonWithLinkProjection},
          ${cbButtonsWithLinksProjection},
          ${cbNavigationWithLinksProjection},
          ${heroSectionProjection},
          ${cbWysiwygWithResolvedLinksProjection}
        }
      },
      _type == "cbCover" => {
        ...,
        content[]{
          ...,
          ${cbButtonWithLinkProjection},
          ${cbButtonsWithLinksProjection},
          ${cbNavigationWithLinksProjection},
          ${heroSectionProjection},
          ${cbWysiwygWithResolvedLinksProjection}
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
            ${cbNavigationWithLinksProjection},
            ${heroSectionProjection},
            ${cbWysiwygWithResolvedLinksProjection}
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
    headerVariant,
    footerVariant,
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
