<template>
	<view class="login pdlr30 u-flex u-flex-col">
		<view class="logo">
			<image src="../../static/logo.png" mode="aspecFill"></image>
		</view>
		<form
		class="login-form"
			@submit="formSubmit"
			@reset="formReset"
		>
			<view class="uni-form-item uni-column u-flex">
				<view class="title u-flex-3">用&nbsp;户&nbsp;&nbsp;名：</view>
				<input class="uni-input u-flex-8" name="username" placeholder="输入用户名" />
			</view>
			<view class="uni-form-item uni-column u-flex">
				<view class="title u-flex-3">密&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;码：</view>
				<input class="uni-input u-flex-8" type="password" name="password" placeholder="输入密码" />
			</view>
			<view class="uni-form-item uni-column u-flex" v-if="!isLogin">
				<view class="title u-flex-3">确认密码：</view>
				<input class="uni-input u-flex-8" type="password" name="password" placeholder="确认密码" />
			</view>
			<!-- <view class="uni-form-item uni-column u-flex u-text-center">
				<view class="title u-flex-1">记住密码</view>
				<view class="u-flex-1">
					<switch name="switch" />
				</view>
			</view> -->
			<view class="uni-btn-v u-text-center">
				<button v-if="isLogin" form-type="submit" type="primary">登录</button>
				<button type="default" @tap="onRegister" :form-type="isLogin ? 'reset':'submit'">注册</button>
				<view @tap="isLogin = true" class="tips" v-if="!isLogin">有账号？去登录</view>
			</view>
		</form>
	</view>
</template>

<script>
	import Cookie from 'js-cookie'
	import { aesEncrypt } from '@/utils'
	 import {  
		// mapState,  
		mapMutations  
	} from 'vuex'

	export default {
        name: 'login',
		data() {
			return {
				isLogin: true
			}
		},
		methods: {
			...mapMutations([
				'login',
				'logout'
			]),
			formSubmit (e) {
				let formdata = e.detail.value
				// console.log('form发生了submit事件，携带数据为：' + JSON.stringify(e.detail.value))
				// uni.showModal({
				// 	content: '表单数据内容：' + JSON.stringify(formdata),
				// 	showCancel: false
				// })
				formdata.password = aesEncrypt(formdata.password, '123456')
				if (!formdata.username || !formdata.password) {
					uni.showModal({
						title: '温馨提示',
						content: '用户名或密码不能为空！',
						showCancel: false
					})
					return
				}
				let api = this.isLogin ? 'login' : 'register'
				this.$api.user[api](formdata).then(async res => {
					if (this.isLogin) {
						if (res && res.success) {
							// Cookie.set('token', res.data)
							await this.login(res.data)
							if (this.$route.query.redirect) {
								uni.navigateBack()
							} else {
								uni.switchTab({
									url: '/pages/index/index'
								})
							}
						} else {
							uni.showModal({
								content: res.message,
								showCancel: false
							})
						}
					} else {
						if (res && res.success) {
							this.isLogin = true
							this.formReset()
						} else {
							uni.showModal({
								content: res.message,
								showCancel: false
							})
						}
					}
				})
			},
			formReset: function(e) {
				// console.log('清空数据')
			},
			onRegister () {
				this.isLogin = false;
				this.formReset()
			}
		}
	}
</script>

<style lang="scss">
	.login {
		.logo {
			width:160upx;
			height: 160upx;
			margin: 150upx 0;
			image {
				width:100%;
				height: 100%;
			}
		}
		&-form {
			width: 600upx;
			.uni-form-item {
				margin-bottom: 60upx;
                font-size: 32upx;
                line-height: 64upx;
				.uni-input {
					padding-bottom: 10upx;
					border-bottom: 1px solid $c-e8;
				}
			}
			.uni-btn-v {
				margin-top: 120upx;
				uni-button[type=primary] {
					margin-bottom: 30upx;
					background-color: $uni-color-primary;
				}
			}
			.tips {
				margin-top: 20upx;
				cursor: pointer;
				color: $uni-color-primary;
			}
		}
	}
</style>
