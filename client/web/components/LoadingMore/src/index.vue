<template>
  <div class="loading-more" :class="{'bgc img': showImg}">
        <img v-if="showImg" src="@/assets/img/img-null.png" alt="">
        <p class="loading-more-text" :class="{'no-more': !hasMore}"><span>{{ text }}</span></p>
  </div>
</template>
<style lang="less" scoped>
.loading-more-text {
    // width: 102px;
    font-size: 16px;
    color: @primary;
    &::before {
        font-family: iconfont;
        content: '\e62f';
        color: @primary;
        display: inline-block;
        font-size: 20px;
        margin-right: 10px;
        animation: rotate 1s infinite;
        @keyframes rotate {
            12.5% {
                transform: rotateZ(45deg);
            }
            25% {
                transform: rotateZ(90deg);
            }
            37.5% {
                transform: rotateZ(135deg);
            }
            50% {
                transform: rotateZ(180deg);
            }
            62.5% {
                transform: rotateZ(225deg);
            }
            75% {
                transform: rotateZ(270deg);
            }
            87.5% {
                transform: rotateZ(315deg);
            }
            100% {
                transform: rotateZ(360deg);
            }
        }
    }
    &.no-more&::before {
        display: none;
    }
}
.loading-more {
    margin-top: 20px;
    &.img {
        padding: 200px 0;
        margin-top: 0;
    }
    &.bgc {
        background-color: @white;
    }
}
</style>
<script>
export default {
    name: 'LoadingMore',
    props: {
        text: {
            type: String,
            default: '努力加载中...'
        },
        loading: {
            type: Boolean,
            default: false
        },
        hasMore: {
            type: [Boolean, Number],
            default: true
        },
        showImg: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            showLoading: true
        }
    },
    watch: {
        hasMore (val) {
            !val && (this.showLoading = false)
        }
    }
}
</script>

<style>

</style>
