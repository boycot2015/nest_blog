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
            <div class="clock">
                <h3 class="title">北京时间</h3>
                    <time-canvas :width="300" :height="100" color="#00a2ff" :x="30" :y="30"></time-canvas>
            </div>
            <div class="weather">
                <h3 class="title">天气 · {{ weather.citynm }}</h3>
                <div class="body">
                    <i class="icon" :class="`icon-weather-${weather.icon}`"></i>
                    <span class="name">{{ weather.weather }} | {{ weather.temperature }}</span>
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
export default {
    components: {
        Header,
        Footer,
        Aside,
        TimeCanvas
    },
    transition: {
        name: 'default',
        mode: 'out-in'
    },
    data () {
        return {
            // categoryList: [],
            // tagList: [],
            isHeadFixed: false,
            isAsideFixed: false,
            scrollObj: {},
            isNight: false,
            weather: {}, // 天气
            weathers: [], // 一周的天气
            weatherIcons: config.weatherIcons,
            sideWhiteRoute: config.sideWhiteRoute
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
        this.getWeather()
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
        getWeather () {
            // ?app=weather.future&weaid=1&&appkey=10003&sign=b59bc3ef6191eb9f747dd4e83c99f2a4&format=json
            let _this = this
            config.getUserIP((ip) => {
                _this.$api.setting.weather({
                    app: 'weather.future',
                    weaid: ip || 1,
                    appkey: 10003,
                    sign: 'b59bc3ef6191eb9f747dd4e83c99f2a4',
                    format: 'json'
                }).then(res => {
                    if (res && res.success === '1') {
                        _this.weather = res.result[0]
                        _this.weathers = res.result
                        _this.weatherIcons.map(el => {
                            if (_this.weather.weather.includes(el.name)) {
                                _this.weather.icon = el.value
                            }
                        })
                        console.log(_this.weather, 'weather')
                    }
                })
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
