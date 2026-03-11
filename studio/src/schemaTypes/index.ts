import {page} from './documents/page'
import {legalPage} from './documents/legalPage'
import {header} from './singletons/header'
import {footer} from './singletons/footer'
import {settings} from './singletons/settings'
import {homePage} from './singletons/homePage'
import {blockContent} from './objects/blockContent'
import {blockContentTextOnly} from './objects/blockContentTextOnly'
import {aboutStatCard} from './objects/aboutStatCard'
import {aboutStatsBlock} from './objects/aboutStatsBlock'
import {aboutUsSection} from './objects/aboutUsSection'
import {companiesSection} from './objects/companiesSection'
import cbButton from './objects/button'
import cbButtons from './objects/buttons'
import cbColumn from './objects/column'
import cbColumns from './objects/columns'
import {companyFeatureItem} from './objects/companyFeatureItem'
import {companyFeaturesBlock} from './objects/companyFeaturesBlock'
import cbCover from './objects/cover'
import cbGroup from './objects/group'
import cbHeading from './objects/heading'
import cbHtml from './objects/html'
import cbImage from './objects/image'
import cbLink from './objects/link'
import cbListItem from './objects/list-item'
import cbList from './objects/list'
import cbMedia from './objects/media'
import {heroPhrase} from './objects/heroPhrase'
import {heroSection} from './objects/heroSection'
import {menuGroup} from './objects/menuGroup'
import {menuLink} from './objects/menuLink'
import {menuDropdownGroup} from './objects/menuDropdownGroup'
import {menuSubLink} from './objects/menuSubLink'
import {sectorsListBlock} from './objects/sectorsListBlock'
import {sectorsMediaBlock} from './objects/sectorsMediaBlock'
import {sectorsSection} from './objects/sectorsSection'
import cbNavigationLink from './objects/navigation-link'
import cbNavigation from './objects/navigation'
import cbParagraph from './objects/paragraph'
import cbWysiwyg from './objects/wysiwyg'
import {footerSettings} from './objects/footerSettings'

// Export an array of all the schema types.  This is used in the Sanity Studio configuration. https://www.sanity.io/docs/studio/schema-types

export const schemaTypes = [
  // Singletons
  header,
  footer,
  settings,
  homePage,
  // Documents
  page,
  legalPage,
  // Objects
  aboutStatCard,
  aboutStatsBlock,
  aboutUsSection,
  companiesSection,
  cbButton,
  cbButtons,
  cbColumn,
  cbColumns,
  companyFeatureItem,
  companyFeaturesBlock,
  cbCover,
  cbGroup,
  cbHeading,
  cbHtml,
  cbImage,
  cbLink,
  cbListItem,
  cbList,
  cbMedia,
  heroPhrase,
  heroSection,
  menuGroup,
  menuLink,
  menuDropdownGroup,
  menuSubLink,
  sectorsListBlock,
  sectorsMediaBlock,
  sectorsSection,
  cbNavigationLink,
  cbNavigation,
  cbParagraph,
  cbWysiwyg,
  footerSettings,
  blockContent,
  blockContentTextOnly,
]
