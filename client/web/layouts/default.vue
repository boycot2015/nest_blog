<template>
  <div class="root tc" ref="rootDom" :class="{'night': isNight}">
    <Header :class="{ 'fixed': isHeadFixed, 'unfixed': scrollObj.value > 0 }" @on-night=" (val) => isNight = val"></Header>
    <div class="root-main clearfix" >
        <!-- :style="{paddingTop: isHeadFixed || (scrollObj.value > 0) ? '100px' : '20px'}" -->
        <div class="root-main-container fl" :style="{width: sideWhiteRoute.includes($route.path) ? '1200px':''}">
            <transition name="default" mode="out-in">
                <Nuxt />
            </transition>
        </div>
      <div
      class="right fr"
      v-show="!sideWhiteRoute.includes($route.path)"
      :class="{ 'fixed': isAsideFixed, 'active': isHeadFixed }"
      >
            <div class="clock" v-loading:abs="loading">
                    <h3 class="title">
                        <calendar></calendar>
                    </h3>
                    <time-canvas
                    :width="300"
                    :time="currentTime"
                    :height="70"
                    color="#00a2ff"
                    :x="30"
                    :y="18"
                    ></time-canvas>
            </div>
            <div class="weather">
                <h3 class="title" :title="weather.city + '/' + weather.wea + '/' + weather.win + weather.win_speed">
                    {{ weather.city }}<i class="sperate" v-if="weather.wea">·</i>{{ weather.wea }}/{{ weather.tem }}℃/{{ weather.win }}{{ weather.win_speed }}
                </h3>
                <div class="body" v-if="weather.wea">
                    <span class="air name">{{ weather.air_level }}</span>
                    <i class="icon" :class="`icon-weather-${weather.icon}`"></i>
                    <span class="name">{{ weather.tem1 }}℃/{{ weather.tem2 }}℃</span>
                </div>
                <div
                ref="weatherSwiper"
                class="list weatherSwiper"
                v-if="weathers.length"
                >
                    <div class="swiper-wrapper">
                        <div
                        class="swiper-slide list-item tc"
                        v-for="item in weathers"
                        :key="item.id"
                        >
                            <i class="icon" :class="`icon-weather-${item.icon}`"></i>
                            <p class="weather-text">{{ item.wea }}</p>
                            <p class="name">{{ item.tem1 }}℃/{{ item.tem2 }}℃</p>
                            <p class="week">{{ item.day }}</p>
                        </div>
                    </div>
                </div>
            </div>
          <Aside
          title="标签"
          :data="tagList"
          icon="tag"
          :total="tagTotal"
          :props="{
                key: 'articleNum',
                value: 'value'
            }"
        ></Aside>
          <Aside title="分类" icon="cate" :total="categoryTotal" :data="categoryList"></Aside>
      </div>
    </div>
    <Footer></Footer>
    <div class="top-btn" v-if="isAsideFixed" @click="onScrollToTop">回到顶部<i class="icon-top"></i></div>
  </div>
