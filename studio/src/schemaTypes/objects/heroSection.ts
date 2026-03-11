import {defineArrayMember, defineField, defineType} from 'sanity'

export const heroSection = defineType({
  name: 'heroSection',
  title: 'Hero Section',
  type: 'object',
  fields: [
    defineField({
      name: 'sectionId',
      title: 'Section ID',
      description: 'Optional anchor/id for in-page links.',
      type: 'string',
      initialValue: 'hero',
    }),
    defineField({
      name: 'backgroundMedia',
      title: 'Background media',
      type: 'cbMedia',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'content',
      title: 'Content columns',
      type: 'cbColumns',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heroPhrases',
      title: 'Hero phrases',
      description: 'Rendered as animated pill labels over the hero media.',
      type: 'array',
      of: [defineArrayMember({type: 'heroPhrase'})],
      validation: (Rule) => Rule.required().min(1).max(3),
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
      title: 'content.columns.0.children.0.content',
      subtitle: 'sectionId',
    },
    prepare({title, subtitle}) {
      return {
        title: title || 'Hero Section',
        subtitle: subtitle || 'hero',
      }
    },
  },
})
