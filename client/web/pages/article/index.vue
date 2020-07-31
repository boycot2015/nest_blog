<template>
    <div class="article-main">
        <div class="article-list">
            <div
            v-for="item in list"
            :key="item.id"
            class="article-list-item"
            >
            <div class="flexbox-h just-b" @click="onReview(item)">
                <div class="flex2 wrap">
                    <div class="img" :style="{backgroundImage:`url('${item.img || getImgUrl(item.content)}')`}"></div>
                </div>
                <div class="text flex3 tl">
                    <div class="title line-clamp2">{{ item.title }}</div>
                    <div
                    :style="{maxHeight: item.content.length > 120 && item.title.length < 30 ? '88px':'' }"
                    :class="{'line-clamp4': item.content.length > 120 && item.title.length < 30 }"
                    class="desc line-clamp3"
                    v-html="item.content"
                    >
                    </div>
                    <div class="time">
                        {{ item.comment | getCommentNum }}条评论 - {{ new Date(item.createTime).getTime() | timeFilter }}
                        <span class="source" v-if="item.source"> · 来源：{{ item.source }}</span>
                    </div>
                </div>
                <!-- <nuxt-link :to="'/article/view?id='+item.id" class="flexbox-h just-b" >
                </nuxt-link> -->
            </div>
            </div>
        </div>
        <loading-more v-if="loadingMore" :loading="loadingMore" :show-img="showImg" :has-more="hasMore" :text="loadingMoreText"></loading-more>
    </div>
</template>

<script>
import { LoadingMore } from '@/components/LoadingMore'
import { getImgUrl } from '@/utils'
export default {
    name: 'articleIndex',
    head () {
        return {
            title: this.title || '博客列表',
            meta: [
                { charset: 'utf-8' },
                { name: 'viewport', content: 'width=device-width, initial-scale=1' },
                { hid: '博客详情', name: 'articleView', content: '博客详情' }
            ]
        }
    },
    async asyncData ({ app, params, query, route }) {
        let pages = {
            current: 1,
            pageSize: 4
        }
        // console.log(params, route, 'params')
        let res = await app.$api.article.get({ ...query, ...params, ...pages })
        if (res && res.success) {
            return {
                list: res.data[0],
                total: res.data[1],
                loadingMoreText: res.data[0].length ? '努力加载中...' : '没有更多数据了~',
                loadingMore: !res.data[0].length,
                hasMore: res.data[0].length,
                showImg: !res.data[0].length,
                ...pages
            }
        }
    },
    components: {
        LoadingMore
    },
    watchQuery: true,
    // ['category', 'tag']
    data () {
        return {
            loadingMore: false,
            loadingMoreText: '努力加载中...',
            hasMore: true,
            canQuery: true, // 滚动判断是否可以加载数据
            list: [],
            total: 0,
            pages: {
                current: 1,
                pageSize: 4
            },
            showImg: false,
            getImgUrl
        }
    },
    mounted () {
        // 添加滚动事件，检测滚动到页面底部
        window.addEventListener('scroll', this.scrollBottom)
    },
    methods: {
        scrollBottom (e) {
        // 滚动到页面底部时，请求前一天的文章内容
            let scrollTop = e.target.scrollingElement.scrollTop
            if (((window.screen.height + scrollTop - 50) > (document.body.clientHeight)) && this.canQuery) {
                this.pages.current++
                this.loadingMore = true
                this.getMoreData({})
            }
        },
        async getMoreData ({ noMore }) {
            this.canQuery = false
            let res = await this.$api.article.get({ ...this.$route.query, ...this.pages })
            if (res && res.success) {
                this.list = this.list.concat(res.data[0])
                this.total = res.data[1]
                if (this.total > this.pages.current * this.pages.pageSize) {
                    this.loadingMore = false
                    this.canQuery = true
                    this.hasMore = true
                    this.loadingMoreText = '努力加载中...'
                } else {
                    this.loadingMoreText = '我是有底线的'
                    this.hasMore = false
                    this.canQuery = false
                    !noMore && (this.loadingMore = true)
                }
            }
        },
        onReview (item) {
            if (item.url) {
                window.open(item.url)
            } else {
                this.$router.push({
                    path: '/article/view',
                    query: {
                        id: item.id
                    }
                })
            }
        }
    }
}
</script>

<style>

</style>
