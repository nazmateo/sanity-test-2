import {defineArrayMember} from 'sanity'

type BlockType = {type: string}

export const pageBuilderAtomBlockTypes: BlockType[] = [
  defineArrayMember({type: 'cbButton'}),
  defineArrayMember({type: 'cbHeading'}),
  defineArrayMember({type: 'cbParagraph'}),
  defineArrayMember({type: 'cbWysiwyg'}),
  defineArrayMember({type: 'cbHtml'}),
  defineArrayMember({type: 'cbImage'}),
]

export const pageBuilderContainerBlockTypes: BlockType[] = [
  defineArrayMember({type: 'aboutStatsBlock'}),
  defineArrayMember({type: 'aboutUsSection'}),
  defineArrayMember({type: 'backToTopBlock'}),
  defineArrayMember({type: 'blogPostsSection'}),
  defineArrayMember({type: 'cbButtons'}),
  defineArrayMember({type: 'cbColumns'}),
  defineArrayMember({type: 'cbGroup'}),
  defineArrayMember({type: 'companiesSection'}),
  defineArrayMember({type: 'companyFeaturesBlock'}),
  defineArrayMember({type: 'heroSection'}),
  defineArrayMember({type: 'newsFeaturedPostBlock'}),
  defineArrayMember({type: 'newsPostCardsBlock'}),
  defineArrayMember({type: 'sectorsListBlock'}),
  defineArrayMember({type: 'sectorsMediaBlock'}),
  defineArrayMember({type: 'sectorsSection'}),
  defineArrayMember({type: 'cbList'}),
  defineArrayMember({type: 'cbNavigation'}),
  defineArrayMember({type: 'cbCover'}),
]

export const pageBuilderComposableBlockTypes: BlockType[] = [
  ...pageBuilderAtomBlockTypes,
  ...pageBuilderContainerBlockTypes,
]
