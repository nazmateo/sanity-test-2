import {defineArrayMember, defineField, defineType} from 'sanity'

export const sectorsSection = defineType({
  name: 'sectorsSection',
  title: 'Sectors Section',
  type: 'object',
  fields: [
    defineField({
      name: 'sectionId',
      title: 'Section ID',
      type: 'string',
      initialValue: 'sectors',
    }),
    defineField({
      name: 'rows',
      title: 'Rows',
      description:
        'Use cbGroup items as vertical rows. Put the heading in one row, and a cbColumns block in the next row for the left and right content.',
      type: 'array',
      of: [defineArrayMember({type: 'cbGroup'})],
      validation: (Rule) => Rule.required().min(2),
    }),
  ],
  preview: {
    select: {
      title: 'rows.0.children.0.content',
      subtitle: 'sectionId',
    },
    prepare({title, subtitle}) {
      return {
        title: title || 'Sectors Section',
        subtitle: subtitle || 'sectors',
      }
    },
  },
})
