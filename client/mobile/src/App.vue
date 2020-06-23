<script>
	export default {
		data () {
			return {
				userAgent: ''
			}
		},
		onLaunch: function() {
			console.log('App Launch')
			this.userAgent = navigator.userAgent
			window.addEventListener('resize', () => {
				// if (/(iPhone|iPad|iPod|iOS|Android)/i.test(navigator.userAgent)) { //移动端
				//     //TODO
				// }
				if (this.userAgent !== navigator.userAgent) {
					window.location.reload(true)
					this.setState({
						userAgent: navigator.userAgent
					})
				}
			})
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>
<style lang="scss">
	/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
	@import "uview-ui/index.scss";
	@import "/static/scss/index.scss";
</style>
<style>
	/*每个页面公共css */
</style>
