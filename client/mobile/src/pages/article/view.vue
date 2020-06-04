<template>
	<view class="view-content">
		<view class="title">
			{{viewData.title}}
		</view>
		<view class="main u-flex u-border-bottom u-col-between">
			<!-- <view class="desc" v-html="viewData.content"></view> -->
			 <rich-text :nodes="viewData.content"></rich-text>
			<!-- <web-view v-html="viewData.content"></web-view> -->
		</view>
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
		padding: 20upx 30upx;
		border-bottom: 1px solid $c-e8;
	}
	.main {
		.desc {
			font-size: 24upx;
			width: 100%;
			overflow: hidden;
			line-height: 32upx;
			margin: 20upx 30upx;
		}
	}
}
</style>
