import {defineArrayMember, defineField, defineType} from 'sanity'

export const companyFeaturesBlock = defineType({
  name: 'companyFeaturesBlock',
  title: 'Company Features Block',
  type: 'object',
  fields: [
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [defineArrayMember({type: 'companyFeatureItem'})],
      validation: (Rule) => Rule.required().length(6),
    }),
  ],
  preview: {
    select: {
      title: 'items.0.title',
      subtitle: 'items.0.category',
    },
    prepare({title, subtitle}) {
      return {
        title: title || 'Company Features Block',
        subtitle: subtitle || '6 company items',
      }
    },
  },
})
