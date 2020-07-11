<template>
    <div class="view bgc">
        <!-- {{ viewData }} -->
        <h3 class="title tl">{{ viewData.title }}</h3>
        <p class="time tl">{{ viewData.comment | getCommentNum }}条评论 - {{ new Date(viewData.createTime).getTime() | timeFilter }}</p>
        <div class="content" v-html="$options.filters.formatRichText(viewData.content)"></div>
        <div class="comment">
            <comment-tree :data="viewData.comment"></comment-tree>
        </div>
    </div>
</template>

<script>
import { CommentTree } from '@/components/Comment'
export default {
    name: 'view',
    components: {
        CommentTree
    },
    data () {
        return {
            viewData: {}
        }
    },
    // asyncData({isDev, route, store, env, params, query, req, res, redirect, error}) {

    // },
    async asyncData ({ app, query }) {
        let res = await app.$api.article.getById({ id: query.id })
        if (res && res.success) {
            return {
                viewData: res.data
            }
        }
    }
}
</script>

<style>

</style>
