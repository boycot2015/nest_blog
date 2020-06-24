<template>
	<view class="category u-flex align-center">
		<view class="scroll-content u-flex-1">
			<view class="scroll-content-list">
				<view
				class="category-item"
				v-for="item in menuList"
				:key="item.id"
				:class="{'active': actived === item.id}"
				@tap="onCateClick(item)"
				>
					<view class="text">
						{{item.value}}
					</view>	
				</view>
			</view>
		</view>
		<view
		class="scroll-content right-content u-flex-2"
		:class="{ 'u-row-center u-flex': showNoData }"
		>
			<view class="scroll-content-main u-flex" v-if="!showNoData">
				<view
				class="category-item u-text-center"
				v-for="(item, index) in categoryChildren"
				:key="item.id"
				@tap="onChildClick(item)"
				>
					<view class="text">
						{{item.value}}
					</view>
				</view>
			</view>
			<view class="no-data" v-else>
				暂无数据 ~
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				categoryList: [],
				menuList: [],
				categoryChildren: [],
				actived: '',
				showNoData: true
			}
		},
		onLoad() {
			this.init()
		},
		methods: {
			init () {
				this.$api.category.get().then(res => {
					this.categoryList = res.data[0]
					this.menuList = res.data[0].filter(_ => _.parentId === null)
					// console.log(res.data[0], this.categoryList)
					this.actived = this.menuList[0].id
				})
			},
			onCateClick (item) {
				this.categoryChildren = this.categoryList.filter(_ => _.parentId === item.id)
				if (!this.categoryChildren.length) {
					this.showNoData = true
				} else {
					this.showNoData = false
				}
				this.actived = item.id
			},
			onChildClick (item) {
				getApp().globalData.category = [item.parentId, item.id]
				uni.switchTab({
					url: '/pages/article/index?category=' + item.id
				})
			}
		}
	}
</script>

<style lang="scss">
	.category {
		border-top: 1px solid $c-e8;
		.scroll-content {
			border-right: 1px solid $c-e8;
			height: 1162upx;
			// overflow: hidden;
			// overflow-y: auto;
			&:last-child {
				border-right: 0;
			}
			&-list {
				.category-item {
					padding: 20upx 10upx;
					border-bottom: 1px solid $c-e8;
					background-color: $c-f8;
					color: $c-333;
					position: relative;
					.text {
						border-left: 3px solid transparent;
						padding: 0 30upx;
					}
					&.active {
						background-color: $white;
						color: $primary;
						.text {
							border-left: 3px solid $primary;
						}
						&::after {
							content: "";
							position: absolute;
							right: -1px;
							top: 0;
							width: 1px;
							z-index: 2;
							height: 100%;
							background-color: $white;
						}
					}
				}
			}
			&-main {
				padding: 20upx;
				box-sizing: border-box;
				flex-wrap: wrap;
				width: 100%;
				.category-item {
					padding: 10upx;
					flex-basis: 130upx;
					border: 1px solid $primary;
					margin-bottom: 20upx;
					margin-right: 20upx;
					border-radius: 10upx;
					background-color: $primary;
					color: $white;
					&:nth-child(2n) {
						background-color: $error;
						border-color: $error;
					}
					&:nth-child(3n) {
						margin-right: 0;
						background-color: $success;
						border-color: $success;
					}
					&:last-child {
						 margin-right: auto;
					}
				}
			}
		}
	}
</style>
