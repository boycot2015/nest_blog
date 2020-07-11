<template>
  <div>{{ list }}</div>
</template>

<script>
export default {
    name: 'view',
    data () {
        return {
            list: {}
        }
    },
    // asyncData({isDev, route, store, env, params, query, req, res, redirect, error}) {

    // },
    async asyncData ({ app, query }) {
        let res = await app.$api.article.get({ ...query })
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
