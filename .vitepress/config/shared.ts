import { defineConfig } from 'vitepress'
import { search as zhSearch } from './zh'

// https://vitepress.dev/reference/site-config
export const shared = defineConfig({
	title: 'Beszel',
	appearance: 'dark',
	lastUpdated: true,
	cleanUrls: true,
	ignoreDeadLinks: 'localhostLinks',
	rewrites: {
		'en/:rest*': ':rest*',
	},
	head: [
		['link', { rel: 'icon', type: 'image/svg+xml', href: '/icon.svg' }],
		['meta', { property: 'og:type', content: 'website' }],
		['meta', { property: 'og:site_name', content: 'Beszel' }],
		['meta', { property: 'og:title', content: 'Beszel | Simple, lightweight server monitoring' }],
		['meta', { property: 'og:url', content: 'https://beszel.dev' }],
		['meta', { property: 'og:image', content: 'https://beszel.dev/image/social.png' }],
	],
	themeConfig: {
		// https://vitepress.dev/reference/default-theme-config
		// logo: '/logo.svg',
		search: {
			provider: 'local',
			options: {
				locales: {
					...zhSearch,
				},
			},
		},

		editLink: {
			pattern: 'https://github.com/henrygd/beszel-docs/edit/main/:path',
		},

		nav: [
			{ text: 'Home', link: '/' },
			{ text: 'Guide', link: '/guide/what-is-beszel' },
		],

		sidebar: [
			{
				text: 'Introduction',
				items: [
					{ text: 'What is Beszel?', link: '/guide/what-is-beszel' },
					{ text: 'Getting Started', link: '/guide/getting-started' },
				],
			},
		],

		socialLinks: [{ icon: 'github', link: 'https://github.com/henrygd/beszel' }],

		footer: {
			message: 'Released under the MIT License',
		},
	},
})
