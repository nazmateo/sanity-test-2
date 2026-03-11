import {defineField, defineType} from 'sanity'

export const newsPostCardsBlock = defineType({
  name: 'newsPostCardsBlock',
  title: 'News Post Cards',
  type: 'object',
  fields: [
    defineField({
      name: 'posts',
      title: 'Posts',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'post'}],
        },
      ],
      validation: (Rule) => Rule.required().length(3),
    }),
  ],
  preview: {
    select: {
      postsCount: 'posts',
    },
    prepare({postsCount}) {
      const count = Array.isArray(postsCount) ? postsCount.length : 0
      return {
        title: `News cards (${count})`,
      }
    },
  },
})
