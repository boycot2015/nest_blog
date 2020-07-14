<template>
    <div class="about pd20 bgf">
        <div class="title flexbox-h align-c just-c">
            <h3>关于我</h3>
        </div>
        <div class="bg">
            <img src="@/assets/img/about.jpg" alt="" title="程序猿">
        </div>
        <div class="content tl">
            <div class="content-section">
                <p class="desc">{{ websiteConfig.description }}</p>
                <ul class="list">
                    <li class="list-item flexbox-h just-s" v-for="item in websiteConfig.list" :key="item.name">
                        <span class="name tr" v-if="item.name">{{ item.name }}:</span>
                        <span class="value flex4">{{ item.value }}</span>
                        <!-- {{ item.name }}: {{ item.value }} -->
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    head () {
        return {
            title: this.title,
            meta: [
                { charset: 'utf-8' },
                { name: 'viewport', content: 'width=device-width, initial-scale=1' },
                { hid: '关于我', name: 'aboutme', content: 'aboutme' }
            ]
        }
    },
    data () {
        return {
            aboutData: {
                technology: {
                    name: '',
                    value: ''
                }
            },
            title: '关于我'
        }
    },
    computed: {
        websiteConfig () {
            return {
                ...this.$store.state.websiteConfig.siteConfig,
                ...this.$store.state.aboutData
            }
        }
    }
}
</script>

<style>

</style>
