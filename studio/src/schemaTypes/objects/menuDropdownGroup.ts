import {defineArrayMember, defineField, defineType} from 'sanity'

export const menuDropdownGroup = defineType({
  name: 'menuDropdownGroup',
  title: 'Menu Dropdown Group',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'links',
      title: 'Links',
      type: 'array',
      of: [defineArrayMember({type: 'menuSubLink'})],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      links: 'links',
    },
    prepare({title, links}) {
      const count = Array.isArray(links) ? links.length : 0
      return {
        title: title || 'Dropdown Group',
        subtitle: `${count} link${count === 1 ? '' : 's'}`,
      }
    },
  },
})