</template>
<script>
import Header from './header'
import Footer from './footer'
import Aside from './aside'
import config from '@/config'
import { TimeCanvas } from '@/components/TimeCanvas'
import Calendar from '@/components/Calendar/calendar'
export default {
    components: {
        Header,
        Footer,
        Aside,
        TimeCanvas,
        Calendar
    },
    transition: {
        name: 'default',
        mode: 'out-in'
    },
    data () {
        return {
            // categoryList: [],
            // tagList: [],
            swiperOption: {
                // 是一个组件自有属性，如果notNextTick设置为true，组件则不会通过NextTick来实例化swiper，也就意味着你可以在第一时间获取到swiper对象，假如你需要刚加载遍使用获取swiper对象来做什么事，那么这个属性一定要是true
                // notNextTick: true,
                // 循环
                loop: false,
                // 设定初始化时slide的索引
                initialSlide: 1,
                // freeMode: true,
                // 自动播放
                // autoplay: {
                //     delay: 3000,
                //     stopOnLastSlide: false,
                //     disableOnInteraction: false
                // },
                autoplay: false,
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
                slidesPerView: 3,
                slidesPerGroup: 3,
                centeredSlides: false,
                // spaceBetween: -60,
                observer: true, // 修改swiper自己或子元素时，自动初始化swiper
                observeParents: true // 修改swiper的父元素时，自动初始化swiper
            },
            isHeadFixed: false,
            isAsideFixed: false,
            scrollObj: {},
            isNight: false,
            loading: true,
            sideWhiteRoute: config.sideWhiteRoute,
            userAgent: '' // 浏览器信息
        }
    },
    computed: {
        categoryList () {
            return this.$store.state.asideConfig.categoryList
        },
        tagList () {
            return this.$store.state.asideConfig.tagList
        },
        categoryTotal () {
            return this.$store.state.asideConfig.categoryTotal
        },
        tagTotal () {
            return this.$store.state.asideConfig.tagTotal
        },
        weather () {
            // console.log(this.$store.state, 'state')
            let weather = this.$store.state.weather
            return weather
        },
        weathers () { // 一周的天气
            return this.$store.state.weathers
        },
        weatherIcons () { // 天气图标库
            return this.$store.state.weatherIcons
        },
        currentTime () {
            return this.$store.state.currentTime
        }
    },
    watch: {
        isNight (val) {
            val && window.localStorage.setItem('theme', val)
            !val && window.localStorage.removeItem('theme')
            val && (document.documentElement.style.backgroundColor = '#000000')
            !val && (document.documentElement.style.backgroundColor = '#f8f8f8')
        }
    },
    created () {
    },
    mounted () {
        this.scroll((res) => {
            if (res || this.scrollObj.scrollTop === 0) {
                this.isHeadFixed = false
            } else {
                this.isHeadFixed = true
            }
        })
        setTimeout(() => {
            this.loading = false
        }, 300)
        this.$nextTick(() => {
            new window.Swiper('.weatherSwiper', this.swiperOption)
        })
        this.toggleMobile() // 根据浏览器器窗口切换服务
    },
    methods: {
        scroll (fn) {
            let beforeScrollTop = document.scrollingElement.scrollTop
            fn = fn || function () {}
            window.addEventListener('scroll', () => {
                var afterScrollTop = document.scrollingElement.scrollTop
                this.scrollObj.scrollTop = document.scrollingElement.scrollTop
                this.scrollObj.value = afterScrollTop - beforeScrollTop
                if (afterScrollTop >= 80) {
                    this.isAsideFixed = true
                } else {
                    this.isAsideFixed = false
                }
                if (this.scrollObj.value === 0) { return false }
                fn(this.scrollObj.value > 0)
                beforeScrollTop = afterScrollTop
            })
        },
        onScrollToTop () {
            let step = 50
            let timer = setInterval(() => {
                let scrollTop = window.scrollY
                // if (scrollTop < 100) {
                //     step = 5
                // } else
                if (scrollTop > 1500) {
                    step = 800
                } else {
                    step = 50
                }
                if (scrollTop - step < 0) {
                    step = 50
                    window.scrollTo(0, 0)
                    clearInterval(timer)
                }
                window.scrollTo(0, scrollTop - step)
            }, 10)
        },
        toggleMobile () {
            this.userAgent = navigator.userAgent
            window.addEventListener('resize', () => {
                if (this.userAgent !== navigator.userAgent) {
                    window.location.reload(true)
                    this.userAgent = navigator.userAgent
                }
            })
        }
    }
}
</script>
<style>
html {
  /* font-family: "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, "Helvetica Neue", Arial, sans-serif; */
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
}

.button--green {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #3b8070;
  color: #3b8070;
  text-decoration: none;
  padding: 10px 30px;
}

.button--green:hover {
  color: #fff;
  background-color: #3b8070;
}

.button--grey {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #35495e;
  color: #35495e;
  text-decoration: none;
  padding: 10px 30px;
  margin-left: 15px;
}

.button--grey:hover {
  color: #fff;
  background-color: #35495e;
}
</style>
