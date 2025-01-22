<script setup>
import { computed } from 'vue'
import { useData } from 'vitepress'

const { lang } = useData()

const buttonText = computed(() => {
	const buttonTextMap = {
		zh: '赞助我一下',
	}
	return buttonTextMap[lang.value.split('-')[0]] || 'Buy me a coffee'
})

const imgSrc = computed(() => {
	return `https://img.buymeacoffee.com/button-api/?text=${buttonText.value}&emoji=☕&slug=henrygd&button_colour=5c73e7&font_colour=fff&font_family=Lato&outline_colour=000000&coffee_colour=ffffff&v2`
})
</script>

<template>
	<a href="https://www.buymeacoffee.com/henrygd">
		<img alt="Buy Me A Coffee" :src="imgSrc" width="235" height="50" />
	</a>
</template>
