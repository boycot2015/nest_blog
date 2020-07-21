<template>
    <div class="article-view bgc" v-loading="loading">
        <!-- {{ viewData }} -->
        <h3 class="title tl">{{ viewData.title }}</h3>
        <p class="time tl">{{ viewData.comment | getCommentNum }}条评论 - {{ new Date(viewData.createTime).getTime() | timeFilter }}</p>
        <div class="content" v-html="$options.filters.formatRichText(viewData.content)"></div>
        <div class="comment">
            <h3 class="title">评论{{ viewData.comment.length ? `(${$options.filters.getCommentNum(viewData.comment)})`: '' }}</h3>
            <comment-tree :data="viewData.comment" @submit="onCommentSubmit" ref="commentForm"></comment-tree>
        </div>
    </div>
</template>
<script>
import { CommentTree } from '@/components/Comment'
export default {
    name: 'articleView',
    components: {
        CommentTree
    },
    head () {
        return {
            title: this.title,
            meta: [
                { charset: 'utf-8' },
                { name: 'viewport', content: 'width=device-width, initial-scale=1' },
                { hid: '博客详情', name: 'articleView', content: '博客详情' }
            ]
        }
    },
    data () {
        return {
            viewData: {},
            title: '',
            loading: true
        }
    },
    // asyncData({isDev, route, store, env, params, query, req, res, redirect, error}) {

    // },
    async asyncData ({ app, query }) {
        let res = await app.$api.article.getById({ id: query.id })
        if (res && res.success) {
            return {
                viewData: res.data,
                title: res.data.title,
                loading: false
            }
        }
    },
    methods: {
        onCommentSubmit (data) {
            this.$api.comment.add({ ...data, articleId: this.viewData.id }).then(async res => {
                let resData = await this.$api.article.getById({ id: this.viewData.id })
                this.$message.success(res.data)
                this.$refs.commentForm.reset()
                this.viewData = resData.data
            }).catch(err => {
                console.log(err)
            })
        }
    }
}
</script>
