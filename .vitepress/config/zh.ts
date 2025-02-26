import { createRequire } from 'module'
import { defineConfig, type DefaultTheme } from 'vitepress'

const require = createRequire(import.meta.url)
const pkg = require('../../package.json')

export const zh = defineConfig({
	lang: 'zh-Hans',
	description: '轻量级服务器监控，具有历史数据、docker 统计和告警功能',

	themeConfig: {
		nav: nav(),

		sidebar: {
			'/zh/guide/': { base: '/zh/guide/', items: sidebarGuide() },
		},

		editLink: {
			pattern: 'https://github.com/henrygd/beszel-docs/edit/main/:path',
			text: '在 GitHub 上编辑此页面',
		},

		footer: {
			message: '基于 MIT 许可发布',
		},

		docFooter: {
			prev: '上一页',
			next: '下一页',
		},

		outline: {
			label: '页面导航',
		},

		lastUpdated: {
			text: '最后更新于',
			formatOptions: {
				dateStyle: 'short',
				timeStyle: 'medium',
			},
		},

		langMenuLabel: '多语言',
		returnToTopLabel: '回到顶部',
		sidebarMenuLabel: '菜单',
		darkModeSwitchLabel: '主题',
		lightModeSwitchTitle: '切换到浅色模式',
		darkModeSwitchTitle: '切换到深色模式',
	},
})

function nav(): DefaultTheme.NavItem[] {
	return [
		{
			text: '指南',
			link: '/zh/guide/what-is-beszel',
			activeMatch: '/zh/guide/',
		},
		{
			text: pkg.version,
			items: [
				{
					text: '发布记录',
					link: 'https://github.com/henrygd/beszel/releases',
				},
				{
					text: '提交问题',
					link: 'https://github.com/henrygd/beszel/issues/new/choose',
				},
			],
		},
	]
}

function sidebarGuide(): DefaultTheme.SidebarItem[] {
	return [
		{
			text: '简介',
			items: [
				{ text: '什么是 Beszel？', link: 'what-is-beszel' },
				{ text: '快速开始', link: 'getting-started' },
			],
		},
		{
			text: '安装',
			collapsed: false,
			items: [
				{ text: 'Hub 安装', link: 'hub-installation' },
				{ text: 'Agent 安装', link: 'agent-installation' },
				{ text: '高级部署', link: 'advanced-deployment' },
			],
		},
		{
			text: '配置/使用指南',
			collapsed: false,
			items: [
				{ text: '其他磁盘', link: 'additional-disks' },
				{ text: '编译', link: 'compiling' },
				{ text: '环境变量', link: 'environment-variables' },
				{ text: 'GPU 监控', link: 'gpu' },
				{ text: 'OAuth / OIDC 认证', link: 'oauth' },
				{ text: 'Podman 监控', link: 'podman' },
				{ text: 'REST API', link: 'rest-api' },
				{ text: '用户账户', link: 'user-accounts' },
			],
		},
		{
			text: '故障排除',
			collapsed: false,
			items: [
				{ text: '常见问题', link: 'common-issues' },
				{ text: 'Docker Shell', link: 'docker-shell.md' },
			],
		},
		{
			text: '关于',
			collapsed: false,
			items: [
				{ text: '安全', link: 'security' },
				{ text: '开发者指南', link: 'developer-guide' },
				{ text: '多语言和本地化', link: 'multlingual-and-localization' },
			],
		},
	]
}

export const search: DefaultTheme.AlgoliaSearchOptions['locales'] = {
	zh: {
		placeholder: '搜索文档',
		translations: {
			button: {
				buttonText: '搜索文档',
				buttonAriaLabel: '搜索文档',
			},
			modal: {
				searchBox: {
					resetButtonTitle: '清除查询条件',
					resetButtonAriaLabel: '清除查询条件',
					cancelButtonText: '取消',
					cancelButtonAriaLabel: '取消',
				},
				startScreen: {
					recentSearchesTitle: '搜索历史',
					noRecentSearchesText: '没有搜索历史',
					saveRecentSearchButtonTitle: '保存至搜索历史',
					removeRecentSearchButtonTitle: '从搜索历史中移除',
					favoriteSearchesTitle: '收藏',
					removeFavoriteSearchButtonTitle: '从收藏中移除',
				},
				errorScreen: {
					titleText: '无法获取结果',
					helpText: '你可能需要检查你的网络连接',
				},
				footer: {
					selectText: '选择',
					navigateText: '切换',
					closeText: '关闭',
					searchByText: '搜索提供者',
				},
				noResultsScreen: {
					noResultsText: '无法找到相关结果',
					suggestedQueryText: '你可以尝试查询',
					reportMissingResultsText: '你认为该查询应该有结果？',
					reportMissingResultsLinkText: '点击反馈',
				},
			},
		},
	},
}
