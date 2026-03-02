import {defineArrayMember, defineField, defineType} from 'sanity'

export const menuGroup = defineType({
  name: 'menuGroup',
  title: 'Menu Group',
  type: 'object',
  fields: [
    defineField({
      name: 'menuId',
      title: 'Menu ID',
      description: 'Unique key for frontend mapping (e.g. primary, secondary, footer).',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'links',
      title: 'Links',
      type: 'array',
      of: [defineArrayMember({type: 'menuLink'})],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'menuId',
    },
    prepare({title, subtitle}) {
      return {
        title: title || subtitle || 'Menu Group',
        subtitle,
      }
    },
  },
})
