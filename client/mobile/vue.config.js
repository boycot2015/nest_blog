const isPro = process.env.NODE_ENV === 'production'
const path = require('path')
const resolve = dir => {
	return path.join(__dirname, dir)
}
module.exports = {
	configureWebpack: {
		devServer: {
			disableHostCheck: true
		}
	},
	chainWebpack: config => {
		if (isPro) { // build环境
			var cdn = {
				js: ['https://cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.min.js',
					'https://cdn.jsdelivr.net/npm/vue-router@3.1.5/dist/vue-router.min.js',
					'https://cdn.jsdelivr.net/npm/vuex@3.1.2/dist/vuex.min.js',
					'https://cdn.jsdelivr.net/npm/axios@0.18.0/dist/axios.min.js',
					'https://cdn.jsdelivr.net/npm/vant@2.0/lib/vant.min.js']
			}
			config.plugin('html')
				.tap(args => {
					args[0].cdn = cdn
					return args
				})
		}
		config.resolve.alias
			.set('@', resolve('src'))
			.set('_com', resolve('src/components'))
			.set('_pages', resolve('src/pages'))
	}
}