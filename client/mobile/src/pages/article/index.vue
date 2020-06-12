<template>
	<view>
		<view class="title">
			{{viewList[0].title}}
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				viewList: []
			}
		},
		onLoad() {
			this.init()
		},
		methods: {
			async init () {
				let res = await this.$api.article.get({id: this.$route.query.id})
				if (res && res.success) {
					this.viewList = res.data[0]
				}
			}
		}
	}
</script>

<style>

</style>
