<template>
  <div class="classes-content">
        <div class="classes-list flex3 tl">
            <div
            class="classes-list-item flexbox-h just-s"
            v-for="item in list"
            :key="item.id"
            >
            <div class="time-item flex1">
                <div class="text tr">{{ new Date(item.createTime).toLocaleString() }}</div>
                <div class="line"></div>
            </div>
            <p class="title flex3" @click="$router.push(`/article/view?id=${item.id}`)">{{ item.title }}</p>
            </div>
        </div>
        <loading-more v-if="loadingMore" :loading="loadingMore" :show-img="showImg" :has-more="hasMore" :text="loadingMoreText"></loading-more>
  </div>
</template>

<script>
import { LoadingMore } from '@/components/LoadingMore'
export default {
    name: 'articleList',
    head () {
        return {
            title: this.title || '时间轴',
            meta: [
                { charset: 'utf-8' },
                { name: 'viewport', content: 'width=device-width, initial-scale=1' },
                { hid: '时间轴', name: 'articleList', content: '记录近期发布的文章' }
            ]
        }
    },
    components: {
        LoadingMore
    },
    data () {
        return {
            list: {},
            loadingMore: false,
            loadingMoreText: '努力加载中...',
            hasMore: true,
            canQuery: true, // 滚动判断是否可以加载数据
            total: 0,
            pages: {
                current: 1,
                pageSize: 100
            },
            showImg: false
        }
    },
    // watchQuery: ['category'],
    // asyncData({isDev, route, store, env, params, query, req, res, redirect, error}) {

    // },
    async asyncData ({ app, query }) {
        let res = await app.$api.article.get({ ...query, pageSize: 100, order: 'DESC' })
        if (res && res.success) {
            return {
                list: res.data[0]
            }
        }
        if (res && res.success) {
            return {
                list: res.data[0],
                total: res.data[1],
                loadingMoreText: res.data[0].length ? '努力加载中...' : '没有更多数据了~',
                loadingMore: !res.data[0].length,
                hasMore: res.data[0].length,
                showImg: !res.data[0].length
            }
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
