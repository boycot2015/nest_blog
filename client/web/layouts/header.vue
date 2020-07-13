<template>
  <div class="site-header">
      <div class="site-header-content w1200 flexbox-h align-c just-b">
        <div class="logo fl"><nuxt-link to="/"><img src="@/assets/img/logo.png" alt=""></nuxt-link></div>
        <div class="title flex1 tl fl">
            <nuxt-link to="/" :class="{'active': $route.path === '/'}">首页</nuxt-link>
            <nuxt-link to="/article/classes" :class="{'active': $route.path === '/article/classes'}">时间轴</nuxt-link>
            <nuxt-link to="/about" :class="{'active': $route.path === '/about'}">关于</nuxt-link>
        </div>
        <div class="notice flexbox-h align-c" v-if="websiteConfig && websiteConfig.notice">
            <i class="icon-notice"></i>
            <nuxt-link class="notice-content tl flex1" :to="websiteConfig.notice.link"><div class="name" ref="textMove">{{ websiteConfig.notice.title }}</div></nuxt-link>
        </div>
        <div class="setting tr flexbox-h align-c just-s">
            <span>夜间模式</span>
            <div class="spanner" :class="{'active': isNight}" @click="onNightClick"></div>
        </div>
        <!-- <div class="userinfo flexbox-h align-c tr">
          <div class="avatar">
            <img src="@/assets/img/logo.png" alt="">
          </div>
          <div class="username">boycot</div>
        </div> -->
      </div>
  </div>
</template>

<script>
export default {
    data () {
        return {
            isNight: false,
            menu: [{

            }]
        }
    },
    mounted () {
        this.init()
    },
    computed: {
        websiteConfig () {
            return this.$store.state.websiteConfig
        }
    },
    methods: {
        init () {
            if (window.localStorage.getItem('theme')) {
                this.isNight = true
            } else {
                this.isNight = false
            }
            this.$emit('on-night', this.isNight)
            this.textMove()
        },
        onNightClick () {
            this.$emit('on-night', this.isNight = !this.isNight)
            this.isNight && window.localStorage.setItem('theme', this.isNight)
        },
        textMove () {
            let oCon = this.$refs.textMove
            if (oCon !== null) {
                let _move = null
                let step = -2
                _move = setInterval(() => {
                    this.autoRoll(oCon, step)
                }, 1000)
                if (oCon.textContent.length <= 12) {
                    clearInterval(_move)
                } else {
                    oCon.textContent += oCon.textContent
                    this.autoRoll(oCon, step)
                }
            }
        },
        autoRoll (oCon, step) {
            if (oCon.offsetLeft < -oCon.offsetWidth * 2) {
                oCon.style.left = 0
            }
            if (oCon.offsetLeft > 0) {
                oCon.style.left = -oCon.offsetWidth / 2 + 'px'
            }
            oCon.style.left = oCon.offsetLeft + step + 'px'
            console.log(oCon.offsetLeft, step)
        }
    }
}
</script>

<style>

</style>
