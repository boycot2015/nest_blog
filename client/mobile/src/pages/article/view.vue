<template>
	<view class="view-content">
		<view class="title">
			{{viewData.title}}
		</view>
		<view class="main u-flex u-border-bottom u-col-between" v-html="viewData.content"></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				viewData: {}
			}
		},
		onLoad() {
			this.init()
		},
		methods: {
			async init () {
				let res = await this.$api.article.getById({id: this.$route.query.id})
				if (res && res.success) {
					this.viewData = res.data
				}
			}
		}
	}
</script>

<style lang="scss">
.view-content {
	.title {
		font-size: 32upx;
	}
	.main {
		
	}
}
</style>
