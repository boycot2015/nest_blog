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
  </div>
</template>

<script>
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
    data () {
        return {
            list: {}
        }
    },
    // watchQuery: ['category'],
    // asyncData({isDev, route, store, env, params, query, req, res, redirect, error}) {

    // },
    async asyncData ({ app, query }) {
        let res = await app.$api.article.get({ ...query, pageSize: 1000, order: 'DESC' })
        if (res && res.success) {
            return {
                list: res.data[0]
            }
        }
    }
}
</script>

<style>
</style>
