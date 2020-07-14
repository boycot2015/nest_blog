<template>
  <div class="site-aside">
    <div class="title clearfix">
        <i v-if="icon" :class="'icon icon-'+icon"></i>{{ title }} &nbsp; {{ total ? [total] : '' }}
        <span class="more fr" v-if="showMore" @click="$router.push('/article')">全部 <i class="more icon-more"></i></span>
    </div>
    <ul class="list flexbox-h just-s" v-if="data && data.length">
      <li v-for="item in data" class="list-item" :key="item.id" @click="onTagClick(item)">
        <span>
            {{ item[props['value']] }}
            {{ item[props['key']] ? '&nbsp;[' + item[props['key']] + ']' : '' }}
        </span>
      </li>
    </ul>
    <slot></slot>
  </div>
</template>

<script>
export default {
    props: {
        title: {
            type: String,
            default: ''
        },
        total: {
            type: [String, Number],
            default: 0
        },
        data: {
            type: Array,
            default: () => []
        },
        icon: {
            type: String,
            default: ''
        },
        props: {
            type: Object,
            default: () => ({
                key: 'num',
                value: 'value'
            })
        },
        showMore: {
            type: Boolean,
            default: true
        }
    },
    methods: {
        onTagClick (item) {
            if (this.title.includes('分类')) {
                this.$router.push('/article?category=' + item.id)
            } else {
                this.$router.push('/article?tag=' + item.id)
            }
        }
    }
}
</script>

<style>

</style>
