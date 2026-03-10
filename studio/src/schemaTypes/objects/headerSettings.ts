import {defineField, defineType} from 'sanity'

export const headerFields = [
  defineField({
    name: 'defaultVariant',
    title: 'Default header variant',
    type: 'string',
    initialValue: 'positive',
    options: {
      list: [
        {title: 'Positive', value: 'positive'},
        {title: 'Negative', value: 'negative'},
      ],
      layout: 'radio',
    },
    validation: (rule) => rule.required(),
  }),
  defineField({
    name: 'positiveLogo',
    title: 'Positive logo',
    description: 'Used on light header backgrounds.',
    type: 'image',
    options: {
      hotspot: true,
    },
    fields: [
      defineField({
        name: 'alt',
        title: 'Alternative text',
        type: 'string',
      }),
    ],
  }),
  defineField({
    name: 'negativeLogo',
    title: 'Negative logo',
    description: 'Used on dark header backgrounds.',
    type: 'image',
    options: {
      hotspot: true,
    },
    fields: [
      defineField({
        name: 'alt',
        title: 'Alternative text',
        type: 'string',
      }),
    ],
  }),
  defineField({
    name: 'primaryMenu',
    title: 'Primary menu',
    description: 'Main header menu.',
    type: 'menuGroup',
    initialValue: {
      menuId: 'primary',
      title: 'Primary',
    },
    validation: (rule) =>
      rule.required().custom((value) => {
        const menu = value as {menuId?: string} | undefined
        if (!menu) return true
        if (menu.menuId !== 'primary') {
          return 'Primary menu must use menuId "primary".'
        }
        return true
      }),
  }),
  defineField({
    name: 'secondaryMenu',
    title: 'Secondary menu',
    description: 'Secondary/utility header menu.',
    type: 'menuGroup',
    initialValue: {
      menuId: 'secondary',
      title: 'Secondary',
    },
    validation: (rule) =>
      rule.required().custom((value) => {
        const menu = value as {menuId?: string} | undefined
        if (!menu) return true
        if (menu.menuId !== 'secondary') {
          return 'Secondary menu must use menuId "secondary".'
        }
        return true
      }),
  }),
  defineField({
    name: 'ctaLabel',
    title: 'Header CTA label',
    type: 'string',
    initialValue: 'About Us',
  }),
  defineField({
    name: 'ctaLink',
    title: 'Header CTA link',
    type: 'cbLink',
  }),
  defineField({
    name: 'languageToggleLabel',
    title: 'Language toggle label',
    type: 'string',
    initialValue: 'AR',
  }),
]

export const headerSettings = defineType({
  name: 'headerSettings',
  title: 'Header Settings',
  type: 'object',
  fields: headerFields,
  preview: {
    prepare() {
      return {
        title: 'Header Settings',
      }
    },
  },
})
