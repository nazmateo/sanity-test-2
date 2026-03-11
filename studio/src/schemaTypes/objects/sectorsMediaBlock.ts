import {defineField, defineType} from 'sanity'

export const sectorsMediaBlock = defineType({
  name: 'sectorsMediaBlock',
  title: 'Sectors Media Block',
  type: 'object',
  fields: [
    defineField({
      name: 'rightImage',
      title: 'Right image',
      type: 'cbMedia',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'cta',
      title: 'CTA',
      type: 'cbButton',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'cta.label',
      subtitle: 'rightImage.mediaType',
    },
    prepare({title, subtitle}) {
      return {
        title: title || 'Sectors Media Block',
        subtitle: subtitle || 'Right image',
      }
    },
  },
})
