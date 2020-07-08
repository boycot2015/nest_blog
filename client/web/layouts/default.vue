<template>
  <div class="root tc" ref="rootDom" :class="{'night': isNight}">
    <Header :class="{ 'fixed': isHeadFixed }" @on-night=" (val) => isNight = val"></Header>
    <div class="root-main clearfix" :style="{marginTop: isHeadFixed ? '80px' : '20px'}">
      <div class="root-main-container fl">
        <Nuxt />
      </div>
      <div
      class="right fr"
      :class="{ 'fixed': isAsideFixed, 'active': isHeadFixed }"
      >
          <Aside
          title="标签"
          :data="tagList"
          :props="{
                key: 'articleNum',
                value: 'value'
            }"
        ></Aside>
          <Aside title="分类" :data="categoryList"></Aside>
      </div>
    </div>
    <Footer></Footer>
  </div>
</template>
<script>
import Header from './header'
import Footer from './footer'
import Aside from './aside'
export default {
    components: {
        Header,
        Footer,
        Aside
    },
    data () {
        return {
            categoryList: [],
            tagList: [],
            isHeadFixed: false,
            isAsideFixed: false,
            scrollObj: {},
            isNight: false
        }
    },
    async asyncData ({ app }) {
        let [tagRes, categoryRes] = await Promise.all([app.$api.tag.get(), app.$api.category.get()])
        console.log(tagRes, categoryRes)
        return {
            categoryList: [tagRes, categoryRes]
        }
    },
    watch: {
        isNight (val) {
            val && window.localStorage.setItem('theme', val)
            !val && window.localStorage.removeItem('theme')
            val && (document.documentElement.style.backgroundColor = '#000000')
            !val && (document.documentElement.style.backgroundColor = '#f8f8f8')
        }
    },
    created () {
        this.getInitData()
    },
    mounted () {
        this.scroll((res) => {
            if (res || this.scrollObj.scrollTop === 0) {
                this.isHeadFixed = false
            } else {
                this.isHeadFixed = true
            }
        })
    },
    methods: {
        async getInitData () {
            let [tagRes, categoryRes] = await Promise.all([this.$api.tag.get(), this.$api.category.get()])
            this.categoryList = categoryRes.data[0]
            this.tagList = tagRes.data[0]
            console.log(this.tagList)
        },
        scroll (fn) {
            let beforeScrollTop = document.scrollingElement.scrollTop
            fn = fn || function () {}
            window.addEventListener('scroll', () => {
                var afterScrollTop = document.scrollingElement.scrollTop
                this.scrollObj.scrollTop = document.scrollingElement.scrollTop
                this.scrollObj.value = afterScrollTop - beforeScrollTop
                if (afterScrollTop >= 60) {
                    this.isAsideFixed = true
                } else {
                    this.isAsideFixed = false
                }
                if (this.scrollObj.value === 0) { return false }
                fn(this.scrollObj.value > 0)
                beforeScrollTop = afterScrollTop
            })
        }
    }
}
</script>
<style>
html {
  font-family: "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, "Helvetica Neue", Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
}

.button--green {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #3b8070;
  color: #3b8070;
  text-decoration: none;
  padding: 10px 30px;
}

.button--green:hover {
  color: #fff;
  background-color: #3b8070;
}

.button--grey {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #35495e;
  color: #35495e;
  text-decoration: none;
  padding: 10px 30px;
  margin-left: 15px;
}

.button--grey:hover {
  color: #fff;
  background-color: #35495e;
}
</style>
