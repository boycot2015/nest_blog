<template>
    <div class="home-container">
        <!-- v-swiper:mySwiper="swiperOption" -->
        <div
        ref="mySwiper"
        class="banner mySwiper"
        v-if="banner.length"
        >
            <div class="swiper-wrapper">
                <div
                class="swiper-slide"
                v-for="item in banner"
                :key="item.id"
                >
                <nuxt-link
                :to="item.link"
                v-if="item.link && !item.link.includes('http://')"
                >
                    <div
                    class="img"
                    :title="item.title"
                    :style="{
                        backgroundImage: `url('${item.url}')`
                    }"
                    ><img :src="item.url" :title="item.title" alt=""></div>
                </nuxt-link>
                <a
                :href="item.link"
                v-else
                target="_blank"
                >
                    <div
                    class="img"
                    :title="item.title"
                    :style="{
                        backgroundImage: `url('${item.url}')`
                    }"
                    ><img :src="item.url" :title="item.title" alt=""></div>
                </a></div>
            </div>
            <div class="swiper-pagination"></div>
        </div>
        <!-- {{ $store.state.websiteConfig.newLeast }} -->
        <div class="article-list">
            <div
            v-for="item in newLeast"
            :key="item.id"
            class="article-list-item"
            >
                <nuxt-link :to="'/article/view?id='+item.id" class="flexbox-h just-b">
                    <div class="flex2 wrap"><div class="img" :style="{backgroundImage:`url('${getImgUrl(item.content)}')`}"></div></div>
                    <div class="text flex3 tl">
                        <div class="title line-clamp2">{{ item.title }}</div>
                        <div
                        :style="{maxHeight: item.content.length > 120 && item.title.length < 30 ? '88px':'' }"
                        :class="{'line-clamp4': item.content.length > 120 && item.title.length < 30 }"
                        class="desc line-clamp3"
                        v-html="item.content"
                        >
                        </div>
                        <div class="time">{{ item.comment | getCommentNum }}条评论 - {{ new Date(item.createTime).getTime() | timeFilter }}</div>
                    </div>
                </nuxt-link>
            </div>
        </div>
    </div>
</template>

<script>
import { getImgUrl } from '@/utils'
// import 'swiper/swiper-bundle.css'
// Swiper, SwiperSlide,
// import { Swiper, directive } from 'vue-awesome-swiper'
export default {
    name: 'home',
    head () {
        return {
            title: this.title || '博客首页',
            meta: [
                { charset: 'utf-8' },
                { name: 'viewport', content: 'width=device-width, initial-scale=1' },
                { hid: '博客首页', name: 'home', content: '首页展示最新动态,标签以及分类查询' }
            ]
        }
    },
    data () {
        return {
            swiperOption: {
                // 是一个组件自有属性，如果notNextTick设置为true，组件则不会通过NextTick来实例化swiper，也就意味着你可以在第一时间获取到swiper对象，假如你需要刚加载遍使用获取swiper对象来做什么事，那么这个属性一定要是true
                // notNextTick: true,
                // 循环
                loop: true,
                // 设定初始化时slide的索引
                initialSlide: 0,
                // freeMode: true,
                // 自动播放
                // autoplay: {
                //     delay: 3000,
                //     stopOnLastSlide: false,
                //     disableOnInteraction: false
                // },
                autoplay: 4000,
                paginationClickable: true,
                autoplayDisableOnInteraction: false,
                // 滑动速度
                // speed: 1000,
                // 滑动方向
                direction: 'horizontal',
                // 小手掌抓取滑动
                grabCursor: true,
                // 分页器设置
                pagination: '.swiper-pagination',
                slidesPerView: 2,
                centeredSlides: true,
                spaceBetween: -60,
                observer: true, // 修改swiper自己或子元素时，自动初始化swiper
                observeParents: true // 修改swiper的父元素时，自动初始化swiper
            },
            banner: '',
            newLeast: [],
            loadingMore: false
        }
    },
    // components: {
    //     Swiper,
    //     SwiperSlide
    // },
    // directives: {
    //     swiper: directive
    // },
    computed: {
        // swiper () {
        //     return this.$refs.mySwiper.$swiper
        // },
        getImgUrl () {
            return getImgUrl
        }
    },
    asyncData ({ app, store }) {
        let websiteConfig = store.state.websiteConfig
        return {
            ...websiteConfig
        }
    },
    created () {
    },
    mounted () {
        this.$nextTick(() => {
            new window.Swiper('.mySwiper', this.swiperOption)
        })
    }
}
</script>

<style scoped>
</style>
