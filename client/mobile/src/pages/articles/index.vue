<template>
	<view class="article">
		<view class="article-banner" @click="goDetail(currentView || viewList[0])" v-if="viewList && viewList.length">
			<image class="banner-img" :src="currentView.img || $options.filters.getImgUrl(currentView.content)" mode="aspectFill"></image>
			<view class="banner-title">{{ currentView.title }}</view>
		</view>
		<view class="article-list">
			<uni-card v-for="(val, index) in viewList" :key="index">
				<view class="u-flex u-flex-row" @click="goDetail(val)">
					<view class="u-flex-1">
						<view class="text">
							<view class="title u-line-2">{{val.title}}</view>
							<view class="time" v-if="val.comment && val.comment.length">{{val.comment|getCommentNum }} 条评论 · {{new Date(val.createTime).getTime()|timeFilter}}</view>
							<view class="time" v-else>暂无评论 · {{new Date(val.createTime).getTime()|timeFilter}}</view>
						</view>
					</view>
					<image class="ml10 img" v-if="val.img || $options.filters.getImgUrl(val.content)" :src="val.img || $options.filters.getImgUrl(val.content)" mode="aspectFill"></image>
				</view>
			</uni-card>
		</view>
		<uni-load-more :status="status" @clickLoadMore="clickLoadMore" :icon-size="16" />
	</view>
</template>

<script>
	export default {
        name: 'articles',
		data() {
			return {
                viewList: [],
                currentView: '',
				status: 'loading',
				contentText: '',
				current: 1,
				pageSize: 10,
				category: '',
				total: 0
			}
		},
		onLoad(e) {
			this.init()
		},
		onShow () {
			let category = getApp().globalData.category
			// if (this.viewList.length === this.total) return
			if (category && JSON.stringify(category) !== JSON.stringify(this.category)) {
				this.viewList = []
				this.category = category
				this.init({
					current: this.category ? 1 : this.current + 1,
					category: this.category,
					pageSize: this.pageSize
				})
            }
		},
		onHide() {
			// this.category = ''
		},
		onPullDownRefresh() {
			this.current = 1
			this.category = ''
			this.init()
		},
		onReachBottom() {
			//触底的时候请求数据，即为上拉加载更多
			if (this.viewList.length === this.total) return
			this.current += 1
			this.status = 'more'
			const { current, pageSize, category } = this 
			this.init({ current, pageSize, category })
		},
		methods: {
			async init (optipns) {
				optipns = optipns || {
					current: this.current,
					category: this.category,
					pageSize: this.pageSize
				}
				this.status = 'loading'
				let res = await this.$api.article.get(optipns)
				if (res && res.success) {
					// console.log(res.data[0], 'res.data[0]')
					if (this.current > 1) {
						setTimeout(() => {
							this.viewList = this.viewList.concat(res.data[0])
							this.total = res.data[1]
							this.status = 'more'
							if (this.viewList.length === res.data[1]) {
								this.status = 'noMore'
							}
						}, 1000)
						
					} else {
						this.viewList = res.data[0]
						this.total = res.data[1]
						this.status = 'more'
						if (this.viewList.length === res.data[1]) {
							this.status = 'noMore'
                        }
                        this.viewList.some(el => {
                            return el.img && (this.currentView = el)
                        })
					}
					setTimeout(function() {
						uni.stopPullDownRefresh()
					}, 1000)
				}
			},
			goDetail (item) {
                this.currentView = item
                if (item.url) {
                    window.open(item.url)
                    return
                }
				uni.navigateTo({
					url: '/pages/articles/view?id='+ item.id
				})
				// this.$router.push('/pages/webview?url='+ item.link)
			},
			clickLoadMore ({ detail }) {
				const { status } = detail
				this.current += 1
				status === 'more' && this.init()
			}
		}
	}
</script>

<style scoped>
.ml10 {
    margin-left: 16upx;
}
.mr10 {
    margin-right: 16upx;
}
</style>
