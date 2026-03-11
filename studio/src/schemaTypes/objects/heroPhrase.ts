import {defineField, defineType} from 'sanity'

export const heroPhrase = defineType({
  name: 'heroPhrase',
  title: 'Hero Phrase',
  type: 'object',
  fields: [
    defineField({
      name: 'text',
      title: 'Text',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'text',
    },
  },
})
