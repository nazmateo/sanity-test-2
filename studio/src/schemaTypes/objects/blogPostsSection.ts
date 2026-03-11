import {defineField, defineType} from 'sanity'

export const blogPostsSection = defineType({
  name: 'blogPostsSection',
  title: 'Blog Posts Section',
  type: 'object',
  fields: [
    defineField({
      name: 'sectionId',
      title: 'Section ID',
      type: 'string',
      initialValue: 'blog-posts',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'rows',
      title: 'Rows',
      type: 'array',
      of: [{type: 'cbGroup'}],
      validation: (Rule) => Rule.required().min(3),
    }),
  ],
  preview: {
    select: {
      sectionId: 'sectionId',
    },
    prepare({sectionId}) {
      return {
        title: 'Blog Posts Section',
        subtitle: sectionId || 'blog-posts',
      }
    },
  },
})
