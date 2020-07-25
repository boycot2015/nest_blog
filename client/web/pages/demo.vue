<template>
  <div class="container">
    <div>
        <time-canvas :width="300" :height="100" :x="30" :y="30" :radius="1"></time-canvas>
        <Logo />
        <h1 class="title" v-loading="loading">blog</h1>
        国庆节倒计时: <span v-countdown="new Date('2020-10-01 00:00:00').getTime()" formatter="HH小时mm分ss秒"></span>
    </div>
  </div>
</template>

<script>
import { TimeCanvas } from '@/components/TimeCanvas'
export default {
    components: {
        TimeCanvas
    },
    layout: 'error-layout',
    data () {
        return {
            loading: true
        }
    },
    asyncData ({ isDev, route, store, env, params, query, req, res, redirect, error }) {
        // let loading = true
        // return {
        //     loading: false
        // }
    },
    mounted () {
        // setTimeout(() => {
        //     this.loading = false
        // }, 5000)
    }
}
</script>

<style>
/* Sample `apply` at-rules with Tailwind CSS
.container {
@apply min-h-screen flex justify-center items-center text-center mx-auto;
}
*/
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: "Quicksand", "Source Sans Pro", -apple-system, BlinkMacSystemFont,
    "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
