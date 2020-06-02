<template>
    <view class="content">
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
					<image :src="item.url" mode=""></image>
				</view>
			</swiper-item>
		</swiper>
        <u-card
        :title="'最新发布'"
        :sub-title="item.updateTime | timeFilter"
        v-for="item in [homeData.newLeast[0]]"
        :key="item.id"
        :thumb="item.thumb">
            <view class="u-text-left" slot="body">
                <view
                    v-for="val in homeData.newLeast"
                    :key="val.id"
                    @click="handleView(val)"
                    class="u-body-item u-flex u-border-bottom u-col-between u-p-t-0"
                >
                    <view class="u-body-item-title u-flex-1 u-text-left u-line-2" v-html="val.title"></view>
                    <image src="https://img11.360buyimg.com/n7/jfs/t1/94448/29/2734/524808/5dd4cc16E990dfb6b/59c256f85a8c3757.jpg" mode="aspectFill" />
                </view>
            </view>
            <view class="" slot="foot"><u-icon name="chat-fill" size="34" color="" :label="item.comment.length + '评论'"></u-icon></view>
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
    .u-card-wrap {
        background-color: $u-bg-color;
        padding: 1px;
    }

    .u-body-item {
        font-size: 32rpx;
        color: #333;
        padding: 20rpx 10rpx;
    }
        
    .u-body-item image {
        width: 120rpx;
        flex: 0 0 120rpx;
        height: 120rpx;
        border-radius: 8rpx;
        margin-left: 12rpx;
    }
</style>
<script>
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
				indicatorDots: true,
				autoplay: true,
				interval: 2000,
				duration: 500
            }
        },
        onLoad() {
            this.initData()
        },
        methods: {
            async initData() {
                let [bannerRes, homeRes] = await Promise.all([await this.$api.setting.get(), await this.$api.home.datas()])
                let bannerData = {
                    banner: [],
                    notice: {},
                    siteConfig: {},
                    theme: {},
                    id: ''
                }
                if (bannerRes && bannerRes.success) {
                    if (bannerRes.data && bannerRes.data[0].length) {
                        bannerData.banner = bannerRes.data[0][0].banner !== null ? JSON.parse(bannerRes.data[0][0].banner) : []
                        bannerData.notice = bannerRes.data[0][0].notice !== null ? JSON.parse(bannerRes.data[0][0].notice) : {}
                        bannerData.siteConfig = bannerRes.data[0][0].siteConfig !== null ? JSON.parse(bannerRes.data[0][0].siteConfig) : {}
                        bannerData.theme = bannerRes.data[0][0].theme !== null ? JSON.parse(bannerRes.data[0][0].theme) : {}
                        bannerData.id = bannerRes.data[0][0].id
                    }
                    // console.log(bannerData.banner, homeRes.data, 'bannerData.banner')
                    this.bannerlist = bannerData.banner
                }
                if (homeRes && homeRes.success) {
                    this.homeData = homeRes.data
                } else {
                    homeRes && this.$message.error(homeRes.message)
                }
            },
            handleSwipperClick (index) {
                console.log(index, 'index')
                let path = this.bannerlist[index].link
                path.includes('http') && window.open(path)
                !path.includes('http') && this.$router.push(path)
            },
            handleView (item) {
                this.$router.push('/pages/article/view?id='+ item.id)
            },
			handleBannerClick (item) {
				window.location.href = item.link
			}
        }
    }
</script>

<style>
    .content {
        text-align: center;
        height: 400upx;
    }

    .logo {
        height: 200upx;
        width: 200upx;
        margin-top: 200upx;
    }

    .title {
        font-size: 36upx;
        color: #8f8f94;
    }
</style>
