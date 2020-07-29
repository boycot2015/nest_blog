

<template>
	<textarea type="text" v-model="scannerMessage" ref="scanTextbox" @focus="stopKeyborad"></textarea>
</template>

<script>
	export default {
		data () {
			return {
                link: '',
                scannerMessage: ''
			}
		},
		onLoad(e) {
			this.link = e.url
        },
        methods: {
            stopKeyborad () {
                this.scannerMessage = 'asdasd'
                uni.hideKeyboard()
                // if (this.$refs.scanTextbox) {
                //     // console.dir(this.$refs.scanTextbox.$el.children[0].children[1])
                //     this.$refs.scanTextbox.$el.children[0].children[1].setAttribute('readonly', true);
                //     setTimeout(() => {
                //         this.$refs.scanTextbox.$el.children[0].children[1].removeAttribute('readonly');
                //     }, 200);
                // }
            }
        }
	}
</script>

<style scoped>
input,
textarea {
    height: 60rpx;
    border: 1px solid #000;
}
</style>
