import {defineField, defineType} from 'sanity'

export const menuSubLink = defineType({
  name: 'menuSubLink',
  title: 'Menu Sub Link',
  type: 'object',
  fields: [
    defineField({
      name: 'itemId',
      title: 'Unique ID',
      description: 'Unique key for frontend mapping (e.g. company-about).',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'link',
      title: 'Link',
      type: 'cbLink',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'label',
      subtitle: 'itemId',
    },
  },
})
