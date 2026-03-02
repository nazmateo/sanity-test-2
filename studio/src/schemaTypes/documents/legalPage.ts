import {defineField, defineType} from 'sanity'
import {DocumentTextIcon} from '@sanity/icons'

export const legalPage = defineType({
  name: 'legalPage',
  title: 'Legal Page',
  type: 'document',
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      description: 'Reserved legal slugs.',
      type: 'string',
      options: {
        list: [
          {title: 'Privacy Policy', value: 'privacy-policy'},
          {title: 'Terms and Conditions', value: 'terms-and-conditions'},
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'blockContent',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        defineField({
          name: 'metaDescription',
          title: 'Meta description',
          type: 'text',
          rows: 3,
          validation: (Rule) => Rule.max(160).warning('Keep meta description under 160 characters.'),
        }),
        defineField({
          name: 'canonicalUrl',
          title: 'Canonical URL',
          type: 'url',
        }),
        defineField({
          name: 'noIndex',
          title: 'No index',
          type: 'boolean',
          initialValue: false,
        }),
        defineField({
          name: 'ogTitle',
          title: 'OpenGraph title',
          type: 'string',
        }),
        defineField({
          name: 'ogDescription',
          title: 'OpenGraph description',
          type: 'text',
          rows: 3,
        }),
        defineField({
          name: 'ogImage',
          title: 'OpenGraph image',
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            defineField({
              name: 'alt',
              title: 'Alternative text',
              type: 'string',
            }),
          ],
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'slug',
    },
  },
})
