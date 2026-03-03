import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'cbButton',
  title: 'Content Button',
  type: 'object',
  fields: [
    defineField({name: 'label', title: 'Label', type: 'string'}),
    defineField({
      name: 'actionType',
      title: 'Action Type',
      type: 'string',
      initialValue: 'button',
      validation: (Rule) => Rule.required(),
      options: {
        list: [
          {title: 'Button', value: 'button'},
          {title: 'Link', value: 'link'},
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'link',
      title: 'Link',
      type: 'cbLink',
      hidden: ({parent}) => parent?.actionType !== 'link',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent as {actionType?: string} | undefined
          if (parent?.actionType === 'link' && !value) {
            return 'Link is required when Action Type is Link'
          }
          return true
        }),
    }),
  ],
})
