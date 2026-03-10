import {ControlsIcon} from '@sanity/icons'
import {defineType} from 'sanity'

import {footerFields} from '../objects/footerSettings'

export const footer = defineType({
  name: 'footer',
  title: 'Footer',
  type: 'document',
  icon: ControlsIcon,
  groups: [{name: 'content', title: 'Content', default: true}],
  fields: footerFields.map((field) => ({
    ...field,
    group: 'content',
  })),
  preview: {
    prepare() {
      return {
        title: 'Footer',
      }
    },
  },
})
