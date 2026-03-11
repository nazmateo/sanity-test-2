import {defineField, defineType} from 'sanity'

export const backToTopBlock = defineType({
  name: 'backToTopBlock',
  title: 'Back To Top',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      initialValue: 'Back to Top',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'targetSectionId',
      title: 'Target section ID',
      type: 'string',
      initialValue: 'hero',
      description: 'Same-page section id to scroll to, without the # symbol.',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'label',
      target: 'targetSectionId',
    },
    prepare({title, target}) {
      return {
        title: title || 'Back to Top',
        subtitle: target ? `#${target}` : undefined,
      }
    },
  },
})
