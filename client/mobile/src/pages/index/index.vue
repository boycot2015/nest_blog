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
				<text ref="textMove" class="text">{{homeData.notice.title}}</text>
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
		height: 300upx;
		uni-image {
			width: 100%;
			height: 300upx;
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
                    newLeast: []
                },
				getCommentNum,
				indicatorDots: true,
				autoplay: true,
				interval: 2000,
				duration: 500,
				showNotice: true,
				loading: true
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
        methods: {
            async initData() {
                let [configRes, listRes] = await Promise.all([await this.$api.setting.get(), await this.$api.home.datas()])
                let homeData = {
                    banner: [],
                    notice: {},
                    siteConfig: {},
                    theme: {},
                    id: ''
                }
                if (configRes && configRes.success) {
                    if (configRes.data && configRes.data[0].length) {
                        homeData.banner = configRes.data[0][0].banner !== null ? JSON.parse(configRes.data[0][0].banner) : []
                        homeData.notice = configRes.data[0][0].notice !== null ? JSON.parse(configRes.data[0][0].notice) : {}
                        homeData.siteConfig = configRes.data[0][0].siteConfig !== null ? JSON.parse(configRes.data[0][0].siteConfig) : {}
                        homeData.theme = configRes.data[0][0].theme !== null ? JSON.parse(configRes.data[0][0].theme) : {}
                        homeData.id = configRes.data[0][0].id
                    }
                    // console.log(homeData, listRes.data, 'homeData.banner')
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
					url: '/pages/article/view?id='+ item.id
				})
            },
			handleBannerClick (item) {
				console.log(item.link.includes('http'), 'e.url')
				item.link.includes('http') && uni.navigateTo({
					url: '/pages/webview?url='+ item.link
				})
				!item.link.includes('http') &&
				uni.navigateTo({
					url: item.link
				})
				this.$router.push('/pages/webview?url='+ item.link)
			},
			textMove () {
				let oCon = this.$refs.textMove.$el
				if(oCon !== null) {
				    let _move = null
					let seep = -2
				    _move = setInterval(() => {
						this.autoRoll(oCon, seep)
					}, 80)
				    // clearInterval(_move)
				    if (oCon.innerText.length <= 22) {
				        clearInterval(_move)
				    } else {
				        oCon.innerText += oCon.innerText
						this.autoRoll(oCon, seep)
				    }
				}
			},
			autoRoll(oCon, seep) {
			    if (oCon.offsetLeft < -oCon.offsetWidth / 2) {
			        oCon.style.left = 0
			    }
			    if (oCon.offsetLeft > 0) {
			        oCon.style.left = -oCon.offsetWidth / 2 + 'px'
			    }
			    oCon.style.left = oCon.offsetLeft + seep + 'px'
			},
			onNoticeClick (item) {
				if (item.link) {
					this.handleBannerClick(item)
				}
			}
        }
    }
</script>
