<template>
  <canvas id="timer-clock" :width="width" :height="height"></canvas>
</template>

<script>
import digit from './digit'
export default {
    props: {
        radius: {
            type: [Number, String],
            default: 1
        }, // 圆的半径
        color: {
            type: String,
            default: 'rgb(0, 102, 153)'
        },
        width: {
            type: [Number, String],
            default: 300
        }, // canvas宽度
        height: {
            type: [Number, String],
            default: 100
        }, // canvas高度
        x: {
            type: [Number, String],
            default: 30
        }, //  离 canvas 原点的坐标值 x
        y: {
            type: [Number, String],
            default: 30
        } //  离 canvas 原点的坐标值 y
    },
    data () {
        return {
            RADIUS: this.radius, // 圆的半径
            MarginX: this.x, //  离 canvas 原点的坐标值 x
            MarginY: this.y //  离 canvas 原点的坐标值 y
        }
    },
    mounted () {
        // 电子时钟
        this.$nextTick(function () {
            var canvas = document.getElementById('timer-clock')
            var ctx = canvas.getContext('2d')
            setInterval(() => {
                this.draw(ctx)
            }, 500)
        })
    },
    methods: {
        draw (ctx) {
            ctx.clearRect(0, 0, this.width, this.height)
            var curDate = new Date()
            var hour = curDate.getHours()
            var minute = curDate.getMinutes()
            var seconds = curDate.getSeconds()
            this.drawNum(this.MarginX, this.MarginY, parseInt(hour / 10), ctx, 'red')
            this.drawNum(this.MarginX + (this.RADIUS + 1) * 15, this.MarginY, parseInt(hour % 10), ctx, 'red')
            this.drawNum(this.MarginX + (this.RADIUS + 1) * 32, this.MarginY, 10, ctx, 'blue')
            this.drawNum(this.MarginX + (this.RADIUS + 1) * 45, this.MarginY, parseInt(minute / 10), ctx, 'green')
            this.drawNum(this.MarginX + (this.RADIUS + 1) * 60, this.MarginY, parseInt(minute % 10), ctx, 'green')
            this.drawNum(this.MarginX + (this.RADIUS + 1) * 78, this.MarginY, 10, ctx, 'blue')
            this.drawNum(this.MarginX + (this.RADIUS + 1) * 90, this.MarginY, parseInt(seconds / 10), ctx, 'black')
            this.drawNum(this.MarginX + (this.RADIUS + 1) * 105, this.MarginY, parseInt(seconds % 10), ctx, 'black')
        },

        drawNum (x, y, num, ctx, color) {
            for (var i = 0; i < digit[num].length; i++) {
                for (var j = 0; j < digit[num][i].length; j++) {
                    if (digit[num][i][j] === 1) {
                        ctx.beginPath()
                        ctx.fillStyle = color || this.color
                        ctx.arc(x + (this.RADIUS + 1) * 1.5 * j + (this.RADIUS + 1), y + (this.RADIUS + 1) * 1.5 * i + (this.RADIUS + 1), this.RADIUS, 0, Math.PI * 2)
                        ctx.fill()
                        ctx.closePath()
                    }
                }
            }
        }
    }
}
</script>

<style lang="less">
    #timer-clock {
        margin: 0;
        background: @c-e8;
        box-shadow: 0 0 10px @c-666 inset;
    }
</style>
