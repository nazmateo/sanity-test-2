import {defineField, defineType} from 'sanity'

export const aboutStatCard = defineType({
  name: 'aboutStatCard',
  title: 'About Stat Card',
  type: 'object',
  fields: [
    defineField({
      name: 'value',
      title: 'Value',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'variant',
      title: 'Variant',
      type: 'string',
      initialValue: 'dark',
      options: {
        list: [
          {title: 'Dark', value: 'dark'},
          {title: 'Blue', value: 'blue'},
          {title: 'Outline', value: 'outline'},
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'value',
      subtitle: 'label',
    },
    prepare({title, subtitle}) {
      return {
        title: title || 'Stat value',
        subtitle: subtitle || 'Stat label',
      }
    },
  },
})
