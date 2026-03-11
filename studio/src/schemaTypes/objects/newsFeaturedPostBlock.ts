import {defineField, defineType} from 'sanity'

export const newsFeaturedPostBlock = defineType({
  name: 'newsFeaturedPostBlock',
  title: 'News Featured Post',
  type: 'object',
  fields: [
    defineField({
      name: 'post',
      title: 'Featured post',
      type: 'reference',
      to: [{type: 'post'}],
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'post.title',
    },
    prepare({title}) {
      return {
        title: title || 'Featured news post',
      }
    },
  },
})
