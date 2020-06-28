<template>
	<view class="user-center" v-if="!loading">
		<div class="user-info u-flex u-flex-row" @click="onUserClick">
			<image class="image" :src="userInfo.avatar" mode=""></image>
			<view class="text u-flex-3">
				<view class="user-name">
					{{isLogin ? userInfo.username : '未登录，请登录！'}}
				</view>
				<view class="email" v-if="userInfo.email">
					邮箱：{{ userInfo.email }}
				</view>
			</view>
		</div>
		<view class="record" v-if="isLogin">
			<view class="record-title">
				最近浏览
			</view>
			<view
			    v-for="(val, index) in records"
			    :key="val.id"
				class="record-list u-body-item u-flex u-col-between"
			    @click="handleView(val)"
				:class="{
					'u-border-bottom': index !== records.length - 1
				}"
			>
			    <view class="u-body-item-title u-flex-1 u-text-left u-line-2" v-html="val.title"></view>
			    <image v-if="$options.filters.getImgUrl(val.content)" :src="val.content|getImgUrl" mode="aspectFill" />
			</view>
		</view>
	</view>
</template>
<style lang="scss">
.user-center {
	background-color: $c-f8;
	height: 100%;
	padding-bottom: 90upx;
	.user-info {
		// background: linear-gradient($c-ccc, $primary, $error);
		background-color: $primary;
		height: 300upx;
		padding: 90upx 40upx;
		box-sizing: border-box;
		color: $white;
		.image {
			border-radius: 100upx;
			background-color: $c-ccc;
			margin-right: 30upx;
			width: 100upx;
			height: 100upx;
		}
		.user-name {
			font-size: 36upx;
		}
		.email {
			margin-top: 15upx;
			font-size: 28upx;
		}
	}
	.record {
		background-color: $white;
		border-radius: 10upx;
		margin: 30upx;
		font-size: 32upx;
		&-title {
			padding: 20upx 30upx;	
			padding-bottom: 15upx;
			border-bottom: 1px solid $c-e8;
		}
		&-list {
			padding: 30upx;
		}
	}
}
</style>
<script>
	import Cookie from 'js-cookie'
	import { Base64 } from 'js-base64'
	export default {
		data() {
			return {
				isLogin: false,
				userInfo: {},
				records: [],
				loading: true
			}
		},
		onLoad(e) {
			uni.showLoading({
			    title: '加载中...'
			})
			this.initial()
		},
		onShow() {
			this.initial()
		},
		onPullDownRefresh() {
			this.initial()
		},
		methods: {
			async initial() {
				!this.userInfo.username && (this.loading = true)
				if (Cookie.get('token')) {
					// uni.navigateTo({
					// 	url: '/pages/login/login'
					// })
					!this.userInfo.username && uni.showLoading({
					    title: '加载中...'
					})
					let res = await this.$api.article.get({ current: 1, pageSize: 4 })
					if (res && res.success) this.records = res.data[0]
					this.isLogin = true
					let userinfo = JSON.parse(Base64.decode(Cookie.get('token').split('.')[1]))
					this.userInfo = userinfo
					console.log(userinfo, 'userinfo')
				}
				this.loading = false
				uni.stopPullDownRefresh()
				uni.hideLoading()
			},
			onUserClick () {
				if (!this.isLogin) {
					uni.navigateTo({
						url: '/pages/login/login?redirect=' + this.$route.path
					})
				} else {
					uni.navigateTo({
						url: '/pages/userCenter/info'
					})
				}
			},
			handleView (item) {
				uni.navigateTo({
					url: '/pages/article/view?id='+ item.id
				})
			}
		}
	}
</script>

