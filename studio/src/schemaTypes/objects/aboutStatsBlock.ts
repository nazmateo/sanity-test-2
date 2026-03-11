import {defineArrayMember, defineField, defineType} from 'sanity'

export const aboutStatsBlock = defineType({
  name: 'aboutStatsBlock',
  title: 'About Stats Block',
  type: 'object',
  fields: [
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
      title: 'stats.0.value',
      subtitle: 'stats.0.label',
    },
    prepare({title, subtitle}) {
      return {
        title: title || 'About Stats Block',
        subtitle: subtitle || '6 stats',
      }
    },
  },
})
