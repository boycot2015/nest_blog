<template>
    <view class="content" v-show="!loading">
		 <swiper
		 class="swiper"
		 :indicator-dots="indicatorDots"
		 :autoplay="autoplay"
		 :circular="true"
		 :indicator-active-color="'#00aa00'"
		 :interval="interval"
		 :duration="duration">
			<swiper-item
			v-for="item in bannerlist"
			@click="handleBannerClick(item)"
			:key="item.index">
				<view class="swiper-item">
					<image :src="item.url" mode="aspectFill"></image>
				</view>
			</swiper-item>
		</swiper>
		<view class="notice pdlr30 u-flex"
		v-if="showNotice && homeData.notice">
			<text class="title">公告：</text>
			<view
				@click="onNoticeClick(homeData.notice)"
				class="notice-content u-flex-3"
			>
				<rich-text ref="textMove" class="text textMove" :style="{ left: positionStyle.left }" :nodes="homeData.notice.title"></rich-text>
			</view>
			<uni-icons type="closeempty" @tap="showNotice = false" color="#666" size="20"></uni-icons>
		</view>
        <u-card
		v-if="homeData.newLeast.length"
        :title="'最新发布'"
        :sub-title="new Date(homeData.newLeast[0].updateTime).getTime()|timeFilter"
		>
            <view class="u-text-left" slot="body">
                <view
                    v-for="(val, index) in homeData.newLeast"
                    :key="val.id"
                    @click="handleView(val)"
					:class="{
						'u-p-t-0': index === 0,
						'u-border-bottom': index !== homeData.newLeast.length - 1
					}"
                    class="u-body-item u-flex u-col-between"
                >
                    <view class="u-body-item-title u-flex-1 u-text-left u-line-2" v-html="val.title"></view>
                    <image v-if="$options.filters.getImgUrl(val.content)" :src="val.content|getImgUrl" mode="aspectFill" />
                </view>
            </view>
            <view class="" slot="foot"><u-icon name="chat-fill" size="34" color="" :label="homeData.newLeast[0] && getCommentNum(homeData.newLeast[0].comment) + '评论'"></u-icon></view>
        </u-card>
    </view>
</template>
<style scoped lang="scss">
	.swiper {
		height: 400upx;
		uni-image {
			width: 100%;
			height: 400upx;
		}
	}
	.notice{
		position:relative;
		height:72upx;
		font:normal 24upx/72upx "microsoft yahei";
		color:#333;
		background:#ffebcb;
		overflow:hidden;
		z-index:100;
		padding:0 30upx;
		.title {
			background:#ffebcb;
		}
		&-content {
			position: relative;
			z-index: 9;
			height:100%;
			overflow: hidden;
		}
		.text {
			height:100%;
			width: auto;
			flex-wrap: nowrap;
			position: absolute;
		}
	}
</style>
<script>
	import { getCommentNum } from '@/utils'
    export default {
        name: 'index',
        data() {
            return {
                title: 'Hello',
                bannerlist: [
                    {
                        image: '/static/uView/swiper/swiper1.jpg',
                        title: '蒹葭苍苍，白露为霜。所谓伊人，在水一方',
                    },
                    {
                        image: '/static/uView/swiper/swiper2.jpg',
                        title: '溯洄从之，道阻且长。溯游从之，宛在水中央',
                    },
                    {
                        image: '/static/uView/swiper/swiper3.jpg',
                        title: '蒹葭萋萋，白露未晞。所谓伊人，在水之湄',
                    },
                ],
                homeData: {
                    banner: [],
                    notice: {},
                    siteConfig: {},
                    theme: {},
                    newLeast: [],
                    id: ''
                },
				getCommentNum,
				indicatorDots: true,
				autoplay: true,
				interval: 2000,
				duration: 500,
				showNotice: true,
				loading: true,
				positionStyle:{
					left: 0
				}
            }
        },
        async onLoad() {
			uni.showLoading({
			    title: '加载中...'
			})
            await this.initData()
			this.textMove()
        },
		onPullDownRefresh() {
			this.initData()
        },
        computed: {
            userInfo () {
                // console.log(this.$store.state)
                return this.$store.state.userInfo || {}
            }
        },
        watch: {
            $route (to, from) {
                if (from.path === '/pages/login/login') {
                    uni.showLoading({
                        title: '加载中...'
                    })
                    this.initData()
                }
            }
        },
        methods: {
            async initData() {
                let [configRes, listRes] = await Promise.all([await this.$api.setting.get({ websiteId: this.userInfo.websiteId }), await this.$api.home.datas()])
                let homeData = {}
                if (configRes && configRes.success) {
                    if (configRes.data) {
                        homeData.banner = configRes.data.banner !== null ? JSON.parse(configRes.data.banner) : []
                        homeData.notice = configRes.data.notice !== null ? JSON.parse(configRes.data.notice) : {}
                        homeData.siteConfig = configRes.data.siteConfig !== null ? JSON.parse(configRes.data.siteConfig) : {}
                        homeData.theme = configRes.data.theme !== null ? JSON.parse(configRes.data.theme) : {}
                        homeData.id = configRes.data.id
                    }
                    this.bannerlist = homeData.banner
                    this.homeData = homeData
                }
				if (listRes && listRes.success) {
                    this.homeData.newLeast = listRes.data.newLeast
                } else {
                    listRes && this.$message.error(listRes.message)
					this.showNotice = false
                }
				uni.stopPullDownRefresh()
				uni.hideLoading()
				this.loading = false
            },
            handleView (item) {
				uni.navigateTo({
					url: '/pages/articles/view?id='+ item.id
				})
            },
			handleBannerClick (item) {
                item = Object.assign({}, item)
                item.link = item.link.replace('article', 'articles')
				item.link.includes('http') && uni.navigateTo({
					url: '/pages/webview?url='+ item.link
				})
				!item.link.includes('http') &&
				uni.navigateTo({
					url: '/pages' + item.link
				})
				// this.$router.push('/pages/webview?url='+ item.link)
			},
			textMove () {
				// let oCon = this.$refs.textMove.$el
				var query = wx.createSelectorQuery();
				let oCon = query.select('.textMove')
				if(oCon !== null) {
				    let _move = null
					let seep = -2
				    _move = setInterval(() => {
						this.autoRoll(oCon, seep)
					}, 80)
				    // clearInterval(_move)
				    if (oCon.innerText && oCon.innerText.length <= 22) {
				        clearInterval(_move)
				    } else {
				        // oCon.innerText += oCon.innerText
						this.autoRoll(oCon, seep)
				    }
				}
			},
			autoRoll(oCon, seep) {
			    if (oCon.offsetLeft < -oCon.offsetWidth / 2) {
			        // oCon.style.left = 0
					this.positionStyle.left = 0
			    }
			    if (oCon.offsetLeft > 0) {
			        // oCon.style.left = -oCon.offsetWidth / 2 + 'px'
					this.positionStyle.left = -oCon.offsetWidth / 2 + 'px'
			    }
			    // oCon.style.left = oCon.offsetLeft + seep + 'px'
				this.positionStyle.left = oCon.offsetLeft + seep + 'px'
			},
			onNoticeClick (item) {
				if (item.link) {
					this.handleBannerClick(item)
				}
			}
        }
    }
</script>
