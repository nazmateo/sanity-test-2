import {defineArrayMember, defineField, defineType} from 'sanity'

export const companiesSection = defineType({
  name: 'companiesSection',
  title: 'Companies Section',
  type: 'object',
  fields: [
    defineField({
      name: 'sectionId',
      title: 'Section ID',
      type: 'string',
      initialValue: 'companies',
    }),
    defineField({
      name: 'backgroundImage',
      title: 'Background image',
      type: 'cbMedia',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'rows',
      title: 'Rows',
      description:
        'Use cbGroup items as vertical rows. Put the centered heading in one row, and the company features block in the next row.',
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
        title: title || 'Companies Section',
        subtitle: subtitle || 'companies',
      }
    },
  },
})
