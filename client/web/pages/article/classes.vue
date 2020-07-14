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
    data () {
        return {
            list: {}
        }
    },
    // asyncData({isDev, route, store, env, params, query, req, res, redirect, error}) {

    // },
    async asyncData ({ app, query }) {
        let res = await app.$api.article.get({ ...query, order: 'DESC' })
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
