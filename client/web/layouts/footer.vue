<template>
  <div class="site-footer bd-top">
        <div class="wrap w1200 flexbox-h align-c">
            <div class="left flex1 tc">
                <p>Designed By {{ websiteConfig.author }}</p>
                <p>Copyright © {{ websiteConfig.copyrightTime }}. All Rights Reserved.</p>
                <a href="http://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer">
                    <img src="@/assets/img/icon-police.png" alt="">
                    粤ICP备18002072号
                </a>
            </div>
            <div class="right tl">
                <p>
                    <i class="icon-github icon"></i>
                    Github:
                    <a
                    :href="`http://${ websiteConfig.gitHub ? websiteConfig.gitHub : 'boycot2015@github.com'}`"
                    target="_blank"
                    rel="noopener noreferrer"
                    >{{ websiteConfig.gitHub || 'boycot2015@github.com' }}
                    </a>
                </p>
                <p>
                    <i class="icon-email icon"></i>
                    邮箱:
                    <span> {{ websiteConfig.email || 'boycot2017@163.com' }}</span>
                </p>
            </div>
        </div>
  </div>
</template>

<script>
export default {
    computed: {
        websiteConfig () {
            return {
                ...this.$store.state.websiteConfig.siteConfig,
                author: 'Boycot',
                copyrightTime: new Date().getFullYear()
            }
        }
    }
}
</script>

<style>
</style>
