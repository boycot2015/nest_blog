<template>
  <div class="site-header">
      <div class="site-header-content w1200 flexbox-h align-c just-b">
        <div class="logo fl"><nuxt-link to="/"><img src="@/assets/img/logo.png" alt=""></nuxt-link></div>
        <div class="title flex1 tl fl">
            <nuxt-link to="/" :class="{'active': $route.path === '/'}">首页</nuxt-link>
            <nuxt-link to="/time" :class="{'active': $route.path === '/time'}">时间轴</nuxt-link>
            <nuxt-link to="/about" :class="{'active': $route.path === '/about'}">关于</nuxt-link>
        </div>
        <div class="notice" v-if="websiteConfig && websiteConfig.notice">
            <nuxt-link :to="websiteConfig.notice.link"><i class="icon-notice"></i><span class="name">{{ websiteConfig.notice.title }}</span></nuxt-link>
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
            isNight: false
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
        },
        onNightClick () {
            this.$emit('on-night', this.isNight = !this.isNight)
            this.isNight && window.localStorage.setItem('theme', this.isNight)
        }
    }
}
</script>

<style>

</style>
