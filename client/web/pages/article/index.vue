<template>
    <div class="article-main">
        <div class="article-list">
            <div
            v-for="item in list"
            :key="item.id"
            class="article-list-item"
            >
                <nuxt-link :to="'/article/view?id='+item.id" class="flexbox-h just-b">
                    <div class="flex2 wrap"><div class="img" :style="{backgroundImage:`url('${getImgUrl(item.content)}')`}"></div></div>
                    <div class="text flex3 tl">
                        <div class="title line-clamp2">{{ item.title }}</div>
                        <div
                        :style="{maxHeight: item.content.length > 120 && item.title.length < 30 ? '88px':'' }"
                        :class="{'line-clamp4': item.content.length > 120 && item.title.length < 30 }"
                        class="desc line-clamp3"
                        v-html="item.content"
                        >
                        </div>
                        <div class="time">{{ item.comment | getCommentNum }}条评论 - {{ new Date(item.createTime).getTime() | timeFilter }}</div>
                    </div>
                </nuxt-link>
            </div>
        </div>
        <loading-more v-if="loadingMore" :loading="loadingMore" :text="loadingMoreText"></loading-more>
    </div>
</template>

<script>
import { LoadingMore } from '@/components/LoadingMore'
import { getImgUrl } from '@/utils'
export default {
    name: 'articleIndex',
    async asyncData ({ app, params, query }) {
        let pages = {
            current: 1,
            pageSize: 4
        }
        let res = await app.$api.article.get({ ...query, ...pages })
        if (res && res.success) {
            return {
                list: res.data[0],
                total: res.data[1],
                ...pages
            }
        }
    },
    components: {
        LoadingMore
    },
    watch: {
        $route (oldVal, newVal) {
            if (oldVal.query.category !== newVal.category || oldVal.query.cate !== newVal.cate) {
                this.pages = {
                    current: 1,
                    pageSize: 4
                }
                this.list = []
                this.total = 0
                this.getMoreData({ noMore: true })
            }
        }
    },
    data () {
        return {
            loadingMore: false,
            loadingMoreText: '努力加载中...',
            hasMore: true,
            list: [],
            total: 0,
            pages: {
                current: 1,
                pageSize: 4
            },
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
            if (((window.screen.height + scrollTop - 50) > (document.body.clientHeight)) && this.hasMore) {
                this.pages.current++
                this.loadingMore = true
                this.getMoreData({})
            }
        },
        async getMoreData ({ noMore }) {
            this.hasMore = false
            let res = await this.$api.article.get({ ...this.$route.query, ...this.pages })
            if (res && res.success) {
                this.list = this.list.concat(res.data[0])
                this.total = res.data[1]
                if (this.total > this.pages.current * this.pages.pageSize) {
                    this.loadingMore = false
                    this.loadingMoreText = '努力加载中...'
                    this.hasMore = true
                } else {
                    this.loadingMoreText = '我是有底线的'
                    this.hasMore = false
                    !noMore && (this.loadingMore = true)
                }
            }
        }
    }
}
</script>

<style>

</style>
