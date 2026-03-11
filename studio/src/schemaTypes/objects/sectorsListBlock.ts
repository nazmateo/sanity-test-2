import {defineField, defineType} from 'sanity'

export const sectorsListBlock = defineType({
  name: 'sectorsListBlock',
  title: 'Sectors List Block',
  type: 'object',
  fields: [
    defineField({
      name: 'leftImage',
      title: 'Left image',
      type: 'cbMedia',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      subtitle: 'leftImage.mediaType',
    },
    prepare({subtitle}) {
      return {
        title: 'Sectors Left Image Block',
        subtitle: subtitle || 'Left image',
      }
    },
  },
})
