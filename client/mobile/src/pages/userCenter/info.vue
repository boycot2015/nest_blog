<template>
	<view class="info">
		<view class="u-flex u-flex-row pdlr30 u-border-bottom">
			<view class="title">
				头像
			</view>
			<view class="content u-text-right u-flex-3">
				<image :src="userInfo.avatar" mode=""></image>
			</view>
		</view>
		<view class="u-flex u-flex-row pdlr30 u-border-bottom">
			<view class="title">
				用户名
			</view>
			<view class="content u-text-right u-flex-3">
				{{userInfo.username}}
			</view>
		</view>
		<view class="u-flex u-flex-row pdlr30 u-border-bottom">
			<view class="title">
				邮箱
			</view>
			<view class="content u-text-right u-flex-3">
				{{userInfo.email}}
			</view>
		</view>
		<view class="u-flex u-flex-row pdlr30 u-border-bottom">
			<view class="title">
				管理员
			</view>
			<view class="content u-text-right u-flex-3">
				{{userInfo.administrator ? '是' : '否'}}
			</view>
		</view>
		<button type="primary" class="logout" @tap="onLogout">退出登录</button>
	</view>
</template>

<style lang="scss">
.logout {
	margin-top: 30upx;
	width: 80%;
}
image {
	width: 80upx;
	height: 80upx;
	border-radius: 80upx;
	background: $c-e8;
}
</style>
<script>
	import {
		mapMutations  
	} from 'vuex'
	export default {
        name: 'userInfo',
		data() {
			return {
				userInfo: {}
			}
		},
		onLoad() {
			this.initData()
		},
		methods: {
			...mapMutations([
				'logout'
			]),
			initData () {
				let userinfo = window.localStorage.getItem('userinfo')
				userinfo && (this.userInfo = JSON.parse(window.localStorage.getItem('userinfo')))
			},
			async onLogout () {
				await this.logout()
				uni.navigateTo({
					url: '/pages/login/login'
				})
			}
		}
	}
</script>
