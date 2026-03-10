import {defineArrayMember, defineField, defineType} from 'sanity'

export const footerFields = [
  defineField({
    name: 'positiveLogo',
    title: 'Positive logo',
    description: 'Used on light footer backgrounds.',
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
    description: 'Used on dark footer backgrounds.',
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
    name: 'officeHeading',
    title: 'Office heading',
    type: 'string',
    initialValue: 'Albatha Head Offices',
  }),
  defineField({
    name: 'officeAddressPrimary',
    title: 'Primary office address',
    type: 'text',
    rows: 4,
  }),
  defineField({
    name: 'officeAddressSecondary',
    title: 'Secondary office address',
    type: 'text',
    rows: 4,
  }),
  defineField({
    name: 'navigationGroups',
    title: 'Navigation groups',
    description: 'Footer navigation columns.',
    type: 'array',
    of: [defineArrayMember({type: 'menuGroup'})],
    validation: (rule) => rule.required().min(1),
  }),
  defineField({
    name: 'legalMenu',
    title: 'Legal menu',
    description: 'Optional legal links shown in the bottom row.',
    type: 'menuGroup',
    initialValue: {
      menuId: 'legal',
      title: 'Legal',
    },
    validation: (rule) =>
      rule.custom((value) => {
        const menu = value as {menuId?: string} | undefined
        if (!menu) return true
        if (menu.menuId !== 'legal') {
          return 'Legal menu must use menuId "legal".'
        }
        return true
      }),
  }),
  defineField({
    name: 'showDefaultLegalLinks',
    title: 'Show default legal links',
    description:
      'Fallback to /privacy-policy and /terms-and-conditions when Legal menu is empty.',
    type: 'boolean',
    initialValue: true,
  }),
  defineField({
    name: 'copyrightText',
    title: 'Copyright text',
    type: 'string',
  }),
]

export const footerSettings = defineType({
  name: 'footerSettings',
  title: 'Footer Settings',
  type: 'object',
  fields: footerFields,
  preview: {
    prepare() {
      return {
        title: 'Footer Settings',
      }
    },
  },
})
