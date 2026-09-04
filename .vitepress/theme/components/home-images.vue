<template>
	<div class="image-slider">
		<div
			v-for="(image, index) in images"
			:class="['slider-image', { 'fade-out': index === topIndex }]"
			:style="{ zIndex: getZIndex(index), backgroundColor: image.color }"
		>
			<img :key="index" :src="image.src" :style="{ objectPosition: '50%' }" alt="Slideshow Image" />
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			images: [
				{ src: '/image/home-alerts.webp', color: '#0d0e0e' },
				{ src: '/image/home-dashboard.png', color: '#161718' },
				{ src: '/image/home-system.png', color: '#161718' },
			],
			topIndex: 0,
		}
	},
	methods: {
		getZIndex(index) {
			const offset = index - this.topIndex
			return offset >= 0 ? this.images.length - offset : -offset
		},
		startSlideShow() {
			setInterval(() => {
				this.topIndex = (this.topIndex + 1) % this.images.length
			}, 3500)
		},
	},
	mounted() {
		this.startSlideShow()
	},
}
</script>

<style scoped>
.image-slider {
	box-shadow: 0 0 2em #0000003e;
	position: relative;
	/* width: 600px; */
	/* height: 400px; */
	overflow: hidden;

	/* max-width: 400px; */
	/* width: 600px; */
	/* max-width: 80%; */
	/* max-width: 100%; */
	width: 100%;
	display: block;
	aspect-ratio: 10 / 6.833;
	/* height: 500px; */
	/* max-height: 100%; */
	position: relative;
	border-radius: 0.45em;
	background-color: #161718;
}

.slider-image {
	--offset: 8px;
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	/* height: calc(100% - var(--offset) * 2); */
	transition: opacity 0.8s ease-in-out;
}

img {
	position: absolute;
	top: var(--offset);
	left: var(--offset);
	width: calc(100% - var(--offset) * 2);
	object-fit: contain;
	opacity: 1;
}

.fade-out {
	opacity: 0;
}
</style>
