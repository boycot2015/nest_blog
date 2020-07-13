<template>
  <div class="loading-more">
       <span class="loading-more-text" :class="{'no-more': !showLoading}">{{ text }}</span>
  </div>
</template>

<script>
export default {
    name: 'LoadingMore',
    props: {
        text: {
            type: String,
            default: '努力加载中...'
        },
        loading: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            showLoading: true
        }
    },
    watch: {
        text (val) {
            val && (this.showLoading = false)
        }
    }
}
</script>

<style>

</style>
