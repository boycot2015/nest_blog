<template>
  <div class="container">
    <div>
        <time-canvas :width="300" :height="100" :x="30" :y="30" :radius="1"></time-canvas>
        <Logo />
        <h1 class="title" v-loading="loading">blog</h1>
        国庆节倒计时: <span v-countdown="new Date('2020-10-01 00:00:00').getTime()" formatter="HH小时mm分ss秒"></span>
        <canvas id="yellow-man" width="600" height="800"></canvas>
    </div>
  </div>
</template>
<style lang="less" scoped>
    #yellow-man {
        background: @white;
        border: 1px solid @c-ccc;
    }
</style>
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
        this.drawDuolaAmeng()
    },
    methods: {
        drawDuolaAmeng () {
            var canvas = document.getElementById('yellow-man')
            var ctx = canvas.getContext('2d')
            // ctx.clearRect(0, 0, 300, 500)
            ctx.fillStyle = this.color || '#000'
            // 脑袋
            this.drawCircle(ctx, 300, 180, 150, 0, 2, false, 'rgb(80,170,230)')
            this.drawCircle(ctx, 300, 200, 130, 1, 2, false, 'white') // 上脸
            // this.drawCircle(ctx, 300, 250, 150, 1.25, 1.75, false, 'white') // 上脸
            this.drawCircle(ctx, 300, 200, 130, 0, 1, false, 'white') // 下脸
            // this.drawCircle(ctx, 300, 170, 150, 0.25, 0.75, false, 'white') // 下脸
            // this.drawCircle(ctx, 270, 180, 100, 0.75, 1.25, false, 'white')// 左脸
            // this.drawCircle(ctx, 270, 210, 100, 0.75, 1.25, false, 'white')// 左脸
            // this.drawCircle(ctx, 330, 180, 100, 1.75, 0.25, false, 'white')// 右脸
            // this.drawCircle(ctx, 330, 210, 100, 1.75, 0.25, false, 'white')// 右脸

            // 中间
            ctx.beginPath()
            ctx.fillRect(ctx, 198, 140, 204, 140, 'white')
            ctx.closePath()

            // 眼睛
            this.ellipseOne(ctx, 260, 110, 40, 50)
            this.ellipseOne(ctx, 340, 110, 40, 50)

            // 眼珠
            this.drawCircle(ctx, 270, 130, 15, 0, 2, false, 'black')
            this.drawCircle(ctx, 330, 130, 15, 0, 2, false, 'black')
            // 鼻子
            this.drawCircle(ctx, 300, 165, 22, 0, 2, false, 'red')
            // 竖线
            this.beard(ctx, 300, 190, 300, 280)
            // 左胡子
            this.beard(ctx, 200, 160, 270, 180)// 1
            // this.beard(ctx, 200, 210, 270, 210)// 2
            this.beard(ctx, 200, 240, 270, 220)// 3
            // 右胡子
            this.beard(ctx, 328, 180, 398, 160)// 1
            // this.beard(ctx, 328, 210, 398, 210)// 2
            this.beard(ctx, 328, 220, 398, 240)// 3

            // 嘴巴
            ctx.beginPath()
            ctx.arc(300, 145, 150, 0.25 * Math.PI, 0.75 * Math.PI, false)
            ctx.stroke()
            ctx.closePath()
            // 切棱角
            this.drawCircle(ctx, 195, 320, 18, 0.7, 1.3, false, 'red')
            this.drawCircle(ctx, 405, 320, 18, 1.7, 0.3, false, 'red')
            // 脖子
            ctx.beginPath()
            ctx.fillRect(184, 305, 233, 30)
            ctx.closePath()

            // 身子
            ctx.beginPath()
            ctx.fillStyle = 'rgb(80,170,230)'
            ctx.fillRect(190, 335, 222, 180)
            ctx.closePath()
            // 胳膊
            this.arm(ctx, 190, 335, 140, 395, 175, 425, 190, 405, 'rgb(80,170,230)')
            this.arm(ctx, 190, 405, 190, 514, 285, 514, 285, 514, 'rgb(80,170,230)')
            this.arm(ctx, 316, 514, 412, 514, 412, 405, 412, 405, 'rgb(80,170,230)')
            this.drawCircle(ctx, 145, 420, 30, 0, 2, false, 'white')
            // 右
            this.arm(ctx, 412, 335, 462, 395, 427, 425, 412, 405, 'rgb(80,170,230)')
            this.drawCircle(ctx, 457, 420, 30, 0, 2, false, 'white')
            // 衣服
            this.drawCircle(ctx, 300, 391, 80, 1.25, 1.75, true, 'white')
            this.drawCircle(ctx, 300, 391, 60, 0, 1, false, 'white')
            // 铃铛
            this.drawCircle(ctx, 300, 345, 25, 0, 2, true, 'yellow')
            this.drawCircle(ctx, 300, 350, 8, 0, 2, true, 'black')// 黑点
            this.beard(ctx, 300, 350, 300, 370)// 竖线
            this.beard(ctx, 283, 327, 318, 327)// 纹路
            this.beard(ctx, 275, 338, 325, 338)
            // 门
            this.drawCircle(ctx, 300, 511, 16, 0.1, 0.9, true, 'white')
            // 脚
            ctx.beginPath()

            ctx.lineTo(165, 515)
            ctx.lineTo(287, 515)
            ctx.arc(284, 530, 15, 1.5 * Math.PI, 0.5 * Math.PI, false)
            ctx.lineTo(287, 545)
            ctx.lineTo(165, 545)
            ctx.arc(165, 530, 15, 0.5 * Math.PI, 1.5 * Math.PI, false)
            ctx.lineTo(165, 515)
            ctx.closePath()
            ctx.fillStyle = 'white'
            ctx.fill()
            ctx.stroke()

            ctx.beginPath()
            ctx.lineTo(317, 515)
            ctx.lineTo(436, 515)
            ctx.arc(436, 530, 15, 1.5 * Math.PI, 0.5 * Math.PI, false)
            ctx.lineTo(436, 545)
            ctx.lineTo(317, 545)
            ctx.arc(317, 530, 15, 0.5 * Math.PI, 1.5 * Math.PI, false)
            // ctx.lineTo(317, 515)
            // ctx.closePath()
            ctx.fillStyle = 'white'
            ctx.fill()
            ctx.stroke()

            // ctx.beginPath()
            // this.drawCircle(ctx, 317, 531, 15, 0.5, 1.5, false, 'white')
            // this.drawCircle(ctx, 436, 531, 15, 1.5, 0.5, false, 'white')
            // ctx.beginPath()
            // ctx.fillStyle = 'white'
            // ctx.fillRect(316, 516, 121, 30)
            // ctx.closePath()
        //
        },
        // 斜线
        arm (ctx, a, b, c, d, e, f, g, h, color) {
            ctx.beginPath()
            ctx.lineTo(a, b)
            ctx.lineTo(c, d)
            ctx.lineTo(e, f)
            ctx.lineTo(g, h)
            ctx.stroke()
            ctx.fillStyle = color
            ctx.fill()
            ctx.closePath()
        },

        // 线 两点
        beard (ctx, sx, sy, ex, ey) {
            ctx.beginPath()
            ctx.lineTo(sx, sy)
            ctx.lineTo(ex, ey)
            ctx.stroke()
            ctx.closePath()
        },
        // 画圆
        drawCircle (ctx, center1, center2, radius, start, end, bol, color) {
            ctx.beginPath()
            ctx.arc(center1, center2, radius, start * Math.PI, end * Math.PI, bol)
            ctx.fillStyle = color
            ctx.fill()
            ctx.closePath()
            ctx.stroke()
        },

        // 椭圆
        ellipseOne (ctx, x, y, a, b) { // (圆心，圆心，宽，高)
            var step = (a > b) ? 1 / a : 1 / b
            ctx.beginPath()
            ctx.moveTo(x + a, y)
            for (var i = 0; i < 2 * Math.PI; i += step) {
                ctx.lineTo(x + a * Math.cos(i), y + b * Math.sin(i))
            }
            ctx.closePath()
            ctx.fill()
            ctx.stroke()
        }
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
