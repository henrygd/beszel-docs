<!-- docs/.vitepress/theme/Layout.vue -->
<script setup lang="ts">
import './style.css'
import DefaultTheme from 'vitepress/theme'
import { useData, inBrowser } from 'vitepress'
import { watchEffect } from 'vue'
import BuyMeACoffee from './components/buy-me-a-coffee.vue'
import HomeImages from './components/home-images.vue'

const { lang } = useData()

// redirect to correct language
if (inBrowser) {
	;(() => {
		const lsLang = localStorage.getItem('lang')
		const { pathname } = window.location
		// if not set (first visit) check navigator language and redirect to correct language
		if (!lsLang) {
			const navigatorLang = navigator.language.split('-')[0]
			if (['zh'].includes(navigatorLang)) {
				window.location.pathname = `/${navigatorLang}/${pathname.replace(/^\//, '')}`
			}
			return
		}
		if (lsLang === 'en') {
			return
		}
		if (!pathname.startsWith(`/${lsLang}/`)) {
			window.location.pathname = `/${lsLang}/${pathname.replace(/^\//, '')}`
		}
	})()
}

// watch for user language changes and set preference in local storage
watchEffect(() => {
	if (inBrowser) {
		lang.value && localStorage.setItem('lang', lang.value.split('-')[0])
	}
})
</script>

<template>
	<DefaultTheme.Layout>
		<template #home-hero-image>
			<HomeImages />
		</template>
	</DefaultTheme.Layout>
</template>
