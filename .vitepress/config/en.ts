import { defineConfig, type DefaultTheme } from 'vitepress'
import pkg from '../../package.json'

export const en = defineConfig({
	lang: 'en-US',
	description: 'Lightweight server monitoring with historical data, Docker stats, and alerts.',
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
			collapsed: false,
			items: [
				{ text: 'What is Beszel?', link: 'what-is-beszel' },
				{ text: 'Getting Started', link: 'getting-started' },
			],
		},
		{
			text: 'Installation',
			collapsed: false,
			items: [
				{ text: 'Hub Installation', link: 'hub-installation' },
				{ text: 'Agent Installation', link: 'agent-installation' },
			],
		},
		{
			text: 'Configuration / Guides',
			collapsed: false,
			items: [
				{ text: 'Additional Disks', link: 'additional-disks' },
				{ text: 'Compiling', link: 'compiling' },
				{ text: 'Environment Variables', link: 'environment-variables' },
				{ text: 'GPU Monitoring', link: 'gpu' },
				{ text: 'OAuth / OIDC', link: 'oauth' },
				{ text: 'Podman Monitoring', link: 'podman' },
				{ text: 'REST API', link: 'rest-api' },
				{ text: 'User Roles', link: 'user-roles' },
				// { text: 'Home Assistant agent', link: 'home-assistant' },
			],
		},
		{
			text: 'Troubleshooting',
			collapsed: false,
			items: [{ text: 'Common Issues', link: 'common-issues' }],
		},
		{
			text: 'About',
			collapsed: false,
			items: [
				{ text: 'Security', link: 'security' },
				{ text: 'Developer Guide', link: 'developer-guide' },
				{ text: 'Multilingual and Localization', link: 'multlingual-and-localization' },
			],
		},
	]
}
