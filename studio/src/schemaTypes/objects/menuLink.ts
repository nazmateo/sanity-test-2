import {defineArrayMember, defineField, defineType} from 'sanity'

export const menuLink = defineType({
  name: 'menuLink',
  title: 'Menu Link',
  type: 'object',
  fields: [
    defineField({
      name: 'itemId',
      title: 'Unique ID',
      description: 'Unique key for frontend mapping (e.g. nav-services).',
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
      name: 'link',
      title: 'Link',
      type: 'cbLink',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subLinks',
      title: 'Sub links',
      description: 'Only used for navigation settings menus.',
      type: 'array',
      of: [defineArrayMember({type: 'menuSubLink'})],
    }),
  ],
  preview: {
    select: {
      title: 'label',
      subtitle: 'itemId',
    },
  },
})
