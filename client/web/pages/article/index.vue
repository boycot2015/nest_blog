<template>
    <div>时间轴</div>
</template>

<script>
export default {
    async asyncData ({ app, params, query }) {
        let pages = {
            current: 1,
            pageSize: 10
        }
        let res = await app.$api.article.get({ ...query, ...pages })
        console.log(res, { ...query, ...pages }, 'queryqueryqueryquery')
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
