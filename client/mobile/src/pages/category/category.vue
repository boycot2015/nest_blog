<template>
	<view class="category u-flex align-center">
		<scroll-view class="scroll-content u-flex-1">
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
		</scroll-view>
		<scroll-view
		class="scroll-content right-content u-flex-2"
		>
		<!-- :class="{ 'u-row-center u-flex': showNoData }" -->
		<!-- v-if="!showNoData" -->
			<view class="scroll-content-main">
				<block v-if="categoryChildren.length">
					<view
					class="category-item u-text-center"
					v-for="(item) in categoryChildren"
                    :style="{background: randomColor(), color: '#fff'}"
					:key="item.id"
					@tap="onChildClick(item)"
					>
						<view class="text">
							{{item.value}}
						</view>
					</view>
				</block>
				<block v-else-if="menuList.length">
					<view
					class="category-item u-text-center"
                    :style="{background: randomColor(), color: '#fff'}"
					@tap="onChildClick(menuList.filter(item => item.id === actived)[0])"
					>
						<view class="text">
							{{menuList.filter(item => item.id === actived)[0].value}}
						</view>
					</view>
				</block>
				<!-- <view class="no-data" v-else>
					暂无数据 ~
				</view> -->
			</view>
			
		</scroll-view>
	</view>
</template>

<script>
	export default {
        name: 'category',
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
			getApp().globalData.category = ''
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
				getApp().globalData.category = []
				item.parentId !== null && getApp().globalData.category.push(item.parentId)
				getApp().globalData.category.push(item.id)
				uni.switchTab({
					url: '/pages/articles/index?category=' + item.id
				})
            },
            randomColor () {
                let arr = ['a','b','c','d','e','f','1','2','3','4','5','6','7','8','9','0']
                let colorStr = []
                for (let index = 0; index < 6; index++) {
                    colorStr.push(arr[Math.floor(Math.random() * (arr.length - 1))])
                }
                // console.log(colorStr)
                return '#' + colorStr.join('')
            }
		}
	}
</script>

<style lang="scss">
    uni-page, uni-page-body {
        height: 100%;
    }
	.category {
        border-top: 1px solid $c-e8;
        height: 100%;
		.scroll-content {
            height: 100%;
			// overflow: hidden;
			// overflow-y: auto;
			&:last-child {
                border-right: 0;
			}
			&-list {
			    border-right: 1px solid $c-e8;
                height: 100%;
                overflow: hidden;
                overflow-y: auto;
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
                        position: relative;
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
                justify-content: space-around;
                align-items: flex-start;
                width: 100%;
                // height: 100%;
                overflow: hidden;
                overflow-y: auto;
                display: flex;
                flex-wrap: wrap;
                // -moz-column-count:2;
                // /* Firefox */
                //     -webkit-column-count:2;
                // /* Safari 和 Chrome */
                // column-count:2;
                // -moz-column-gap:10upx;
                // -webkit-column-gap:10upx;
                // column-gap:10upx;
				.category-item {
                    // -moz-page-break-inside:avoid;
                    // -webkit-column-break-inside:avoid;
                    // break-inside:avoid;
					padding: 10upx;
					flex-basis: 130upx;
					// border: 1px solid $primary;
					margin-bottom: 20upx;
					margin-right: 20upx;
					border-radius: 10upx;
					background-color: $primary;
                    color: $white;
                    height: 64upx;
					// &:nth-child(2n) {
					// 	background-color: $error;
					// 	border-color: $error;
					// }
					// &:nth-child(3n) {
					// 	margin-right: 0;
					// 	background-color: $success;
					// 	border-color: $success;
					// }
					&:last-child {
						 margin-right: auto;
					}
				}
			}
		}
	}
</style>
