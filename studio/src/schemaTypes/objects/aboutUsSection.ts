import {defineArrayMember, defineField, defineType} from 'sanity'

export const aboutUsSection = defineType({
  name: 'aboutUsSection',
  title: 'About Us Section',
  type: 'object',
  fields: [
    defineField({
      name: 'sectionId',
      title: 'Section ID',
      type: 'string',
      initialValue: 'about-us',
    }),
    defineField({
      name: 'introContent',
      title: 'Intro content',
      description: 'Use nested cbColumns and cb blocks for the image and text content.',
      type: 'cbColumns',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'stats',
      title: 'Stats',
      type: 'array',
      of: [defineArrayMember({type: 'aboutStatCard'})],
      validation: (Rule) => Rule.required().length(6),
    }),
  ],
  preview: {
    select: {
      title: 'introContent.columns.1.children.0.content',
      subtitle: 'sectionId',
    },
    prepare({title, subtitle}) {
      return {
        title: title || 'About Us Section',
        subtitle: subtitle || 'about-us',
      }
    },
  },
})
