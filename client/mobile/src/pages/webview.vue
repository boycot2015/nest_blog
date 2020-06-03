<template>
	<!-- <web-view :src="link"></web-view> -->
	<web-view src="http://192.168.1.175:2020/"></web-view>
</template>

<script>
	export default {
		data () {
			return {
				link: ''
			}
		},
		onLoad(e) {
			this.link = e.url
		}
	}
</script>

<style>
</style>
