<template>
	<view>
		
	</view>
</template>

<script>
	import Cookie from 'js-cookie'
	export default {
		data() {
			return {
					
			}
		},
		onShow(e) {
			if (!Cookie.get('token')) {
				uni.navigateTo({
					url: '/pages/login/login'
				})
			}
		},
		methods: {
			
		}
	}
</script>

<style>

</style>
