<template>
    <div class="about pd20 bgf">
        <div class="title flexbox-h align-c just-c">
            <h3>关于我</h3>
        </div>
        <div class="bg">
            <img src="@/assets/img/about.jpg" alt="" title="程序猿">
        </div>
        <div class="content tl">
            <div class="content-section">
                <p class="desc">{{ websiteConfig.description }}</p>
                <ul class="list">
                    <li class="list-item flexbox-h just-s" v-for="item in websiteConfig.list" :key="item.name">
                        <span class="name tr" v-if="item.name">{{ item.name }}:</span>
                        <span class="value flex4">{{ item.value }}</span>
                        <!-- {{ item.name }}: {{ item.value }} -->
                    </li>
                </ul>
            </div>
        </div>
        <div class="my-links ">
            <h3 class="title tl">我的作品</h3>
            <div class="list flexbox-h align-c just-s">
                <div
                class="list-item flex-1"
                v-for="item in websiteConfig.links"
                :key="item.name"
                >
                    <a class="list-item-link" :target="item.targetType" :href="item.url">
                        <div class="img" :style="{background: `url(${item.imgUrl}) center/cover no-repeat`}">
                            <img :src="item.imgUrl" alt="">
                        </div>
                        <p class="name tc">{{ item.name }}</p>
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    head () {
        return {
            title: this.title,
            meta: [
                { charset: 'utf-8' },
                { name: 'viewport', content: 'width=device-width, initial-scale=1' },
                { hid: '关于我', name: 'aboutme', content: 'aboutme' }
            ]
        }
    },
    data () {
        return {
            aboutData: {
                technology: {
                    name: '',
                    value: ''
                }
            },
            title: '关于我'
        }
    },
    computed: {
        websiteConfig () {
            return {
                ...this.$store.state.websiteConfig.siteConfig,
                ...this.$store.state.aboutData
            }
        }
    }
}
</script>

<style lang='less' scoped>
.my-links {
    padding-top: 15px;
    margin-top: 20px;
    border-top: 1px dashed @c-ccc;
    .title {
        font-size: 20px;
        font-weight: 400;
        line-height: 20px;
        height: auto;
        padding-left: 15px;
        position: relative;
        &::before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            width: 4px;
            height: 100%;
            border-radius: 4px;
            background: @primary;
        }
    }
    .list {
        display: inline-grid;
        grid-template-columns: auto auto auto auto;
        grid-template-rows: auto auto auto auto;
        grid-gap: 20px;
        &-item {
            font-size: 16px;
            cursor: pointer;
            border: 1px solid @c-e8;
            border-radius: 5px;
            overflow: hidden;
            transition: all 0.5s;
            background: @white;
            &:nth-child(4n) {
                margin-right: 0;
            }
            &:hover {
                z-index: 10000;
                transform: translateY(-10px);
                box-shadow: 0px 10px 10px @c-e8;
            }
            &-link:hover {
                color: @primary;
            }
            .img {
                width: 100%;
                height: 150px;
                img {
                    height: 100%;
                    opacity: 0;
                }
            }
            .name {
                border-top: 1px solid @c-e8;
                padding: 10px 0;
            }
        }
    }
}
</style>
