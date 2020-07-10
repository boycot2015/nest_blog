import Vue from 'vue'
import filters from '@/filters'
// 全局过滤器
Object.keys(filters).forEach(filterName => {
    Vue.filter(filterName, filters[filterName])
})
