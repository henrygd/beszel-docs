import { createRequire } from 'module'
import { defineConfig, type DefaultTheme } from 'vitepress'

const require = createRequire(import.meta.url)
const pkg = require('../../package.json')

export const en = defineConfig({
	lang: 'en-US',
	description: 'Lightweight server monitoring with historical data, docker stats, and alerts',
	themeConfig: {
		nav: nav(),

		sidebar: {
			'/guide/': { base: '/guide/', items: sidebarGuide() },
		},

		editLink: {
			pattern: 'https://github.com/henrygd/beszel-docs/edit/main/:path',
			text: 'Edit this page on GitHub',
		},

		footer: {
			message: 'Released under the MIT License',
		},
	},
})

function nav(): DefaultTheme.NavItem[] {
	return [
		{
			text: 'Guide',
			link: '/guide/what-is-beszel',
			activeMatch: '/guide/',
		},
		{
			text: pkg.version,
			items: [
				{
					text: 'Releases',
					link: 'https://github.com/henrygd/beszel/releases',
				},
				{
					text: 'New Issue',
					link: 'https://github.com/henrygd/beszel/issues/new',
				},
			],
		},
	]
}

function sidebarGuide(): DefaultTheme.SidebarItem[] {
	return [
		{
			text: 'Introduction',
			items: [
				{ text: 'What is Beszel?', link: 'what-is-beszel' },
				{ text: 'Getting Started', link: 'getting-started' },
				{ text: 'Install Hub', link: 'install-hub' },
				{ text: 'Install Agent', link: 'install-agent' },
			],
		},
		{
			text: 'Contribute',
			items: [
				{ text: 'Multilingual and Localization', link: 'i18n' },
			],
		}
	]
}
