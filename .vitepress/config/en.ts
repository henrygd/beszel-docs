import { defineConfig, type DefaultTheme } from "vitepress";
import pkg from "../../package.json";

export const en = defineConfig({
	lang: "en-US",
	description:
		"Lightweight server monitoring with historical data, Docker stats, and alerts.",
	themeConfig: {
		nav: nav(),

		sidebar: {
			"/guide/": { base: "/guide/", items: sidebarGuide() },
		},

		editLink: {
			pattern: "https://github.com/henrygd/beszel-docs/edit/main/:path",
			text: "Edit this page on GitHub",
		},

		footer: {
			message: "Released under the MIT License",
		},
	},
});

function nav(): DefaultTheme.NavItem[] {
	return [
		{
			text: "Guide",
			link: "/guide/what-is-beszel",
			activeMatch: "/guide/",
		},
		{
			text: pkg.version,
			items: [
				{
					text: "Releases",
					link: "https://github.com/henrygd/beszel/releases",
				},
				{
					text: "New Issue",
					link: "https://github.com/henrygd/beszel/issues/new/choose",
				},
			],
		},
	];
}

function sidebarGuide(): DefaultTheme.SidebarItem[] {
	return [
		{
			text: "Introduction",
			collapsed: false,
			items: [
				{ text: "What is Beszel?", link: "what-is-beszel" },
				{ text: "Getting Started", link: "getting-started" },
			],
		},
		{
			text: "Installation",
			collapsed: false,
			items: [
				{ text: "Hub Installation", link: "hub-installation" },
				{ text: "Agent Installation", link: "agent-installation" },
				{ text: "Advanced Deployment", link: "advanced-deployment" },
			],
		},
		{
			text: "Configuration / Guides",
			collapsed: false,
			items: [
				{ text: "Additional Disks", link: "additional-disks" },
				{ text: "Compiling", link: "compiling" },
				{ text: "Environment Variables", link: "environment-variables" },
				{ text: "GPU Monitoring", link: "gpu" },
				{ text: "Healthchecks", link: "healthchecks" },
				{
					text: "Notifications",
					link: "notifications",
					collapsed: true,
					items: [
						{ text: "Generic", link: "/notifications/generic" },
						{ text: "Bark", link: "/notifications/bark" },
						{ text: "Discord", link: "/notifications/discord" },
						{ text: "Gotify", link: "/notifications/gotify" },
						{ text: "Google Chat", link: "/notifications/googlechat" },
						{ text: "IFTTT", link: "/notifications/ifttt" },
						{ text: "Join", link: "/notifications/join" },
						{ text: "Lark", link: "/notifications/lark" },
						{ text: "Mattermost", link: "/notifications/mattermost" },
						{ text: "Matrix", link: "/notifications/matrix" },
						{ text: "Ntfy", link: "/notifications/ntfy" },
						{ text: "OpsGenie", link: "/notifications/opsgenie" },
						{ text: "Pushbullet", link: "/notifications/pushbullet" },
						{ text: "Pushover", link: "/notifications/pushover" },
						{ text: "Rocketchat", link: "/notifications/rocketchat" },
						{ text: "Signal", link: "/notifications/signal" },
						{ text: "Slack", link: "/notifications/slack" },
						{ text: "Teams", link: "/notifications/teams" },
						{ text: "Telegram", link: "/notifications/telegram" },
						{ text: "WeCom", link: "/notifications/wecom" },
						{ text: "Zulip Chat", link: "/notifications/zulip" },
					],
				},
				{ text: "OAuth / OIDC", link: "oauth" },
				{ text: "Podman Monitoring", link: "podman" },
				{ text: "REST API", link: "rest-api" },
				{ text: "Reverse Proxy", link: "reverse-proxy" },
				{ text: "S.M.A.R.T. Data", link: "smart-data" },
				{ text: "Systemd Services", link: "systemd" },
				{ text: "User Accounts", link: "user-accounts" },
				{
					text: "Third-Party Integrations",
					collapsed: true,
					items: [
						{ text: 'Home Assistant agent', link: '/third-party-integrations/home-assistant' },
					],
				},
			],
		},
		{
			text: "Troubleshooting",
			collapsed: false,
			items: [
				{ text: "Common Issues", link: "common-issues" },
				{ text: "Docker Shell", link: "docker-shell.md" },
			],
		},
		{
			text: "About",
			collapsed: false,
			items: [
				{ text: "Developer Guide", link: "developer-guide" },
				{
					text: "Multilingual and Localization",
					link: "multlingual-and-localization",
				},
				{ text: "Security Information", link: "security" },
				{ text: "Support / Discussion", link: "support-discussion" },
			],
		},
	];
}
