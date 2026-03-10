import {ControlsIcon} from '@sanity/icons'
import {defineType} from 'sanity'

import {headerFields} from '../objects/headerSettings'

export const header = defineType({
  name: 'header',
  title: 'Header',
  type: 'document',
  icon: ControlsIcon,
  groups: [{name: 'content', title: 'Content', default: true}],
  fields: headerFields.map((field) => ({
    ...field,
    group: 'content',
  })),
  preview: {
    prepare() {
      return {
        title: 'Header',
      }
    },
  },
})
