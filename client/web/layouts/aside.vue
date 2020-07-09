<template>
  <div class="site-aside">
    <div class="title"><i v-if="icon" :class="'icon icon-'+icon"></i>{{ title }} &nbsp; {{ total ? [total] : '' }}</div>
    <ul class="list flexbox-h just-s" v-if="data && data.length">
      <li v-for="item in data" class="list-item" :key="item.id">
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
        }
    }
}
</script>

<style>

</style>
